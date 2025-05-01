import { trpcReact } from '@renderer/services/trpc'
import { createFileRoute } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { Button, SizableText, XStack, YStack } from 'tamagui'

export const Route = createFileRoute('/dashboard/')({
  component: Component
})

function Component(): ReactNode {
  const currentListeners = trpcReact.PROTECTED.getCurrentListeners.useQuery()
  const requestHelp = trpcReact.PROTECTED.requestHelp.useMutation()

  if (currentListeners.isLoading || currentListeners.isError) return null

  return (
    <YStack justify="space-between">
      <Button
        self={'center'}
        size="$12"
        rounded={100}
        disabled={!currentListeners.data.length}
        onPress={() => requestHelp.mutate()}
      >
        Pedir ayuda
      </Button>
      <XStack self={'flex-end'}>
        <SizableText>{currentListeners.data.length}</SizableText>
      </XStack>
    </YStack>
  )
}
