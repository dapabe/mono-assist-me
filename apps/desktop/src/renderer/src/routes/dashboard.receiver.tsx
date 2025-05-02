import { createFileRoute } from '@tanstack/react-router'
import { ReactNode, useState } from 'react'
import { ReceiverSearchDevices } from './-components/dashboard/receiver/Receiver.SearchDevices'
import { ReceiverSelectedDevices } from './-components/dashboard/receiver/Receiver.SelectedDevices'

export const Route = createFileRoute('/dashboard/receiver')({
  component: Component
})

function Component(): ReactNode {
  const [cTab, setTab] = useState('tab2')

  return (
    <section className="grow [*]:px-4 flex flex-col">
      <div role="tablist" className="tabs tabs-border w-full">
        <input
          type="radio"
          name="tab1"
          className="tab grow"
          aria-label="Conocidos"
          checked={cTab === 'tab1'}
          onChange={() => setTab('tab1')}
        />
        <input
          type="radio"
          name="tab2"
          className="tab grow"
          aria-label="Descubrir"
          checked={cTab === 'tab2'}
          onChange={() => setTab('tab2')}
        />
      </div>
      {cTab === 'tab1' && <ReceiverSelectedDevices />}
      {cTab === 'tab2' && <ReceiverSearchDevices />}
    </section>
  )
}
