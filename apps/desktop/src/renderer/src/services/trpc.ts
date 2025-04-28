import { createTRPCReact } from '@trpc/react-query'
//@ts-ignore Not included in renderer
import type { IMainWindowRouter } from '../../../main/trpc/router'

export const trpcReact = createTRPCReact<IMainWindowRouter>()
