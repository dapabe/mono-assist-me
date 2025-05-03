import { ISocketIncomingMessage, SocketAdapter } from '@mono/assist-api';
import dgram from 'react-native-udp';
import UdpSocket from 'react-native-udp/lib/types/UdpSocket';

export class ReactNativeSocketAdapter extends SocketAdapter<UdpSocket> {
  init = (port: number, address: string, parser: ISocketIncomingMessage): void => {
    const sk = dgram.createSocket({ type: 'udp4', debug: false });
    sk.on('error', (err: Error) => {
      if (err.message.includes('EADDRINUSE')) {
        this.rebindPort(sk, address);
      } else {
        console.log(`[RNSocket] ${err}`);
        this.close();
      }
    });
    sk.addListener('message', parser);
    sk.bind(port, address, () => {
      this.sk = sk;
      this.afterListeningRef();
      console.log(`[RNSocket] Binded to ${address}:${this.currentPort}`);
    });
  };

  close(): void {
    if (this.sk) {
      this.sk.removeAllListeners();
      this.sk.close();
      this.sk = undefined!;
    }
  }
}
