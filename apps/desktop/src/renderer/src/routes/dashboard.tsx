import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ReactNode, useEffect } from 'react'
import { DashboardLayout } from './-components/dashboard/Dashboard.layout'
import { trpcReact } from '@renderer/services/trpc'
import { SizableText } from 'tamagui'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: (opts) => {
    if (!opts.context.localAuth.isAuthenticated) throw redirect({ to: '/' })
  },
  component: Componenet
})

function Componenet(): ReactNode {
  const ApiInit = trpcReact.PROTECTED.initialize.useMutation()

  useEffect(() => {
    ApiInit.mutate()
  }, [])

  if (ApiInit.isLoading) return <SizableText>Loading</SizableText>

  if (ApiInit.isError)
    return <SizableText>Error {JSON.stringify(ApiInit.error)}</SizableText>

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
