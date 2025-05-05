import {
  ILocalDataDTO,
  IRoomListener,
  IWSRoom,
  IWSRoomListener,
  RegisterLocalSchema,
  UdpSocketClient,
  z18n
} from '@mono/assist-api'
import { ErrorNotificationService } from '../src/services/ErrorNotif.service'
import { NodeSocketAdapter } from '../src/udp-client.adapter'
import { tInstance } from './trpc'
import { MemoryState } from '../memory-state'
import { getInternalIPv4 } from '../src/utils/getInternalIPv4'
import { TRPCError } from '@trpc/server'
import { getDeviceName } from '../src/utils/getDeviceName'
// import { EventEmitter } from 'node:stream'

// const EEListeningTo = new EventEmitter()

export const ProtectedTrpcRouter = tInstance.router({
  // App actions
  getLocalData: tInstance.procedure.query<ILocalDataDTO['Create']>(async () => {
    return await MemoryState.getState().getRepos().LocalData.get()
  }),
  updateLocalName: tInstance.procedure
    .input(RegisterLocalSchema)
    .mutation(async (req) => {
      try {
        await MemoryState.getState().getRepos().LocalData.patch({
          currentName: req.input.name
        })
        MemoryState.getState().updateMemoryState('currentName', req.input.name)
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'db.patchLocalName',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    }),

  // Room actions
  initialize: tInstance.procedure.mutation<null>(async () => {
    if (MemoryState.getState().connAdapter) return null

    const { currentName, currentAppId } = await MemoryState.getState()
      .getRepos()
      .LocalData.get()
    MemoryState.getState().updateMemoryState('currentName', currentName)
    MemoryState.getState().updateMemoryState('currentAppId', currentAppId)
    MemoryState.getState().updateMemoryState('currentDevice', getDeviceName())
    const netInfo = getInternalIPv4()
    if (!netInfo) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    const client = new UdpSocketClient({
      adapter: new NodeSocketAdapter(),
      store: MemoryState.getState(),
      address: netInfo.address
    })
    client.init()

    return null
  }),
  sendDiscovery: tInstance.procedure.mutation(() => {
    try {
      MemoryState.getState().sendDiscovery()
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'socket.sendDiscovery',
        ErrorNotificationService.getErrorMessage(error)
      )
    }
  }),
  getRoomsToDiscover: tInstance.procedure.query<IWSRoom[]>(
    () => MemoryState.getState().roomsToDiscover
  ),
  getRoomsListeningTo: tInstance.procedure.query<IWSRoomListener[]>(
    () => MemoryState.getState().roomsListeningTo
  ),
  getCurrentListeners: tInstance.procedure.query<IRoomListener[]>(
    () => MemoryState.getState().currentListeners
  ),
  getStoredListeners: tInstance.procedure.query(() => {
    return MemoryState.getState().storedListeners
  }),
  addToListeningTo: tInstance.procedure
    .input(z18n.object({ appId: z18n.string().cuid2() }))
    .mutation((req) => {
      try {
        MemoryState.getState().addToListeningTo(req.input.appId)
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'socket.addToListeningTo',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    }),
  deleteListeningTo: tInstance.procedure
    .input(z18n.object({ appId: z18n.string().cuid2() }))
    .mutation((req) => {
      try {
        MemoryState.getState().deleteListeningTo(req.input.appId)
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'socket.deleteListeningTo',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    }),
  requestHelp: tInstance.procedure.mutation(async () => {
    try {
      MemoryState.getState().requestHelp()
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'socket.requestHelp',
        ErrorNotificationService.getErrorMessage(error)
      )
    }
  }),
  respondToHelp: tInstance.procedure
    .input(z18n.object({ appId: z18n.string().cuid2() }))
    .mutation((req) => {
      try {
        MemoryState.getState().respondToHelp(req.input.appId)
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'socket.respondToHelp',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    })
})
