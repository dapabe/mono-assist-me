import { trpcReact } from '@renderer/services/trpc'
import { UserMinus } from '@tamagui/lucide-icons'
import { ReactNode } from 'react'
import { Button, ListItem, Separator, SizableText, YGroup } from 'tamagui'

export function ReceiverSelectedDevices(): ReactNode {
  const roomsListeningTo = trpcReact.PROTECTED.getRoomsListeningTo.useQuery()
  const deleteListeningTo = trpcReact.PROTECTED.deleteListeningTo.useMutation()
  const respondToHelp = trpcReact.PROTECTED.respondToHelp.useMutation()

  if (roomsListeningTo.isLoading) return <SizableText>Loading</SizableText>

  if (roomsListeningTo.isError)
    return (
      <SizableText>Error {JSON.stringify(roomsListeningTo.error)}</SizableText>
    )

  return (
    <YGroup>
      {roomsListeningTo.data.map((x) => (
        <YGroup.Item key={x.appId}>
          <ListItem
            iconAfter={(props) => (
              <Button icon={UserMinus} scaleIcon={3} {...props}></Button>
            )}
            onPress={() => respondToHelp.mutate({ appId: x.appId })}
            title={x.callerName}
            subTitle={x.device}
          />
        </YGroup.Item>
      ))}
    </YGroup>
  )
}
