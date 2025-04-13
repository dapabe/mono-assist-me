import {
  RegisterLocalSchema,
  UdpSocketClient,
  vanillaRoomStore
} from '@mono/assist-api'
import { initTRPC } from '@trpc/server'
import { createIPCHandler } from 'electron-trpc/main'
import { NodeSocketAdapter } from './udp-client.adapter'
import { z } from 'zod'
import { LocalConfigStore } from './services/LocalConfig.store'

const room = vanillaRoomStore.getState()
const t = initTRPC.create({ isServer: true })

const trpcRouter = t.router({
  public: t.router({
    isAuthenticated: t.procedure.query<boolean>(() => true),
    register: t.procedure.input(RegisterLocalSchema).mutation(() => {})
  }),
  protected: t.router({
    // Room actions
    initialize: t.procedure.mutation(async () => {
      const client = new UdpSocketClient({
        adapter: new NodeSocketAdapter(),
        store: room,
        address: '0.0.0.0',
        port: UdpSocketClient.DISCOVERY_PORT
      })
      await client.init()
    }),
    sendDiscovery: t.procedure.mutation(room.sendDiscovery),
    addToListeningTo: t.procedure
      .input(z.object({ appId: z.string().uuid() }))
      .mutation((req) => {
        room.addToListeningTo(req.input.appId)
      }),
    deleteListeningTo: t.procedure
      .input(z.object({ appId: z.string().uuid() }))
      .mutation((req) => {
        room.deleteListeningTo(req.input.appId)
      }),
    requestHelp: t.procedure.mutation(room.requestHelp),
    respondToHelp: t.procedure
      .input(z.object({ appId: z.string().uuid() }))
      .mutation((req) => {
        room.respondToHelp(req.input.appId)
      }),
    // App actions
    updateLocalName: t.procedure
      .input(RegisterLocalSchema)
      .mutation(async (req) => {
        await LocalConfigStore.getState().updateCurrentName(req.input.name)
      })
  })
})

export type IMainWindowRouter = typeof trpcRouter

export const attachTRPCHandlers = (
  win: Electron.BrowserWindow
): ReturnType<typeof createIPCHandler> =>
  createIPCHandler({ router: trpcRouter, windows: [win] })
