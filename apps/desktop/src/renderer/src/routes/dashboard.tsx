import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ReactNode, useEffect } from 'react'
import { DashboardLayout } from './-components/dashboard/Dashboard.layout'
import { trpcReact } from '@renderer/services/trpc'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: (opts) => {
    if (!opts.context.localAuth.isAuthenticated) throw redirect({ to: '/' })
  },
  component: Componenet
})

function Componenet(): ReactNode {
  const ApiInit = trpcReact.PROTECTED.initialize.useMutation()

  useEffect(() => {
    if (ApiInit.data !== null) ApiInit.mutate()
  }, [ApiInit.data])

  if (ApiInit.isLoading) return <p>Loading</p>

  if (ApiInit.isError) return <p>Error {JSON.stringify(ApiInit.error)}</p>

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
