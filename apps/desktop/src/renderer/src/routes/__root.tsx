import { ILocalAuthContext } from '@renderer/routes/-components/providers/LocalAuth.provider'
import {
  createRootRouteWithContext,
  ErrorComponentProps,
  Outlet
} from '@tanstack/react-router'
import { ReactNode } from 'react'

export const Route = createRootRouteWithContext<{
  localAuth: ILocalAuthContext
}>()({
  component: Outlet,
  errorComponent: ErrorComponent
})

function ErrorComponent(props: ErrorComponentProps): ReactNode {
  return (
    <div>
      Ha ocurrido un error
      {JSON.stringify(props.info)},{JSON.stringify(props.error)}
      Route {window.location.pathname}
    </div>
  )
}
