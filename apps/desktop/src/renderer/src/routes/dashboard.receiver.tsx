import { createFileRoute } from '@tanstack/react-router'
import { ReactNode, useEffect, useState } from 'react'
import { ReceiverSearchDevices } from './-components/dashboard/receiver/Receiver.SearchDevices'
import { ReceiverSelectedDevices } from './-components/dashboard/receiver/Receiver.SelectedDevices'
import { useRoomStore } from '@mono/assist-api'
import { useI18nContext } from '@mono/assist-api/i18n/react'

export const Route = createFileRoute('/dashboard/receiver')({
  component: Component
})

function Component(): ReactNode {
  const { LL } = useI18nContext()

  const room = useRoomStore()
  const [cTab, setTab] = useState('tab2')

  useEffect(() => {
    if (room.roomsListeningTo.length) setTab('tab1')
  }, [room.roomsListeningTo.length])

  return (
    <section className="grow [*]:px-4 flex flex-col">
      <div role="tablist" className="tabs tabs-border w-full">
        <input
          type="radio"
          name="tab1"
          className="tab grow"
          aria-label={LL.Dashboard.PageReceiver.SelectedDevicesTab.Title()}
          checked={cTab === 'tab1'}
          onChange={() => setTab('tab1')}
        />
        <input
          type="radio"
          name="tab2"
          className="tab grow"
          aria-label={LL.Dashboard.PageReceiver.SearchDevicesTab.Title()}
          checked={cTab === 'tab2'}
          onChange={() => setTab('tab2')}
        />
      </div>
      {cTab === 'tab1' && <ReceiverSelectedDevices />}
      {cTab === 'tab2' && <ReceiverSearchDevices />}
    </section>
  )
}
