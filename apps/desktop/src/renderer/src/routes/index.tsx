import { createFileRoute, redirect } from '@tanstack/react-router'
import { ReactNode } from 'react'

export const Route = createFileRoute('/')({
  beforeLoad: (opts) => {
    if (opts.context.localAuth.isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: Component
})

function Component(): ReactNode {
  return <div>registro</div>
}
