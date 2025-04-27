import { RegisterLocalSchema } from '@mono/assist-api'
import { tInstance } from './trpc'
import { DatabaseService } from '../src/services/Database.service'

const db = DatabaseService.getInstance()
export const PublicTrpcRouter = tInstance.router({
  isAuthenticated: tInstance.procedure.query<boolean>(async () => {
    try {
      await db.Repo.LocalData.get()
      return true
    } catch {
      return false
    }
    // return await LocalConfigStore.getState().isAuthenticated()
  }),
  register: tInstance.procedure
    .input(RegisterLocalSchema)
    .mutation(async (opts) => {
      await db.Repo.LocalData.create({ name: opts.input.name })
    })
})
