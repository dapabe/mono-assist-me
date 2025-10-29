import { initTRPC } from '@trpc/server'
import { initializeDatabase } from '../initializeDatabase'
import { NodeMemoryState } from '../memory-state'

export const createTRPContext = async (): Promise<{
  AppState: typeof NodeMemoryState
}> => {
  const db = await initializeDatabase()
  NodeMemoryState.getState().__syncDatabase(db.Repo)
  return { AppState: NodeMemoryState }
}

const tInstance = initTRPC.context<typeof createTRPContext>().create({
  isServer: true
})

export const createTRPCRouter = tInstance.router

export const NodeProcedure = tInstance.procedure
