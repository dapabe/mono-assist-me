import { trpcReact } from '@renderer/services/trpc'
import { UserMinus } from '@tamagui/lucide-icons'
import { ReactNode } from 'react'
import { Button, ListItem, Separator, YGroup } from 'tamagui'

export function ReceiverSelectedDevices(): ReactNode {
  const roomsListeningTo = trpcReact.PROTECTED.getRoomsListeningTo.useQuery()
  const deleteListeningTo = trpcReact.PROTECTED.deleteListeningTo.useMutation()
  const respondToHelp = trpcReact.PROTECTED.respondToHelp.useMutation()

  return (
    <YGroup>
      <Separator />
      {Array.from({ length: 10 }, (_, i) => (
        <YGroup.Item key={i}>
          <ListItem
            iconAfter={(x) => (
              <Button icon={UserMinus} scaleIcon={3} {...x}></Button>
            )}
            onPress={() => respondToHelp.mutate({ appId: '' })}
            title="Emisor"
            subTitle="Emisor de prueba"
          />
        </YGroup.Item>
      ))}
    </YGroup>
  )
}
