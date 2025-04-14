import { createFileRoute, redirect } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { H1, View } from 'tamagui'

export const Route = createFileRoute('/')({
  beforeLoad: (opts) => {
    if (!opts.context.localAuth.isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: Component
})

function Component(): ReactNode {
  return (
    <View>
      <H1>Registro</H1>
    </View>
  )
}
