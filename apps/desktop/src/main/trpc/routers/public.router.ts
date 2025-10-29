import { RegisterLocalSchema } from '@mono/assist-api'
import { ErrorNotificationService } from '../../services/ErrorNotif.service'
import { createTRPCRouter, NodeProcedure } from '../trpc'

export const PublicRouter = createTRPCRouter({
  isAuthenticated: NodeProcedure.query<boolean>(async ({ ctx }) => {
    try {
      return await ctx.AppState.getState().getRepos().LocalData.entryExists()
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'db.localdata.entryExists',
        ErrorNotificationService.getErrorMessage(error)
      )
      process.exit(1)
    }
  }),
  register: NodeProcedure.input(RegisterLocalSchema).mutation(
    async ({ ctx, input }) => {
      try {
        await ctx.AppState.getState()
          .getRepos()
          .LocalData.create({ name: input.name })
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'db.localdata.create',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    }
  )
})
