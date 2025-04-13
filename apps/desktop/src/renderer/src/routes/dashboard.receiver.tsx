import { createFileRoute } from '@tanstack/react-router'
import { ReactNode } from 'react'

export const Route = createFileRoute('/dashboard/receiver')({
  component: Component
})

function Component(): ReactNode {
  return <div>receiver</div>
}
