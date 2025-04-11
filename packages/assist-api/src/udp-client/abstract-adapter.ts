import type { Socket } from 'node:dgram';
import type UdpSocket from 'react-native-udp/lib/types/UdpSocket';

import type { ISocketAdapter, ISocketIncomingMessage } from '../types/socket-adapter';

export abstract class SocketAdapter<T = UdpSocket | Socket> implements ISocketAdapter {
  protected sk!: T;

  protected afterListeningRef!: () => void;

  isRunning() {
    return !!this.sk;
  }

  addAfterListening(cb: () => void): void {
    this.afterListeningRef = cb;
  }
  abstract init: (port: number, address: string, parser: ISocketIncomingMessage) => Promise<void>;

  close(): void {
    if (!this.isRunning()) throw new Error('not_running');
    //@ts-ignore
    this.sk.close(() => {
      this.sk = undefined!;
    });
  }
  sendTo(port: number, address: string, data: Buffer<ArrayBuffer>): void {
    if (!this.isRunning()) throw new Error('not_running');
    //@ts-ignore
    this.sk.send(data, 0, data.length, port, address);
  }
}
