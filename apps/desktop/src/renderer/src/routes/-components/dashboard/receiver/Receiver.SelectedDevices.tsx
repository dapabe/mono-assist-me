import { useI18nContext } from '@mono/assist-api/i18n/react'
import { trpcReact } from '@renderer/services/trpc'
import { ReactNode } from 'react'

export function ReceiverSelectedDevices(): ReactNode {
  const { LL } = useI18nContext()

  const roomsListeningTo = trpcReact.PROTECTED.getRoomsListeningTo.useQuery()
  const deleteListeningTo = trpcReact.PROTECTED.deleteListeningTo.useMutation()
  const respondToHelp = trpcReact.PROTECTED.respondToHelp.useMutation()

  if (roomsListeningTo.isLoading) {
    return (
      <ul className="list overflow-y-scroll h-[calc(100vh-6rem)]">
        {Array.from({ length: 2 }).map((_, i) => (
          <li key={i} className="list-row flex flex-col gap-y-1.5">
            <div className="skeleton w-2/5 h-4"></div>
            <div className="skeleton w-full h-4"></div>
          </li>
        ))}
      </ul>
    )
  }

  if (roomsListeningTo.isError) return null

  if (!roomsListeningTo.data.length) {
    return (
      <div className="grow flex items-center justify-center">
        <span className="label text-2xl">
          {LL.Dashboard.PageReceiver.SelectedDevicesTab.EmptyPlaceholder()}
        </span>
      </div>
    )
  }

  return (
    <ul className="list overflow-y-scroll h-[calc(100vh-6rem)]">
      {roomsListeningTo.data.map((x) => (
        <li key={x.appId} className="list-row">
          <div
          // iconAfter={(props) => (
          //   <Button icon={UserMinus} scaleIcon={3} {...props}></Button>
          // )}
          >
            <button onClick={() => respondToHelp.mutate({ appId: x.appId })}>
              <span>{x.callerName}</span>
              <span>{x.device}</span>
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
