import { ISocketIncomingMessage, SocketAdapter } from '@mono/assist-api'
import dgram from 'node:dgram'

export class NodeSocketAdapter extends SocketAdapter<dgram.Socket> {
  init = (
    port: number,
    address: string,
    parser: ISocketIncomingMessage
  ): void => {
    this.currentPort = port
    const sk = dgram.createSocket({ type: 'udp4' })
    sk.on('error', (err) => {
      if (err.message.includes('EADDRINUSE')) {
        this.rebindPort(sk, address)
      } else {
        console.log(`[NodeSocket] ${err}`)
        this.close()
      }
    })
    sk.addListener('message', parser)
    sk.bind(port, address, () => {
      this.sk = sk
      this.afterListeningRef()
      console.log(`[NodeSocket] Binded to ${address}:${this.currentPort}`)
    })
  }

  close(): void {
    if (this.sk) {
      this.sk.removeAllListeners()
      this.sk.close()
      this.sk = undefined!
    }
  }
}
