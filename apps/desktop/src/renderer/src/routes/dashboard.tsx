import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { DashboardLayout } from './-components/dashboard/Dashboard.layout'

export const Route = createFileRoute('/dashboard')({
  component: Componenet
})

function Componenet(): ReactNode {
  // const ApiInit = trpcReact.protected.initialize.useMutation()

  // useEffect(() => {
  //   ApiInit.mutateAsync()
  // }, [ApiInit])

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
