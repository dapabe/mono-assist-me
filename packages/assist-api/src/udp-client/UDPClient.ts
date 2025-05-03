import { Buffer } from 'buffer';
import { ZodError } from 'zod';

import { SocketAdapter } from './abstract-adapter';
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

type ISocketClientOptions = {
  address: string;
  adapter: SocketAdapter;
  store: IRoomState;
};

export class UdpSocketClient implements ISocketClient {
  private static instance: UdpSocketClient;
  private config: ISocketClientOptions;

  private HEARTBEAT_INTERVAL!: NodeJS.Timeout;
  private HEARTBEAT_EXPIRATION = 30_000 as const;

  private HELP_INTERVAL!: NodeJS.Timeout;
  private HELP_EXPIRATION = 5000 as const;

  /** Fun port */
  static DISCOVERY_PORT = 42069 as const;
  static BROADCAST_ADDRESS = '255.255.255.255' as const;

  constructor(config: ISocketClientOptions) {
    // if (UdpSocketClient.instance) return UdpSocketClient.instance;
    this.config = config;
    this.runHeartbeatChecks = this.runHeartbeatChecks.bind(this);
    this.parseMessage = this.parseMessage.bind(this);
  }

  // public static getInstance(config: ISocketClientOptions): UdpSocketClient {
  //   if (!UdpSocketClient.instance) {
  //     UdpSocketClient.instance = new UdpSocketClient(config);
  //   }
  //   return UdpSocketClient.instance;
  // }

  init(): void {
    try {
      // if (UdpSocketClient.instance) return;
      this.config.adapter.addAfterListening(this.runHeartbeatChecks);
      this.config.adapter.init(
        UdpSocketClient.DISCOVERY_PORT,
        this.config.address,
        this.parseMessage
      );
      this.config.store.updateConnectionMethod(ConnMethod.LANSocket, this);
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
      this.config.store.updateConnectionMethod(ConnMethod.None, null);
      console.log('[UDP] Closed');
    }
  }

  sendTo(port: number, address: string, data: IRoomEvent): void {
    const buf = Buffer.from(JSON.stringify(data));
    this.config.adapter.sendTo(port, address, buf);
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
        const { event, ...payload } = data;
        this.config.store.onRemoteRespondToAdvertise(payload, rinfo);
        break;
      }
      case RoomEventLiteral.BroadcastStop: {
        const { event, ...payload } = data;
        this.config.store.onRemoteBroadcastStop(payload);
        break;
      }
      case RoomEventLiteral.Listening: {
        const { event, ...payload } = data;
        this.config.store.onReceiverListening(payload, rinfo);
        break;
      }
      case RoomEventLiteral.NotListening: {
        const { event, ...payload } = data;
        this.config.store.onRemoteNotListening(payload);
        break;
      }
      case RoomEventLiteral.RequestHelp: {
        const { event, ...payload } = data;
        this.config.store.onEmitterRequestHelp(payload);
        break;
      }
      case RoomEventLiteral.RequestStop: {
        const { event, ...payload } = data;
        this.config.store.onEmitterStopsHelpRequest(payload);
        break;
      }
      case RoomEventLiteral.RespondToHelp: {
        const { event, ...payload } = data;
        this.config.store.updateIncomingResponder(payload);
        setTimeout(
          () => this.config.store.updateIncomingResponder({ responderName: null }),
          10_000
        );
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
        const { event, ...payload } = data;
        this.config.store.onRemoteStatusResponse(payload, rinfo);
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
    }, this.HEARTBEAT_EXPIRATION);
    console.log('[Device] Heartbeat attached');
  };

  sendDiscovery() {
    console.log('[UDP] Sending discovery');
    this.sendTo(UdpSocketClient.DISCOVERY_PORT, UdpSocketClient.BROADCAST_ADDRESS, {
      event: RoomEventLiteral.LookingForDevices,
    });
  }

  requestHelp() {
    if (!this.config.store.currentListeners.length) {
      console.log('[UDP] No current listeners');
      return;
    }
    this.HELP_INTERVAL = setInterval(() => {
      /**
       *  By the time someone responds the interval will clear itself
       */
      if (!this.config.store.currentListeners.length || this.config.store.incomingResponder) {
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
