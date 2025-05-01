import {
  ILocalDataDTO,
  IRoomListener,
  IWSRoom,
  IWSRoomListener,
  RegisterLocalSchema,
  UdpSocketClient,
  vanillaRoomStore,
  z18n
} from '@mono/assist-api'
import { ErrorNotificationService } from '../src/services/ErrorNotif.service'
import { NodeSocketAdapter } from '../src/udp-client.adapter'
import { tInstance } from './trpc'
// import { EventEmitter } from 'node:stream'

const MemoryState = vanillaRoomStore.getState()
// const EEListeningTo = new EventEmitter()

export const ProtectedTrpcRouter = tInstance.router({
  // App actions
  getLocalData: tInstance.procedure.query<ILocalDataDTO['Create']>(async () => {
    return await MemoryState.getRepos().LocalData.get()
  }),
  updateLocalName: tInstance.procedure
    .input(RegisterLocalSchema)
    .mutation(async (req) => {
      try {
        await MemoryState.getRepos().LocalData.patch({
          currentName: req.input.name
        })
        MemoryState.updateMemoryState('currentName', req.input.name)
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'db.patchLocalName',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    }),

  // Room actions
  initialize: tInstance.procedure.mutation<null>(async () => {
    const { currentName, currentAppId } =
      await MemoryState.getRepos().LocalData.get()
    MemoryState.updateMemoryState('currentName', currentName)
    MemoryState.updateMemoryState('currentAppId', currentAppId)

    const client = UdpSocketClient.getInstance({
      adapter: new NodeSocketAdapter(),
      store: MemoryState,
      address: '0.0.0.0',
      port: UdpSocketClient.DISCOVERY_PORT
    })
    client.init()

    return null
  }),
  sendDiscovery: tInstance.procedure.mutation(() => {
    try {
      MemoryState.sendDiscovery()
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'socket.sendDiscovery',
        ErrorNotificationService.getErrorMessage(error)
      )
    }
  }),
  getRoomsToDiscover: tInstance.procedure.query<IWSRoom[]>(
    () => MemoryState.roomsToDiscover
  ),
  getRoomsListeningTo: tInstance.procedure.query<IWSRoomListener[]>(
    () => MemoryState.roomsListeningTo
  ),
  getCurrentListeners: tInstance.procedure.query<IRoomListener[]>(
    () => MemoryState.currentListeners
  ),
  getStoredListeners: tInstance.procedure.query(() => {
    return MemoryState.storedListeners
  }),
  addToListeningTo: tInstance.procedure
    .input(z18n.object({ appId: z18n.string().cuid2() }))
    .mutation((req) => {
      try {
        MemoryState.addToListeningTo(req.input.appId)
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
        MemoryState.deleteListeningTo(req.input.appId)
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'socket.deleteListeningTo',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    }),
  requestHelp: tInstance.procedure.mutation(async () => {
    try {
      MemoryState.requestHelp()
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
        MemoryState.respondToHelp(req.input.appId)
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'socket.respondToHelp',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    })
})
