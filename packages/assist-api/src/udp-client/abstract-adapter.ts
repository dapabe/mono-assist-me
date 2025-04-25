import type { Socket } from 'node:dgram';
import type UdpSocket from 'react-native-udp/lib/types/UdpSocket';

import type { ISocketAdapter, ISocketIncomingMessage } from '../types/socket-adapter';

export abstract class SocketAdapter<T = UdpSocket | Socket> implements ISocketAdapter {
  protected sk!: T;
  /**
   *  Max UDP safe packet size
   * @link https://nodejs.org/api/dgram.html#note-about-udp-datagram-size
   */
  private readonly MAX_PACKET_SIZE = 576;

  protected afterListeningRef!: () => void;

  isRunning() {
    return !!this.sk;
  }

  addAfterListening(cb: () => void): void {
    this.afterListeningRef = cb;
  }
  abstract init: (port: number, address: string, parser: ISocketIncomingMessage) => Promise<void>;

  sendTo(port: number, address: string, data: Buffer<ArrayBuffer>): void {
    if (!this.isRunning()) throw new Error('adapter.notInitialized');
    if (data.length > this.MAX_PACKET_SIZE) throw new Error('udp.tooLarge');
    //@ts-ignore
    this.sk.send(data, 0, data.length, port, address);
  }

  close(): void {
    if (!this.isRunning()) throw new Error('adapter.notInitialized');
    //@ts-ignore
    this.sk.close(() => {
      this.sk = undefined!;
    });
  }
}
