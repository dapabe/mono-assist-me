import { createTRPCReact } from '@trpc/react-query'
import { IMainWindowRouter } from 'src/main/trpc/router'

export const trpcReact = createTRPCReact<IMainWindowRouter>()
