import { trpcReact } from '@renderer/services/trpc'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ReactNode, useEffect } from 'react'

export const Route = createFileRoute('/dashboard')({
  component: Componenet
})

function Componenet(): ReactNode {
  const ApiInit = trpcReact.protected.initialize.useMutation()

  useEffect(() => {
    ApiInit.mutateAsync()
  }, [ApiInit])

  return <Outlet />
}
