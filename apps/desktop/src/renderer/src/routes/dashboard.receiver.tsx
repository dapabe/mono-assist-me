import { createFileRoute } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { SizableText, Tabs } from 'tamagui'
import { ReceiverSearchDevices } from './-components/dashboard/receiver/Receiver.SearchDevices'
import { ReceiverSelectedDevices } from './-components/dashboard/receiver/Receiver.SelectedDevices'

export const Route = createFileRoute('/dashboard/receiver')({
  component: Component
})

function Component(): ReactNode {
  return (
    <Tabs
      defaultValue="1"
      orientation="horizontal"
      flexDirection="column"
      borderColor="$borderColor"
      overflow="hidden"
      // flex={1}
    >
      <Tabs.List
        aria-label="Lista de emisores"
        disablePassBorderRadius="bottom"
      >
        <Tabs.Tab
          flex={1}
          value="1"
          focusStyle={{
            backgroundColor: '$color3'
          }}
        >
          <SizableText fontFamily="$body" text="center">
            Conocidos
          </SizableText>
        </Tabs.Tab>
        <Tabs.Tab
          flex={1}
          value="2"
          focusStyle={{
            backgroundColor: '$color3'
          }}
        >
          <SizableText fontFamily="$body" text="center">
            Descubrir
          </SizableText>
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Content value="1" flex={1}>
        <ReceiverSelectedDevices />
      </Tabs.Content>
      <Tabs.Content value="2" flex={1}>
        <ReceiverSearchDevices />
      </Tabs.Content>
    </Tabs>
  )
}
