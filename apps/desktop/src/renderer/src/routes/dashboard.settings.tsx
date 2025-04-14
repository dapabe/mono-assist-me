import { trpcReact } from '@renderer/services/trpc'
import { createFileRoute } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { YStack } from 'tamagui'
import { UpdateNameForm } from './-components/dashboard/settings/UpdateName.form'

export const Route = createFileRoute('/dashboard/settings')({
  component: RouteComponent
})

function RouteComponent(): ReactNode {
  const ApiLocalData = trpcReact.protected.getLocalData.useQuery()

  return (
    <YStack fullscreen>
      <UpdateNameForm
        values={{
          name: ApiLocalData.data?.currentName ?? ''
        }}
      />
    </YStack>
  )
}
