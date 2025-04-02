import { createStore } from 'zustand/vanilla';

import { IAssistanceRoomClientSlice, IRoomEmitterSlice, IRoomReceiverSlice } from './Room.state';
import { RoomEventLiteral, RoomServiceStatus } from '../schemas/RoomEvent.schema';
import { UUID } from '../types/common';
import { IRoomData, IRoomListener } from '../types/room.context';
import { UdpSocketClient } from '../udp-client/UDPClient';

type State = IAssistanceRoomClientSlice & IRoomEmitterSlice & IRoomReceiverSlice;

/**
 * 	This reducer takes care of most of the app's state and side effects
 * 	It has been done this way to be agnostic to connection methods logic
 * 	and to be used alongside them.
 *
 * 	@edit This was a reducer from react and got stripped to be used
 * 	outside react itself.
 */
export const useRoomStore = createStore<State>((set, get) => ({
  connMethod: null,
  status: RoomServiceStatus.Down,
  currentAppId: null,
  currentName: null,
  currentDevice: null,
  HEARTBEAT_INTERVAL: 0,
  scheduledToCheck: new Map(),

  //  Room receiver values
  roomsListeningTo: new Map(),
  roomsToDiscover: new Map(),

  //  Room emitter values
  currentListeners: new Map<UUID, IRoomListener>(),
  incomingResponder: null,
  HELP_INTERVAL: null,

  updateConnectionMethod: (connMethod) => set({ connMethod }),
  updateConnectionStatus: (status) => set({ status }),
  updateAppId: (currentAppId) => set({ currentAppId }),
  updateCurrentName: (currentName) => set({ currentName }),
  updateCurrentDevice: (currentDevice) => set({ currentDevice }),
  getAppId: () => {
    const appId = get().currentAppId;
    if (appId) return appId;
    throw new Error('NoAppId');
  },
  getCurrentName: () => {
    const name = get().currentName;
    if (name) return name;
    throw new Error('NoName');
  },

  onRemoteRespondToAdvertise: (payload, rinfo) => {
    //	If it hasn't been discovered nor is listening to it, add it to the list
    const isListening = get().roomsListeningTo.has(payload.appId);
    const hasDiscovered = get().roomsToDiscover.has(payload.appId);
    if (isListening || hasDiscovered) return;
    set((state) => ({
      roomsToDiscover: state.roomsToDiscover.set(payload.appId, {
        ...payload,
        port: rinfo.port,
        address: rinfo.address,
      }),
    }));
  },
  onRemoteBroadcastStop: (payload) => {
    set((state) => {
      // All devices check if it is on the discovery list and deletes it
      let emitter = state.roomsToDiscover.get(payload.appId);
      if (emitter) {
        state.roomsToDiscover.delete(emitter.appId);
        return state;
      }
      //	and set the emitter to disconnected
      emitter = state.roomsListeningTo.get(payload.appId);
      if (emitter) {
        state.roomsListeningTo.set(emitter.appId, {
          ...emitter,
          disconnected: true,
          needsAssist: false,
        });
      }

      return state;
    });
  },
  onStartListening: (appId) => {
    // On the receiver end, before sending "listening" to the emitter
    // add it to roomsListeningTo and delete it from roomsToDiscover
    const room = get().roomsToDiscover.get(appId);
    if (room) {
      set((state) => {
        state.roomsToDiscover.delete(room.appId);
        return {
          roomsListeningTo: state.roomsListeningTo.set(room.appId, {
            ...room,
            disconnected: false,
            needsAssist: false,
          }),
        };
      });
    }
    // Returns wether it exists or not in roomsToDiscover
    return room;
  },
  onReceiverListening: (payload, rinfo) => {
    // The emitter keeps track of the receiver listening to him
    set((state) => ({
      currentListeners: state.currentListeners.set(payload.appId, {
        ...payload,
        port: rinfo.port,
        address: rinfo.address,
      }),
    }));
  },
  onRemoteNotListening: (payload) => {
    set((state) => {
      state.roomsListeningTo.delete(payload.appId);
      return state;
    });
  },
  onEmitterRequestHelp: (payload) => {
    //	From the receiver end, set the emitter to needing assist
    const emitter = get().roomsListeningTo.get(payload.appId);
    if (emitter) {
      set((state) => ({
        roomsListeningTo: state.roomsListeningTo.set(payload.appId, {
          ...emitter,
          needsAssist: true,
        }),
      }));
    }
  },
  onEmitterStopsHelpRequest: (payload) => {
    //	From the receiver end, set the emitter to not needing assist anymore
    const emitter = get().roomsListeningTo.get(payload.appId);
    if (emitter) {
      set((state) => ({
        roomsListeningTo: state.roomsListeningTo.set(payload.appId, {
          ...emitter,
          needsAssist: false,
        }),
      }));
    }
  },
  updateIncomingResponder: (payload) => {
    //	From the emitter end, set the incoming responder
    set(() => ({ incomingResponder: payload.responderName }));
  },
  onInvalidMessage: (payload) => {
    //	Handle invalid events
    //	That would never happen in a managed app, this is just in case.
    //	Probably later add a error toast.
    console.log(`[Invalid schema]: ${payload}`);
  },
  onRemoteStatusResponse: (payload, rinfo) => {
    set((state) => {
      // 	On this device.
      //	If it is someone this device listens to, connect it again
      const listeningTo = get().roomsListeningTo.get(payload.appId);
      if (listeningTo) {
        state.roomsListeningTo.set(listeningTo.appId, {
          ...listeningTo,
          disconnected: false,
        });

        //	Update that device last status so it wont be removed on next check
        const device = get().scheduledToCheck.get(payload.appId);
        if (device) {
          state.scheduledToCheck.set(payload.appId, {
            ...device,
            lastPing: Date.now(),
          });
        }
        return state;
      }

      //	Update last ping status
      state.scheduledToCheck.set(payload.appId, {
        lastPing: Date.now(),
        port: rinfo.port,
        address: rinfo.address,
      });

      return state;
    });
  },
  onDeviceCleanUp: (appId) => {
    set((state) => {
      // On discovered devices, delete it
      let device = state.roomsToDiscover.get(appId);
      if (device) {
        state.roomsToDiscover.delete(device.appId);
        // return state;
      }

      // On listening devices, disconnect it
      device = state.roomsListeningTo.get(appId);
      if (device) {
        return {
          roomsListeningTo: state.roomsListeningTo.set(device.appId, {
            ...device,
            disconnected: true,
            needsAssist: false,
          }),
        };
      }

      // On current listeners delete it
      state.currentListeners.delete(appId);

      return state;
    });
  },

  getMergedRooms: () => {
    return [
      ...[...get().currentListeners].map<IRoomData>(([_, { responderName, ...room }]) => room),
      ...[...get().roomsListeningTo.values()].map<IRoomData>((x) => ({
        address: x.address,
        appId: x.appId,
        port: x.port,
      })),
      ...[...get().roomsToDiscover.values()].map<IRoomData>((x) => ({
        address: x.address,
        appId: x.appId,
        port: x.port,
      })),
    ];
  },

  sendDiscovery: () => {
    get().connMethod?.sendDiscovery();
  },

  //  Room receiver methods

  addToListeningTo: (appId) => {
    const discoveryRoom = get().onStartListening(appId);
    if (!discoveryRoom) return console.log('no emitter in discovery room');
    get().connMethod?.sendTo(discoveryRoom.port, discoveryRoom.address, {
      event: RoomEventLiteral.Listening,
      appId: get().getAppId(),
      responderName: get().getCurrentName(),
    });
  },
  respondToHelp: (appId) => {
    const emitter = get().roomsListeningTo.get(appId);

    if (!emitter || emitter.disconnected) {
      console.log('No emitter');
      // Alert.alert("Error", "Socket 404 or disconnected");
    } else {
      get().connMethod?.sendTo(emitter.port, emitter.address, {
        event: RoomEventLiteral.RespondToHelp,
        responderName: get().getCurrentName(),
      });
    }
  },
  deleteListeningTo: (appId) => {
    const listeningTo = get().roomsListeningTo.get(appId);
    if (listeningTo) {
      get().onRemoteNotListening({ appId });
      get().connMethod?.sendTo(listeningTo.port, listeningTo.address, {
        event: RoomEventLiteral.NotListening,
        appId: get().getAppId(),
      });
    }
  },

  //  Room emitter methods
  requestHelp: () => {
    if (!(get().connMethod instanceof UdpSocketClient)) return;
    get().connMethod?.requestHelp();
  },
}));
