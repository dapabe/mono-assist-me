import {
  ISocketIncomingMessage,
  SocketAdapter,
  UDP_CONSTANTS
} from '@mono/assist-api'
import dgram from 'node:dgram'

export class NodeSocketAdapter extends SocketAdapter<dgram.Socket> {
  init = (
    port: number,
    address: string,
    parser: ISocketIncomingMessage
  ): void => {
    this.currentPort = port
    this.currentAddress = address
    this.sk = dgram.createSocket({ type: 'udp4', reuseAddr: false })
    this.sk.addListener('listening', () => {
      this.sk.setMulticastLoopback(false)
      this.sk.setMulticastTTL(1)
      this.sk.setBroadcast(false)
      this.sk.addMembership(UDP_CONSTANTS.MULTICAST_ADDRESS)
      this.triggerOnListening()
    })
    this.sk.on('error', (err) => this.handleErrors(err))
    this.sk.addListener('message', parser)
    this.sk.bind(this.currentPort, this.currentAddress)
  }
}
