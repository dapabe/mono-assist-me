import { ILocalAuthContext } from '@renderer/providers/LocalAuth.provider'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

export const Route = createRootRouteWithContext<{
  localAuth: ILocalAuthContext
}>()({
  component: Outlet
})
