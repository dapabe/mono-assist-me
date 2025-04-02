import { ISocketIncomingMessage } from '@mono/assist-api'
import { SocketAdapter } from '@mono/assist-api/src/udp-client/abstract-adapter'
import * as dgram from 'node:dgram'

export class NodeSocketAdapter extends SocketAdapter<dgram.Socket> {
  init = (port: number, address: string, parser: ISocketIncomingMessage): void => {
    this.sk = dgram.createSocket({ type: 'udp4' })
    this.sk.addListener('message', parser)
    this.sk.bind(port, address, this.afterListeningRef)
  }

  close(): void {
    this.sk.disconnect()
    super.close()
  }
}
