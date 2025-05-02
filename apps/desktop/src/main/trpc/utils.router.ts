import { vanillaRoomStore } from '@mono/assist-api'
import { tInstance } from './trpc'

const MemoryState = vanillaRoomStore.getInitialState()
export const UtilsTrpcRouter = tInstance.router({
  LocalLogout: tInstance.procedure.mutation(async () => {
    await MemoryState.getRepos().LocalData.delete()
  })
})
