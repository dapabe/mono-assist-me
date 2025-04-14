import { Buffer } from 'buffer';
import { ZodError } from 'zod';

import {
  ConnMethod,
  IRoomEvent,
  RoomEventLiteral,
  RoomEventSchema,
} from '../schemas/RoomEvent.schema';
import { stringToJSONSchema } from '../schemas/utils.schema';
import { IRoomState } from '../store/useRoomStore';
import { RemoteUDPInfo } from '../types/room.context';
import { ISocketClient } from '../types/socket-adapter';
import { SocketAdapter } from './abstract-adapter';

type ISocketClientOptions = {
  port: number;
  address: string;
  adapter: SocketAdapter;
  store: IRoomState;
};

export class UdpSocketClient implements ISocketClient {
  private config: ISocketClientOptions;

  private HEARTBEAT_INTERVAL!: NodeJS.Timeout;
  private HEARTBEAT_EXPIRATION = 30_000 as const;

  private HELP_INTERVAL!: NodeJS.Timeout;
  private HELP_EXPIRATION = 5000 as const;

  static DISCOVERY_PORT = 42069 as const;
  static BROADCAST_ADDRESS = '255.255.255.255' as const;

  constructor(config: ISocketClientOptions) {
    this.config = config;
  }
  async init(): Promise<void> {
    try {
      if (!this.config.store) throw new Error('Store not defined');
      this.config.adapter.addAfterListening(this.runHeartbeatChecks);
      await this.config.adapter.init(this.config.port, this.config.address, this.parseMessage);
      this.config.store.updateConnectionMethod(ConnMethod.LANSocket, this);
      console.log('[UDP] Initialized');
    } catch (error) {
      console.log(`[UDP]: ${error}`);
      this.close();
    }
  }

  close(): void {
    if (this.HEARTBEAT_INTERVAL) {
      clearInterval(this.HEARTBEAT_INTERVAL);
      this.HEARTBEAT_INTERVAL = undefined!;
    }
    this.config.adapter.close();
    this.config.store.updateConnectionMethod(ConnMethod.None, null);
    console.log('[UDP] Closed');
  }

  sendTo(port: number, address: string, data: IRoomEvent): void {
    this.config.adapter.sendTo(port, address, Buffer.from(JSON.stringify(data)));
  }

  private parseMessage(data: unknown, rinfo: RemoteUDPInfo): void {
    try {
      if (!Buffer.isBuffer(data)) {
        throw ZodError.create([{ code: 'custom', message: 'Invalid Buffer', path: [] }]);
      }
      // Prevent self-broadcast from processing
      if (rinfo.address === this.config.address) return;
      // Validate transmited data
      const msg = data.toString();
      const val = stringToJSONSchema.safeParse(msg);
      if (val.error) throw val.error;

      const event = RoomEventSchema.safeParse(val);
      if (event.error) throw event.error;

      console.log(`[UDP] Event '${event.data.event}'`);
      this.handleMessage(event.data, rinfo);
    } catch (error) {
      if (error instanceof ZodError) {
        this.sendTo(rinfo.port, rinfo.address, {
          event: RoomEventLiteral.Invalid,
          message: error.toString(),
        });
      } else {
        console.log(`[UDP] Unhandled error: ${error}`);
      }
    }
  }

  private handleMessage(data: IRoomEvent, rinfo: RemoteUDPInfo) {
    switch (data.event) {
      case RoomEventLiteral.LookingForDevices: {
        this.sendTo(rinfo.port, rinfo.address, {
          event: RoomEventLiteral.RespondToAdvertise,
          appId: this.config.store.getAppId(),
          callerName: this.config.store.getCurrentName(),
          device: this.config.store.currentDevice ?? 'Unknown',
        });
        break;
      }
      case RoomEventLiteral.RespondToAdvertise: {
        let { event, ...payload } = data;
        this.config.store.onRemoteRespondToAdvertise(payload, rinfo);
        break;
      }
      case RoomEventLiteral.BroadcastStop: {
        let { event, ...payload } = data;
        this.config.store.onRemoteBroadcastStop(payload);
        break;
      }
      case RoomEventLiteral.Listening: {
        let { event, ...payload } = data;
        this.config.store.onReceiverListening(payload, rinfo);
        break;
      }
      case RoomEventLiteral.NotListening: {
        let { event, ...payload } = data;
        this.config.store.onRemoteNotListening(payload);
        break;
      }
      case RoomEventLiteral.RequestHelp: {
        let { event, ...payload } = data;
        this.config.store.onEmitterRequestHelp(payload);
        break;
      }
      case RoomEventLiteral.RequestStop: {
        let { event, ...payload } = data;
        this.config.store.onEmitterStopsHelpRequest(payload);
        break;
      }
      case RoomEventLiteral.RespondToHelp: {
        let { event, ...payload } = data;
        clearInterval(this.HEARTBEAT_INTERVAL);
        this.config.store.updateIncomingResponder(payload);
        break;
      }
      case RoomEventLiteral.AnnieAreYouOkay: {
        this.sendTo(rinfo.port, rinfo.address, {
          event: RoomEventLiteral.ImOkay,
          appId: this.config.store.getAppId(),
        });
        break;
      }
      case RoomEventLiteral.ImOkay: {
        let { event, ...payload } = data;
        this.config.store.onRemoteStatusResponse(payload, rinfo);
        break;
      }
    }
  }

  private runHeartbeatChecks() {
    this.HEARTBEAT_INTERVAL = setInterval(() => {
      try {
        // Get ports and addresses from current rooms
        const merged = this.config.store.getMergedRooms();

        if (!merged.length) {
          return;
        }

        // Wait for response from each device
        // if it responds it's added to "scheduledToCheck"
        merged.forEach((r) => {
          this.sendTo(r.port, r.address, {
            event: RoomEventLiteral.AnnieAreYouOkay,
          });
        });

        // Check for unresponsive devices
        const now = Date.now();
        [...this.config.store.scheduledToCheck.entries()].forEach(([appId, v]) => {
          // If the device hasnt responded in the last HEARTBEAT
          if (now - v.lastPing > this.HEARTBEAT_EXPIRATION) {
            // Disconnect it or remove it
            this.config.store.onDeviceCleanUp(appId);
            console.log(`[Device] No signal from '${v.address}:${v.port}' removing`);
          }
        });
      } catch (error: any) {
        console.log(`[Device] Hearbeat error: ${error.message as string}`);
        this.close();
      }
    }, this.HEARTBEAT_EXPIRATION);
    console.log('[Device] Heartbeat attached');
  }

  sendDiscovery() {
    console.log('[UDP] Sending discovery');
    this.sendTo(UdpSocketClient.DISCOVERY_PORT, UdpSocketClient.BROADCAST_ADDRESS, {
      event: RoomEventLiteral.LookingForDevices,
    });
  }

  requestHelp() {
    if (!this.config.store.currentListeners.size) {
      console.log('[UDP] No current listeners');
      return;
    }
    this.HELP_INTERVAL = setInterval(() => {
      if (!this.config.store.currentListeners.size || this.config.store.incomingResponder) {
        clearInterval(this.HELP_INTERVAL);
        this.HELP_INTERVAL = undefined!;
        return;
      }
      this.config.store.currentListeners.forEach((x) => {
        this.sendTo(x.port, x.address, {
          event: RoomEventLiteral.RequestHelp,
          callerName: this.config.store.getCurrentName(),
          appId: this.config.store.getAppId(),
        });
      });
    }, this.HELP_EXPIRATION);
  }
}
