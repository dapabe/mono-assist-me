import { trpcReact } from '@renderer/services/trpc'
import { Spinner } from '@renderer/ui/Spinner'
import { ReactNode } from 'react'

export function ReceiverSearchDevices(): ReactNode {
  const addToListeningTo = trpcReact.PROTECTED.addToListeningTo.useMutation()
  const roomsToDiscover = trpcReact.PROTECTED.getRoomsToDiscover.useQuery()

  if (roomsToDiscover.isLoading) {
    return (
      <div className="grow flex flex-col">
        <div className="w-full flex">
          <DiscoveryButton disabled />
        </div>
        <ul className="list overflow-y-scroll h-[calc(100vh-10rem)]">
          {Array.from({ length: 2 }).map((_, i) => (
            <li key={i} className="list-row flex flex-col gap-y-1.5">
              <div className="skeleton w-2/5 h-4"></div>
              <div className="skeleton w-full h-4"></div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (roomsToDiscover.isError) return null

  if (!roomsToDiscover.data.length) {
    return (
      <div className="grow flex flex-col">
        <div className="w-full flex">
          <DiscoveryButton />
        </div>
        <div className="grow flex items-center justify-center">
          <span className="label text-2xl">
            No hay dispositivos en la cercania
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="grow flex flex-col">
      <div className="w-full flex">
        <DiscoveryButton />
      </div>
      <ul className="list overflow-y-scroll h-[calc(100vh-10rem)]">
        {roomsToDiscover.data.map((x) => (
          <li key={x.appId} className="list-row">
            <button
              // icon={UserPlus}
              onClick={() => addToListeningTo.mutate({ appId: x.appId })}
            >
              <span>{x.callerName}</span>
              <span>{x.device}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function DiscoveryButton({ disabled }: { disabled?: boolean }): ReactNode {
  const sendDiscovery = trpcReact.PROTECTED.sendDiscovery.useMutation()
  return (
    <button
      // buttonStyle={styles.searchButton}
      // radius={UITheme.spacing?.xl}
      // type="solid"
      // title={'Detectar otros dispositivos'}
      // iconPosition="top"
      disabled={disabled}
      className="btn btn-accent btn-outline grow mt-2"
      onClick={() => sendDiscovery.mutate()}
    >
      Detectar otros dispositivos
    </button>
  )
}
