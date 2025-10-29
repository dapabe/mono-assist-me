import { createTRPCReact } from '@trpc/react-query'
//@ts-ignore Not included in renderer
import type { IMainWindowRouter } from '../../../main/trpc/root.router'

//@ts-ignore Esto exd
export const trpcReact = createTRPCReact<IMainWindowRouter>()
