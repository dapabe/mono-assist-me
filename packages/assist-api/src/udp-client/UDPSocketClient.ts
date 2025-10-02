import { createId } from '@paralleldrive/cuid2';
import { Buffer } from 'buffer';
import { ZodError } from 'zod';

import { SocketAdapter } from './abstract-adapter';
import { UDP_CONSTANTS } from './udp-constants';
import {
  ConnMethod,
  IRoomEvent,
  IRoomPacket,
  RoomEventLiteral,
  RoomPacketSchema,
} from '../schemas/RoomEvent.schema';
import { stringToJSONSchema } from '../schemas/utils.schema';
import { IRoomState } from '../store/useRoomStore';
import { RemoteUDPInfo } from '../types/room.context';
import { ISocketClient } from '../types/socket-adapter';

type ISocketClientOptions = {
  address: string;
  adapter: SocketAdapter;
  store: IRoomState;
};

export class UdpSocketClient implements ISocketClient {
  // private static instance: UdpSocketClient;
  private config: ISocketClientOptions;
  private getStore(): IRoomState {
    return this.config.store;
  }

  private HEARTBEAT_INTERVAL!: number;
  private HEARTBEAT_EXPIRATION = 30_000 as const;

  private HELP_INTERVAL!: number;
  private HELP_EXPIRATION = 5000 as const;

  private RepeatedIds = new Set<string>();

  constructor(config: ISocketClientOptions) {
    // if (UdpSocketClient.instance) return UdpSocketClient.instance;
    this.config = config;
    this.runHeartbeatChecks = this.runHeartbeatChecks.bind(this);
    this.parseMessage = this.parseMessage.bind(this);
  }

  init(): void {
    try {
      // if (UdpSocketClient.instance) return;
      this.config.adapter.addAfterListening(this.runHeartbeatChecks);
      this.config.adapter.init(
        UDP_CONSTANTS.DISCOVERY_PORT,
        this.config.address,
        this.parseMessage
      );
      this.getStore().updateConnectionMethod(ConnMethod.LANSocket, this);
      // UdpSocketClient.instance = this;
      console.log('[UDP] Initialized');
    } catch (error) {
      console.log(`[UDP] Error ${error}`);
      this.close();
    }
  }

  close(): void {
    if (this.HEARTBEAT_INTERVAL) {
      clearInterval(this.HEARTBEAT_INTERVAL);
      this.HEARTBEAT_INTERVAL = undefined!;
      this.config.adapter.close();
      this.getStore().updateConnectionMethod(ConnMethod.None, null);
      console.log('[UDP] Closed');
    }
  }

  sendTo(port: number, address: string, data: IRoomEvent): void {
    const buf = Buffer.from(
      JSON.stringify({
        id: createId(),
        data,
      } satisfies IRoomPacket)
    );
    this.config.adapter.sendTo(port, address, buf);
  }

  sendDiscovery() {
    console.log('[UDP] Sending discovery');
    this.sendTo(UDP_CONSTANTS.DISCOVERY_PORT, UDP_CONSTANTS.MULTICAST_ADDRESS, {
      event: RoomEventLiteral.LookingForDevices,
    });
  }

  private parseMessage(data: unknown, rinfo: RemoteUDPInfo): void {
    try {
      if (!Buffer.isBuffer(data)) {
        throw ZodError.create([{ code: 'custom', message: 'Invalid Buffer', path: [] }]);
      }
      // Prevent self-broadcast from processing
      if (rinfo.address === this.config.adapter.currentAddress) return;
      // Validate transmited data
      const msg = data.toString();
      const parsed = stringToJSONSchema.parse(msg);
      const packet = RoomPacketSchema.parse(parsed);
      console.log(
        `[UDP] Event '${Object.keys(RoomEventLiteral)[packet.data.event]}' from ${rinfo.address}:${rinfo.port} ${new Date().toLocaleTimeString(undefined, { hour12: true })}`
      );
      if (this.RepeatedIds.has(packet.id)) return;
      // console.log(`[UDP] Dupped msg from ${rinfo.address} - ${packet.id}`);
      this.RepeatedIds.add(packet.id);
      this.handleMessage(packet.data, rinfo);
    } catch (error) {
      if (!Buffer.isBuffer(data)) return console.log(`[UDP] Data is not buffer: ${data}`);
      if (error instanceof ZodError) {
        console.log(`[UDP] Buffer error: ${data.toString()}`);
        // this.sendTo(rinfo.port, rinfo.address, {
        //   event: RoomEventLiteral.Invalid,
        //   message: error.toString(),
        // });
      } else console.log(`[UDP] Parse error: ${data}`);
    }
  }

  private handleMessage(data: IRoomEvent, rinfo: RemoteUDPInfo) {
    const { event, ...payload } = data;
    switch (event) {
      case RoomEventLiteral.LookingForDevices: {
        this.sendTo(rinfo.port, rinfo.address, {
          event: RoomEventLiteral.RespondToAdvertise,
          appId: this.getStore().getAppId(),
          callerName: this.getStore().getCurrentName(),
          device: this.getStore().currentDevice ?? 'Unknown',
        });
        break;
      }
      case RoomEventLiteral.RespondToAdvertise: {
        this.getStore().onRemoteRespondToAdvertise(payload as any, rinfo);
        break;
      }
      case RoomEventLiteral.BroadcastStop: {
        this.getStore().onRemoteBroadcastStop(payload as any);
        break;
      }
      case RoomEventLiteral.Listening: {
        this.getStore().onReceiverListening(payload as any, rinfo);
        break;
      }
      case RoomEventLiteral.NotListening: {
        this.getStore().onRemoteNotListening(payload as any);
        break;
      }
      case RoomEventLiteral.RequestHelp: {
        this.getStore().onEmitterRequestHelp(payload as any);
        break;
      }
      case RoomEventLiteral.RequestStop: {
        this.getStore().onEmitterStopsHelpRequest(payload as any);
        break;
      }
      case RoomEventLiteral.RespondToHelp: {
        this.getStore().updateIncomingResponder(payload as any);
        setTimeout(
          () => this.getStore().updateIncomingResponder({ responderName: null } as any),
          10_000
        );
        break;
      }
      case RoomEventLiteral.AnnieAreYouOkay: {
        this.sendTo(rinfo.port, rinfo.address, {
          event: RoomEventLiteral.ImOkay,
          appId: this.getStore().getAppId(),
        });
        break;
      }
      case RoomEventLiteral.ImOkay: {
        this.getStore().onRemoteStatusResponse(payload as any, rinfo);
        break;
      }
    }
  }

  /**
   *  Using `this` in this scope and attaching it as a ref to other adapters loses its reference,
   *  its better to make this an arrow function.
   */
  private runHeartbeatChecks = () => {
    this.HEARTBEAT_INTERVAL = setInterval(() => {
      this.RepeatedIds.clear();

      // Get ports and addresses from current rooms
      const merged = this.getStore().getMergedRooms();

      if (!merged.length) {
        return;
      }

      // Wait for response from each device
      // if it responds it's added to "scheduledToCheck"
      merged.forEach((r) => {
        console.log(
          `[UDP] Send '${Object.keys(RoomEventLiteral)[RoomEventLiteral.AnnieAreYouOkay]}' to ${r.address}:${r.port}`
        );
        this.sendTo(r.port, r.address, {
          event: RoomEventLiteral.AnnieAreYouOkay,
        });
      });

      // Check for unresponsive devices
      const now = Date.now();
      [...this.getStore().scheduledToCheck.entries()].forEach(([appId, v]) => {
        // If the device hasnt responded in the last HEARTBEAT
        if (now - v.lastPing > this.HEARTBEAT_EXPIRATION) {
          // Disconnect it or remove it
          this.getStore().onDeviceCleanUp(appId);
          console.log(`[UDP] No signal from '${v.address}:${v.port}' removing`);
        }
      });
    }, this.HEARTBEAT_EXPIRATION);
    console.log('[UDP] Heartbeat attached');
  };

  requestHelp() {
    if (this.getStore().incomingResponder || !this.getStore().currentListeners.length) {
      console.log('[UDP] Incoming responder or no current listeners');
      return;
    }
    this.HELP_INTERVAL = setInterval(() => {
      /**
       *  By the time someone responds the interval will clear itself
       */
      if (!this.getStore().currentListeners.length || this.getStore().incomingResponder) {
        clearInterval(this.HELP_INTERVAL);
        this.HELP_INTERVAL = undefined!;
        return;
      }
      this.getStore().currentListeners.forEach((x) => {
        this.sendTo(x.port, x.address, {
          event: RoomEventLiteral.RequestHelp,
          callerName: this.getStore().getCurrentName(),
          appId: this.getStore().getAppId(),
        });
      });
    }, this.HELP_EXPIRATION);
  }
}
