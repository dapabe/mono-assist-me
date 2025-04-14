import { RegisterLocalSchema } from '@mono/assist-api'
import { LocalConfigStore } from '../src/services/LocalConfig.store'
import { tInstance } from './trpc'

export const PublicTrpcRouter = tInstance.router({
  isAuthenticated: tInstance.procedure.query<boolean>(
    LocalConfigStore.getState().isAuthenticated
  ),
  register: tInstance.procedure
    .input(RegisterLocalSchema)
    .mutation(async (opts) => {
      await LocalConfigStore.getState().registerLocalData({
        currentName: opts.input.name,
        currentAppId: crypto.randomUUID(),
        previousAppIds: []
      })
    })
})
