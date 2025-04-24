import { Radio, UserPlus } from '@tamagui/lucide-icons'
import { ReactNode } from 'react'
import { Button, ListItem, SizableText, YGroup, YStack } from 'tamagui'

export function ReceiverSearchDevices(): ReactNode {
  const handleSearchDevices = (): void => {
    // toggleRefresh();
    // ctx.sendDiscovery();
    // toggleRefresh();
  }

  return (
    <YStack items="center">
      <Button
        // buttonStyle={styles.searchButton}
        // radius={UITheme.spacing?.xl}
        // type="solid"
        // title={'Detectar otros dispositivos'}
        // iconPosition="top"

        icon={Radio}
        onPress={handleSearchDevices}
      >
        <SizableText>Detectar otros dispositivos</SizableText>
      </Button>
      <YGroup overflow="scroll" flex={1} width={'100%'}>
        {Array.from({ length: 5 }).map((_, index) => (
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
