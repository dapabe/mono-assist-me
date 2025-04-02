import { Buffer } from 'buffer';
import { ZodError } from 'zod';

import { SocketAdapter } from './abstract-adapter';
import { IRoomEvent, RoomEventLiteral, RoomEventSchema } from '../schemas/RoomEvent.schema';
import { stringToJSONSchema } from '../schemas/utils.schema';
import { useRoomStore } from '../store/useRoomStore';
import { RemoteUDPInfo } from '../types/room.context';
import { FnSocketMessage, ISocketClient } from '../types/socket-adapter';

type ISocketClientOptions = {
  port: number;
  address: string;
  adapter: SocketAdapter;
};

export class UdpSocketClient implements ISocketClient<UdpSocketClient> {
  private config: ISocketClientOptions;
  private store() {
    return useRoomStore.getState();
  }

  private HEARTBEAT_INTERVAL!: NodeJS.Timeout;
  private HEARTBEAT_EXPIRATION = 30_000 as const;

  private HELP_INTERVAL!: NodeJS.Timeout;
  private HELP_EXPIRATION = 5000 as const;

  static DISCOVERY_PORT = 42069 as const;
  static BROADCAST_ADDRESS = '255.255.255.255' as const;

  constructor(config: ISocketClientOptions) {
    this.config = config;
  }
  async init(): Promise<UdpSocketClient> {
    try {
      this.config.adapter.addAfterListening(this.runHeartbeatChecks);
      this.config.adapter.init(this.config.port, this.config.address, (data, rinfo) => {
        this.parseMessage((data) => {
          if (data instanceof ZodError) {
            this.sendTo(rinfo.port, rinfo.address, {
              event: RoomEventLiteral.Invalid,
              message: data.toString(),
            });
          } else {
            this.handleMessage(data, rinfo);
          }
        })(data, rinfo);
      });
    } catch (error) {
      console.log(`[SocketClient]: ${error}`);
      this.close();
    }
    return this;
  }

  close(): void {
    if (this.HEARTBEAT_INTERVAL) clearInterval(this.HEARTBEAT_INTERVAL);
    this.config.adapter.close();
  }

  sendTo(port: number, address: string, data: IRoomEvent): void {
    this.config.adapter.sendTo(port, address, Buffer.from(JSON.stringify(data)));
  }

  private parseMessage(cb: FnSocketMessage) {
    return (data: unknown, rinfo: RemoteUDPInfo): void => {
      if (!Buffer.isBuffer(data))
        return cb(ZodError.create([{ code: 'custom', message: 'Invalid Buffer', path: [] }]));
      // Prevent self-broadcast from processing
      if (rinfo.address === this.config.address) return;
      // Validate transmited data
      const msg = data.toString();
      const val = stringToJSONSchema.safeParse(msg);
      if (val.error) return cb(val.error);
      const event = RoomEventSchema.safeParse(val);
      return cb(event.data ?? event.error);
    };
  }

  private handleMessage(data: IRoomEvent, rinfo: RemoteUDPInfo) {
    switch (data.event) {
      case RoomEventLiteral.LookingForDevices: {
        this.sendTo(rinfo.port, rinfo.address, {
          event: RoomEventLiteral.RespondToAdvertise,
          appId: this.store().getAppId(),
          callerName: this.store().getCurrentName(),
          device: this.store().currentDevice ?? 'Unknown',
        });
        break;
      }
      case RoomEventLiteral.RespondToAdvertise: {
        let { event, ...payload } = data;
        this.store().onRemoteRespondToAdvertise(payload, rinfo);
        break;
      }
      case RoomEventLiteral.BroadcastStop: {
        let { event, ...payload } = data;
        this.store().onRemoteBroadcastStop(payload);
        break;
      }
      case RoomEventLiteral.Listening: {
        let { event, ...payload } = data;
        this.store().onReceiverListening(payload, rinfo);
        break;
      }
      case RoomEventLiteral.NotListening: {
        let { event, ...payload } = data;
        this.store().onRemoteNotListening(payload);
        break;
      }
      case RoomEventLiteral.RequestHelp: {
        let { event, ...payload } = data;
        this.store().onEmitterRequestHelp(payload);
        break;
      }
      case RoomEventLiteral.RequestStop: {
        let { event, ...payload } = data;
        this.store().onEmitterStopsHelpRequest(payload);
        break;
      }
      case RoomEventLiteral.RespondToHelp: {
        let { event, ...payload } = data;
        clearInterval(this.HEARTBEAT_INTERVAL);
        this.store().updateIncomingResponder(payload);
        break;
      }
      case RoomEventLiteral.AnnieAreYouOkay: {
        this.sendTo(rinfo.port, rinfo.address, {
          event: RoomEventLiteral.ImOkay,
          appId: this.store().getAppId(),
        });
        break;
      }
      case RoomEventLiteral.ImOkay: {
        let { event, ...payload } = data;
        this.store().onRemoteStatusResponse(payload, rinfo);
        break;
      }
    }
  }

  private runHeartbeatChecks() {
    console.log(this.store());
    this.HEARTBEAT_INTERVAL = setInterval(() => {
      try {
        // Get ports and addresses from current rooms
        const merged = this.store().getMergedRooms();

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
        [...this.store().scheduledToCheck.entries()].forEach(([appId, v]) => {
          // If the device hasnt responded in the last HEARTBEAT
          if (now - v.lastPing > this.HEARTBEAT_EXPIRATION) {
            // Disconnect it or remove it
            this.store().onDeviceCleanUp(appId);
            console.log(`[Device] No signal from '${v.address}:${v.port}' removing`);
          }
        });
      } catch (error) {
        console.log(error);
        clearInterval(this.HEARTBEAT_INTERVAL);
      }
    }, this.HEARTBEAT_EXPIRATION);
    console.log('[Device] Heartbeat attached');
  }

  sendDiscovery() {
    this.sendTo(UdpSocketClient.DISCOVERY_PORT, UdpSocketClient.BROADCAST_ADDRESS, {
      event: RoomEventLiteral.LookingForDevices,
    });
  }

  requestHelp() {
    if (!this.store().currentListeners.size) return;
    this.HELP_INTERVAL = setInterval(() => {
      if (!this.store().currentListeners.size || this.store().incomingResponder) {
        return clearInterval(this.HELP_INTERVAL);
      }
      this.store().currentListeners.forEach((x) => {
        this.sendTo(x.port, x.address, {
          event: RoomEventLiteral.RequestHelp,
          callerName: this.store().getCurrentName(),
          appId: this.store().getAppId(),
        });
      });
    }, this.HELP_EXPIRATION);
  }
}
