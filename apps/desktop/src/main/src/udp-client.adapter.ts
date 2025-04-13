import { ISocketIncomingMessage } from '@mono/assist-api'
import { SocketAdapter } from '@mono/assist-api'
import dgram from 'node:dgram'

export class NodeSocketAdapter extends SocketAdapter<dgram.Socket> {
  init = async (
    port: number,
    address: string,
    parser: ISocketIncomingMessage
  ): Promise<void> => {
    const sk = dgram.createSocket({ type: 'udp4' })
    sk.on('error', (err) => {
      console.log(`NodeSocket, ${err}`)
      super.close()
    })
    sk.addListener('message', parser)
    sk.bind(port, address, () => {
      this.sk = sk
      this.afterListeningRef()
    })
  }

  close(): void {
    this.sk.disconnect()
    super.close()
  }
}
