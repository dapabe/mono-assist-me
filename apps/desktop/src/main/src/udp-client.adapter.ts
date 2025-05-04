import { ISocketIncomingMessage, SocketAdapter } from '@mono/assist-api'
import dgram from 'node:dgram'

export class NodeSocketAdapter extends SocketAdapter<dgram.Socket> {
  init = (
    port: number,
    address: string,
    parser: ISocketIncomingMessage
  ): void => {
    this.currentPort = port
    this.currentAddress = address
    this.sk = dgram.createSocket({ type: 'udp4' })
    this.sk.addListener('listening', () => this.triggerOnListening())
    this.sk.on('error', (err) => this.handleErrors(err))
    this.sk.addListener('message', parser)
    this.sk.bind(port, this.currentAddress)
  }
}
