import { Radio, UserPlus } from '@tamagui/lucide-icons'
import { ReactNode } from 'react'
import { Button, ListItem, SizableText, YGroup, YStack } from 'tamagui'

export function ReceiverSearchDevices(): ReactNode {
  return (
    <YStack>
      <Button
        // buttonStyle={styles.searchButton}
        // radius={UITheme.spacing?.xl}
        // type="solid"
        // title={'Detectar otros dispositivos'}
        // iconPosition="top"
        icon={Radio}
        // onPress={handleSearchDevices}
      >
        <SizableText>Detectar otros dispositivos</SizableText>
      </Button>
      <YGroup>
        {Array.from({ length: 10 }).map((_, index) => (
          <YGroup.Item
            key={index}
            // padding="$4"
          >
            <ListItem
              hoverTheme
              pressTheme
              icon={UserPlus}
              title="Nombre del dispositivo"
              subTitle="Marca"
            />
          </YGroup.Item>
        ))}
      </YGroup>
    </YStack>
  )
}
