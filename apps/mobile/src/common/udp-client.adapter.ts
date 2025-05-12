import { ISocketIncomingMessage, SocketAdapter, UDP_CONSTANTS } from '@mono/assist-api';
import { Platform } from 'react-native';
import dgram from 'react-native-udp';
import type UdpSocket from 'react-native-udp/lib/types/UdpSocket';

export class ReactNativeSocketAdapter extends SocketAdapter<UdpSocket> {
  init = (port: number, address: string, parser: ISocketIncomingMessage): void => {
    this.currentPort = port;
    this.currentAddress = address;
    this.sk = dgram.createSocket({ type: 'udp4', debug: Platform.isTesting });
    this.sk.addListener('listening', () => {
      this.sk.addMembership(UDP_CONSTANTS.MULTICAST_ADDRESS);
      this.sk.setBroadcast(true);
      this.triggerOnListening();
    });
    this.sk.on('error', (err: Error) => this.handleErrors(err));
    this.sk.addListener('message', parser);
    this.sk.bind(this.currentPort, this.currentAddress);
  };
}
