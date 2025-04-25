import {
  ILocalData,
  IWSRoom,
  IWSRoomListener,
  RegisterLocalSchema,
  UdpSocketClient,
  UUID,
  vanillaRoomStore,
  z18n
} from '@mono/assist-api'
import { ErrorNotificationService } from '../src/services/ErrorNotif.service'
import { LocalConfigStore } from '../src/services/LocalConfig.store'
import { NodeSocketAdapter } from '../src/udp-client.adapter'
import { tInstance } from './trpc'

const room = vanillaRoomStore.getState()

export const ProtectedTrpcRouter = tInstance.router({
  // App actions
  getLocalData: tInstance.procedure.query<ILocalData>(async () => {
    return await LocalConfigStore.getState().getLocalData()
  }),
  updateLocalName: tInstance.procedure
    .input(RegisterLocalSchema)
    .mutation(async (req) => {
      try {
        await LocalConfigStore.getState().updateCurrentName(req.input.name)
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'socket.updateLocalName',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    }),

  // Room actions
  initialize: tInstance.procedure.mutation(async () => {
    try {
      const client = new UdpSocketClient({
        adapter: new NodeSocketAdapter(),
        store: room,
        address: '0.0.0.0',
        port: UdpSocketClient.DISCOVERY_PORT
      })
      await client.init()
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'socket.initialize',
        ErrorNotificationService.getErrorMessage(error)
      )
    }
  }),
  sendDiscovery: tInstance.procedure.mutation(() => {
    try {
      room.sendDiscovery()
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'socket.sendDiscovery',
        ErrorNotificationService.getErrorMessage(error)
      )
    }
  }),
  getRoomsToDiscover: tInstance.procedure.query<Map<UUID, IWSRoom>>(
    () => room.roomsToDiscover
  ),
  getRoomsListeningTo: tInstance.procedure.query<Map<UUID, IWSRoomListener>>(
    () => room.roomsListeningTo
  ),
  addToListeningTo: tInstance.procedure
    .input(z18n.object({ appId: z18n.string().uuid() }))
    .mutation((req) => {
      try {
        room.addToListeningTo(req.input.appId)
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'socket.addToListeningTo',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    }),
  deleteListeningTo: tInstance.procedure
    .input(z18n.object({ appId: z18n.string().uuid() }))
    .mutation((req) => {
      try {
        room.deleteListeningTo(req.input.appId)
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'socket.deleteListeningTo',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    }),
  requestHelp: tInstance.procedure.mutation(() => {
    try {
      room.requestHelp()
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'socket.requestHelp',
        ErrorNotificationService.getErrorMessage(error)
      )
    }
  }),
  respondToHelp: tInstance.procedure
    .input(z18n.object({ appId: z18n.string().uuid() }))
    .mutation((req) => {
      try {
        room.respondToHelp(req.input.appId)
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'socket.respondToHelp',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    })
})
