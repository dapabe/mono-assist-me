import { ISocketIncomingMessage, SocketAdapter } from '@mono/assist-api';
import dgram from 'react-native-udp';
import type UdpSocket from 'react-native-udp/lib/types/UdpSocket';

export class ReactNativeSocketAdapter extends SocketAdapter<UdpSocket> {
  init = (port: number, address: string, parser: ISocketIncomingMessage): void => {
    this.currentPort = port;
    this.currentAddress = address;
    this.sk = dgram.createSocket({ type: 'udp4', debug: false });
    this.sk.addListener('listening', () => this.triggerOnListening());
    this.sk.on('error', (err: Error) => this.handleErrors(err));
    this.sk.addListener('message', parser);
    this.sk.bind(port, this.currentAddress);
  };
}
