import { trpcReact } from '@renderer/services/trpc'
import { createFileRoute } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { Button, SizableText, XStack, YStack } from 'tamagui'

export const Route = createFileRoute('/dashboard/')({
  component: Component
})

function Component(): ReactNode {
  const requestHelp = trpcReact.PROTECTED.requestHelp.useMutation()

  return (
    <YStack justify="space-between">
      <Button
        self={'center'}
        size="$12"
        rounded={100}
        onPress={() => requestHelp.mutate()}
      >
        Pedir ayuda
      </Button>
      <XStack self={'flex-end'}>
        <SizableText>2</SizableText>
      </XStack>
    </YStack>
  )
}
