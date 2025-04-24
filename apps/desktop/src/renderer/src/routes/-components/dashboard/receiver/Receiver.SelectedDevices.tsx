import { UserMinus } from '@tamagui/lucide-icons'
import { ReactNode } from 'react'
import { Button, ListItem, Separator, YGroup } from 'tamagui'

export function ReceiverSelectedDevices(): ReactNode {
  return (
    <YGroup>
      <Separator />
      {Array.from({ length: 10 }, (_, i) => (
        <YGroup.Item key={i}>
          <ListItem
            iconAfter={(x) => (
              <Button icon={UserMinus} scaleIcon={3} {...x}></Button>
            )}
            title="Emisor"
            subTitle="Emisor de prueba"
          />
        </YGroup.Item>
      ))}
    </YGroup>
  )
}
