import { MemoryState } from '../memory-state'
import { tInstance } from './trpc'

export const UtilsTrpcRouter = tInstance.router({
  LocalLogout: tInstance.procedure.mutation(async () => {
    await MemoryState.getState().getRepos().LocalData.delete()
  })
})
