import { createFileRoute } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { Button, SizableText, XStack, YStack } from 'tamagui'

export const Route = createFileRoute('/dashboard/')({
  component: Component
})

function Component(): ReactNode {
  return (
    <YStack justify="space-between">
      <Button self={'center'} size="$12" rounded={100}>
        Pedir ayuda
      </Button>
      <XStack self={'flex-end'}>
        <SizableText>2</SizableText>
      </XStack>
    </YStack>
  )
}
