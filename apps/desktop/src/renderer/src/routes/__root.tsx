import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ReactNode } from 'react'

export const Route = createRootRoute({
  component: Component
})

function Component(): ReactNode {
  // const IPCRequestHelp = trpcReact.requestHelp.useQuery()

  // const IPCSendDiscovery = trpcReact.sendDiscovery.useQuery()

  return (
    <>
      <Outlet />
    </>
  )
}
