import { Platform } from 'react-native';
import dgram from 'react-native-udp';
import type UdpSocket from 'react-native-udp/lib/types/UdpSocket';
import { ISocketIncomingMessage } from 'src/types/socket-adapter';

import { SocketAdapter } from '../abstract-adapter';
import { UDP_CONSTANTS } from '../udp-constants';

export class MobileSocketAdapter extends SocketAdapter<UdpSocket> {
  init = (port: number, address: string, parser: ISocketIncomingMessage): void => {
    this.currentPort = port;
    this.currentAddress = address;
    this.sk = dgram.createSocket({ type: 'udp4', debug: Platform.isTesting });
    this.sk.addListener('listening', () => {
      this.sk.addMembership(UDP_CONSTANTS.MULTICAST_ADDRESS);
      this.triggerOnListening();
    });
    this.sk.on('error', (err: Error) => this.handleErrors(err));
    this.sk.addListener('message', parser);
    this.sk.bind(this.currentPort, this.currentAddress);
  };
}
