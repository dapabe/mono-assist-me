import {
  DatabaseService,
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
import { NodeSocketAdapter } from '../src/udp-client.adapter'
import { tInstance } from './trpc'

const db = DatabaseService.getInstance()
export const ProtectedTrpcRouter = tInstance.router({
  // App actions
  getLocalData: tInstance.procedure.query<ILocalData>(async () => {
    return await db.Repo.LocalData.get()
  }),
  updateLocalName: tInstance.procedure
    .input(RegisterLocalSchema)
    .mutation(async (req) => {
      try {
        await db.Repo.LocalData.patch({ currentName: req.input.name })
        vanillaRoomStore
          .getState()
          .updateMemoryState('currentName', req.input.name)
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'db.patchLocalName',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    }),

  // Room actions
  initialize: tInstance.procedure.mutation<null>(async () => {
    const { currentName, currentAppId } = await db.Repo.LocalData.get()
    const roomsListeningTo = await db.Repo.ListeningTo.get()
    const room = vanillaRoomStore.getState()
    room.updateMemoryState('currentName', currentName)
    room.updateMemoryState('currentAppId', currentAppId)

    const client = UdpSocketClient.getInstance({
      adapter: new NodeSocketAdapter(),
      store: room,
      address: '0.0.0.0',
      port: UdpSocketClient.DISCOVERY_PORT
    })
    client.init()

    return null
  }),
  sendDiscovery: tInstance.procedure.mutation(() => {
    try {
      vanillaRoomStore.getState().sendDiscovery()
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'socket.sendDiscovery',
        ErrorNotificationService.getErrorMessage(error)
      )
    }
  }),
  getRoomsToDiscover: tInstance.procedure.query<Map<UUID, IWSRoom>>(
    () => vanillaRoomStore.getState().roomsToDiscover
  ),
  getRoomsListeningTo: tInstance.procedure.query<Map<UUID, IWSRoomListener>>(
    () => vanillaRoomStore.getState().roomsListeningTo
  ),
  addToListeningTo: tInstance.procedure
    .input(z18n.object({ appId: z18n.string().uuid() }))
    .mutation((req) => {
      try {
        vanillaRoomStore.getState().addToListeningTo(req.input.appId)
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
        vanillaRoomStore.getState().deleteListeningTo(req.input.appId)
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'socket.deleteListeningTo',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    }),
  requestHelp: tInstance.procedure.mutation(async () => {
    try {
      vanillaRoomStore.getState().requestHelp()
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
        vanillaRoomStore.getState().respondToHelp(req.input.appId)
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'socket.respondToHelp',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    })
})
