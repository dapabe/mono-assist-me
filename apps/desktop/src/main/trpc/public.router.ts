import { RegisterLocalSchema } from '@mono/assist-api'
import { tInstance } from './trpc'
import { ErrorNotificationService } from '../src/services/ErrorNotif.service'
import { MemoryState } from '../memory-state'

export const PublicTrpcRouter = tInstance.router({
  isAuthenticated: tInstance.procedure.query<boolean>(async () => {
    try {
      return await MemoryState.getState().getRepos().LocalData.entryExists()
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'db.localdata.entryExists',
        ErrorNotificationService.getErrorMessage(error)
      )
      process.exit(1)
    }
  }),
  register: tInstance.procedure
    .input(RegisterLocalSchema)
    .mutation(async (opts) => {
      try {
        await MemoryState.getState()
          .getRepos()
          .LocalData.create({ name: opts.input.name })
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'db.localdata.create',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    })
})
