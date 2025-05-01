import { trpcReact } from '@renderer/services/trpc'
import { Radio, UserPlus } from '@tamagui/lucide-icons'
import { ReactNode } from 'react'
import { Button, ListItem, SizableText, YGroup, YStack } from 'tamagui'

export function ReceiverSearchDevices(): ReactNode {
  const sendDiscovery = trpcReact.PROTECTED.sendDiscovery.useMutation()
  const addToListeningTo = trpcReact.PROTECTED.addToListeningTo.useMutation()
  const roomsToDiscover = trpcReact.PROTECTED.getRoomsToDiscover.useQuery()

  if (roomsToDiscover.isLoading) return <SizableText>loading</SizableText>
  if (roomsToDiscover.isError) return null

  return (
    <YStack items="center">
      <Button
        // buttonStyle={styles.searchButton}
        // radius={UITheme.spacing?.xl}
        // type="solid"
        // title={'Detectar otros dispositivos'}
        // iconPosition="top"

        icon={Radio}
        onPress={() => sendDiscovery.mutate()}
      >
        <SizableText>Detectar otros dispositivos</SizableText>
      </Button>
      <YGroup overflow="scroll" flex={1} width={'100%'}>
        {roomsToDiscover.data.map((x) => (
          <YGroup.Item key={x.appId}>
            <ListItem
              hoverTheme
              pressTheme
              icon={UserPlus}
              onPress={() => addToListeningTo.mutate({ appId: x.appId })}
              title={x.callerName}
              subTitle={x.device}
            />
          </YGroup.Item>
        ))}
      </YGroup>
    </YStack>
  )
}
