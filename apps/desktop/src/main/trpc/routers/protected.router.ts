import {
  ILocalDataDTO,
  IRoomListener,
  IWSRoom,
  IWSRoomListener,
  RegisterLocalSchema,
  UdpSocketClient,
  z18n
} from '@mono/assist-api'
import { ErrorNotificationService } from '../../services/ErrorNotif.service'
import { NodeSocketAdapter } from '../../udp-node.adapter'
import { getInternalIPv4 } from '../../utils/getInternalIPv4'
import { TRPCError } from '@trpc/server'
import { getDeviceName } from '../../utils/getDeviceName'
import { observable } from '@trpc/server/observable'
import { createTRPCRouter, NodeProcedure } from '../trpc'
import { EventEmitter } from 'node:stream'
import { AppEventBus } from '../../services/EventBus'

const discoveryEE = new EventEmitter()
AppEventBus.register(discoveryEE)

export const ProtectedRouter = createTRPCRouter({
  // App actions
  getLocalData: NodeProcedure.query<ILocalDataDTO['Create']>(
    async ({ ctx }) => {
      return await ctx.AppState.getState().getRepos().LocalData.get()
    }
  ),
  updateLocalName: NodeProcedure.input(RegisterLocalSchema).mutation(
    async ({ input, ctx }) => {
      try {
        await ctx.AppState.getState().getRepos().LocalData.patch({
          currentName: input.name
        })
        ctx.AppState.getState().updateMemoryState('currentName', input.name)
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'db.patchLocalName',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    }
  ),

  // Room actions
  initialize: NodeProcedure.mutation<null>(async ({ ctx }) => {
    if (ctx.AppState.getState().connAdapter) return null

    const { currentName, currentAppId } = await ctx.AppState.getState()
      .getRepos()
      .LocalData.get()
    ctx.AppState.getState().updateMemoryState('currentName', currentName)
    ctx.AppState.getState().updateMemoryState('currentAppId', currentAppId)
    ctx.AppState.getState().updateMemoryState('currentDevice', getDeviceName())
    const netInfo = getInternalIPv4()
    if (!netInfo) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    const client = new UdpSocketClient({
      adapter: new NodeSocketAdapter(),
      store: ctx.AppState.getState(),
      address: netInfo.address
    })
    client.init()

    return null
  }),
  startDiscovery: NodeProcedure.mutation(async () => {
    console.log('test')
    discoveryEE.emit('start')
  }),
  sendDiscovery: NodeProcedure.subscription(({ ctx }) => {
    return observable<{ counter: number; done: boolean }>((emit) => {
      let stopped = false
      const onStart = async (): Promise<void> => {
        // In case is somehow triggered more than once, unsubscribe from the event to
        discoveryEE.off('start', onStart)
        try {
          for await (const res of ctx.AppState.getState().sendDiscovery()) {
            if (stopped) break
            emit.next(res)
          }
          // Don't call .complete() since the client might call it again
          if (!stopped) emit.next({ counter: 0, done: true })
        } catch (error) {
          emit.error(error)
        } finally {
          // On loop end, re-subscribe for the next cycle
          discoveryEE.on('start', onStart)
        }
      }
      // First subscription
      discoveryEE.on('start', onStart)
      return () => {
        stopped = true
        discoveryEE.off('start', onStart)
      }
    })
  }),
  getRoomsToDiscover: NodeProcedure.query<IWSRoom[]>(
    ({ ctx }) => ctx.AppState.getState().roomsToDiscover
  ),
  /** Wil yield data when "onRemoteRespondToAdvertise" triggers */
  onRoomsToDiscover: NodeProcedure.subscription(({ ctx }) => {
    return observable<IWSRoom & { _evt: 'add' | 'del' | 'init' }>((emit) => {
      let prevRooms = ctx.AppState.getState().roomsToDiscover

      if (prevRooms.length > 0) {
        emit.next({ ...prevRooms[prevRooms.length - 1], _evt: 'init' })
      }
      const unsub = ctx.AppState.subscribe(
        (store) => store.roomsToDiscover,
        (currState, prevState) => {
          if (currState.length > prevState.length) {
            const addedRoom = currState.find(
              (room) => !prevState.some((r) => r.appId === room.appId)
            )
            if (addedRoom) emit.next({ ...addedRoom, _evt: 'add' })
          }

          if (currState.length < prevState.length) {
            const removedRoom = prevState.find(
              (room) => !currState.some((r) => r.appId === room.appId)
            )
            if (removedRoom) emit.next({ ...removedRoom, _evt: 'del' })
          }
          prevRooms = currState
        },
        {
          fireImmediately: true,
          equalityFn: (a, b) => a.length > b.length
        }
      )
      return unsub
    })
  }),
  getRoomsListeningTo: NodeProcedure.query<IWSRoomListener[]>(
    ({ ctx }) => ctx.AppState.getState().roomsListeningTo
  ),
  getCurrentListeners: NodeProcedure.query<IRoomListener[]>(
    ({ ctx }) => ctx.AppState.getState().currentListeners
  ),
  getStoredListeners: NodeProcedure.query(({ ctx }) => {
    return ctx.AppState.getState().storedListeners
  }),
  addToListeningTo: NodeProcedure.input(
    z18n.object({ appId: z18n.cuid2() })
  ).mutation(({ ctx, input }) => {
    try {
      ctx.AppState.getState().addToListeningTo(input.appId)
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'socket.addToListeningTo',
        ErrorNotificationService.getErrorMessage(error)
      )
    }
  }),
  deleteListeningTo: NodeProcedure.input(
    z18n.object({ appId: z18n.string().cuid2() })
  ).mutation(({ ctx, input }) => {
    try {
      ctx.AppState.getState().deleteListeningTo(input.appId)
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'socket.deleteListeningTo',
        ErrorNotificationService.getErrorMessage(error)
      )
    }
  }),
  requestHelp: NodeProcedure.mutation(async ({ ctx }) => {
    try {
      ctx.AppState.getState().requestHelp()
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'socket.requestHelp',
        ErrorNotificationService.getErrorMessage(error)
      )
    }
  }),
  respondToHelp: NodeProcedure.input(
    z18n.object({ appId: z18n.cuid2() })
  ).mutation(({ ctx, input }) => {
    try {
      ctx.AppState.getState().respondToHelp(input.appId)
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'socket.respondToHelp',
        ErrorNotificationService.getErrorMessage(error)
      )
    }
  })
})
