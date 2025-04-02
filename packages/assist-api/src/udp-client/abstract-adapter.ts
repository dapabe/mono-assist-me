import { Socket } from 'node:dgram';
import UdpSocket from 'react-native-udp/lib/types/UdpSocket';

import { ISocketAdapter, ISocketIncomingMessage } from '../types/socket-adapter';

export abstract class SocketAdapter<T = UdpSocket | Socket> implements ISocketAdapter {
  protected sk!: T;

  protected afterListeningRef!: () => void;

  addAfterListening(cb: () => void): void {
    this.afterListeningRef = cb;
  }
  abstract init: (port: number, address: string, parser: ISocketIncomingMessage) => void;

  close(): void {
    //@ts-ignore
    this.sk.close(() => {
      this.sk = undefined!;
    });
  }
  sendTo(port: number, address: string, data: Buffer<ArrayBuffer>): void {
    //@ts-ignore
    this.sk.send(data, 0, data.length, port, address);
  }
}
