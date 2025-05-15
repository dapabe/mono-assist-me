import { trpcReact } from '@renderer/services/trpc'
import { useRouter } from '@tanstack/react-router'
import { ReactNode, useState } from 'react'
import * as Icon from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IWSRoom } from '@mono/assist-api'

export function ReceiverSearchDevices(): ReactNode {
  const { t } = useTranslation()
  const [list, setList] = useState<IWSRoom[]>([])
  const addToListeningTo = trpcReact.PROTECTED.addToListeningTo.useMutation()
  const roomsToDiscover = trpcReact.PROTECTED.getRoomsToDiscover.useQuery()

  trpcReact.PROTECTED.onRoomsToDiscover.useSubscription(undefined, {
    onData({ _evt, ...wsroom }) {
      if (_evt === 'init' || _evt === 'add') setList((x) => [...x, wsroom])
      else setList((x) => x.filter((z) => z.appId !== wsroom.appId))
    },
    onError(err) {
      console.log(err)
    }
  })
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

  if (!list.length) {
    return (
      <div className="grow flex flex-col">
        <div className="w-full flex">
          <DiscoveryButton />
        </div>
        <div className="grow flex items-center justify-center">
          <span className="label text-2xl">
            {t('Dashboard.PageReceiver.SearchDevicesTab.EmptyPlaceholder')}
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
        {list.map((x) => (
          <li key={x.appId} className="list-row">
            <button
              // icon={UserPlus}
              className="btn btn-ghost col-span-2"
              onClick={() => addToListeningTo.mutate({ appId: x.appId })}
            >
              <Icon.UserPlus className="text-neutral size-6 mr-2" />
              <div className="flex flex-col items-start">
                <span>{x.callerName}</span>
                <span>{x.device}</span>
              </div>
              <span className="ml-auto"></span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function DiscoveryButton({ disabled }: { disabled?: boolean }): ReactNode {
  const { t } = useTranslation()

  // const router = useRouter()
  const sendDiscovery = trpcReact.PROTECTED.sendDiscovery.useMutation()

  const handleDiscovery = (): void => {
    sendDiscovery.mutate()
    // router.invalidate()
  }

  return (
    <button
      // buttonStyle={styles.searchButton}
      // radius={UITheme.spacing?.xl}
      // type="solid"
      // title={'Detectar otros dispositivos'}
      // iconPosition="top"
      disabled={disabled}
      className="btn btn-accent btn-outline grow mt-2"
      onClick={handleDiscovery}
    >
      {t('Dashboard.PageReceiver.SearchDevicesTab.DetectButton')}
    </button>
  )
}
