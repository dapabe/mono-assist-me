import { ISocketIncomingMessage, SocketAdapter } from '@mono/assist-api';
import dgram from 'react-native-udp';
import UdpSocket from 'react-native-udp/lib/types/UdpSocket';

export class ReactNativeSocketAdapter extends SocketAdapter<UdpSocket> {
  init = async (port: number, address: string, parser: ISocketIncomingMessage): Promise<void> => {
    const sk = dgram.createSocket({ type: 'udp4', debug: false });
    sk.addListener('message', parser);
    sk.bind(port, address, () => {
      this.sk = sk;
      this.afterListeningRef();
    });
  };
}
