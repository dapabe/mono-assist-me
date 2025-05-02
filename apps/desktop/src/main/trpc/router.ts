import { createIPCHandler } from 'electron-trpc/main'
import { ProtectedTrpcRouter } from './protected.router'
import { PublicTrpcRouter } from './public.router'
import { tInstance } from './trpc'
import { is } from '@electron-toolkit/utils'
import { UtilsTrpcRouter } from './utils.router'

export const trpcRouter = tInstance.router({
  PUBLIC: PublicTrpcRouter,
  PROTECTED: ProtectedTrpcRouter,
  UTILS: is.dev ? UtilsTrpcRouter : undefined!
})
export type IMainWindowRouter = typeof trpcRouter

export const attachTRPCHandlers = (
  win: Electron.BrowserWindow
): ReturnType<typeof createIPCHandler> =>
  createIPCHandler({ router: trpcRouter, windows: [win] })
