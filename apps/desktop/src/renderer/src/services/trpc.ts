import { createTRPCProxyClient } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { ipcLink } from 'electron-trpc/renderer'
import type { IMainWindowRouter } from '../../../main/src/trpc'

export const trpcReact = createTRPCReact<IMainWindowRouter>()
