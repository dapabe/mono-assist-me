import { ISocketIncomingMessage, SocketAdapter } from '@mono/assist-api';
import dgram from 'react-native-udp';
import UdpSocket from 'react-native-udp/lib/types/UdpSocket';

export class ReactNativeSocketAdapter extends SocketAdapter<UdpSocket> {
  init = (port: number, address: string, parser: ISocketIncomingMessage): void => {
    this.sk = dgram.createSocket({ type: 'udp4', debug: false });
    this.sk.addListener('message', parser);
    this.sk.bind(port, address, this.afterListeningRef);
  };
}
