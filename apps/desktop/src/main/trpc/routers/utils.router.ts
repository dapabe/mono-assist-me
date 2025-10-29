import { createTRPCRouter, NodeProcedure } from '../trpc'

export const UtilsTrpcRouter = createTRPCRouter({
  localLogout: NodeProcedure.mutation(async ({ ctx }) => {
    await ctx.AppState.getState().getRepos().LocalData.delete()
  })
})
