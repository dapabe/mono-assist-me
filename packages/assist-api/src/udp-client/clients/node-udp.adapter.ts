import dgram from 'node:dgram';
import { ISocketIncomingMessage } from 'src/types/socket-adapter';

import { SocketAdapter } from '../abstract-adapter';
import { UDP_CONSTANTS } from '../udp-constants';

export class NodeSocketAdapter extends SocketAdapter<dgram.Socket> {
  init = (port: number, address: string, parser: ISocketIncomingMessage): void => {
    this.currentPort = port;
    this.currentAddress = address;
    this.sk = dgram.createSocket({ type: 'udp4', reuseAddr: false });
    this.sk.addListener('listening', () => {
      this.sk.setMulticastLoopback(false);
      this.sk.setMulticastTTL(1);
      this.sk.addMembership(UDP_CONSTANTS.MULTICAST_ADDRESS, this.currentAddress);
      this.triggerOnListening();
    });
    this.sk.on('error', (err) => this.handleErrors(err));
    this.sk.addListener('message', parser);
    this.sk.bind(this.currentPort, this.currentAddress);
  };
}
