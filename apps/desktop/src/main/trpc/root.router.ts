import { createIPCHandler } from 'electron-trpc/main'
import { ProtectedRouter } from './routers/protected.router'
import { is } from '@electron-toolkit/utils'
import { UtilsTrpcRouter } from './routers/utils.router'
import { createTRPContext, createTRPCRouter } from './trpc'
import { PublicRouter } from './routers/public.router'

export const RootRouter = createTRPCRouter(
  is.dev
    ? {
        PUBLIC: PublicRouter,
        PROTECTED: ProtectedRouter,
        UTILS: UtilsTrpcRouter
      }
    : {
        PUBLIC: PublicRouter,
        PROTECTED: ProtectedRouter
      }
)
export type IMainWindowRouter = typeof RootRouter

export const attachTRPCHandlers = (
  win: Electron.BrowserWindow
): ReturnType<typeof createIPCHandler> =>
  createIPCHandler({
    router: RootRouter,
    windows: [win],
    createContext: () => {
      return createTRPContext()
    }
  })
