import { DatabaseService } from '../database/DatabaseService';
import {
  IConnAdapter,
  IConnMethod,
  IRoomServiceStatus,
  RoomEventLiteral,
} from '../schemas/RoomEvent.schema';
import { UUID } from '../types/common';
import {
  FromSocketUnion,
  IRoomData,
  IRoomListener,
  IWSRoom,
  IWSRoomListener,
  RemoteUDPInfo,
} from '../types/room.context';

type InMemoryStateKey = 'status' | 'currentAppId' | 'currentName' | 'currentDevice';

type InMemoryStateMap = {
  status: IRoomServiceStatus;
  currentAppId: null | UUID;
  currentName: null | string;
  currentDevice: null | string;
};

export type IAssistanceRoomClientSlice = InMemoryStateMap & {
  connMethod: IConnMethod;
  connAdapter: IConnAdapter;
  updateMemoryState: <K extends InMemoryStateKey>(k: K, v: InMemoryStateMap[K]) => void;

  /**
   * Check if they are ok, if not delete them or set to disconnect
   * the value is the epochTimestamp
   */
  scheduledToCheck: Map<
    UUID,
    {
      lastPing: number;
      port: number;
      address: string;
    }
  >;
  dbRepos: DatabaseService['Repo'] | null;
  syncDatabase: (repos: DatabaseService['Repo']) => void;

  /**	Iterates over all existing devices */
  getMergedRooms: () => IRoomData[];
  updateConnectionMethod: (c: IConnMethod, a: IConnAdapter) => void;
  updateConnectionStatus: (s: IRoomServiceStatus) => void;
  getAppId: () => UUID;
  getCurrentName: () => string;

  onRemoteRespondToAdvertise: (
    payload: FromSocketUnion<typeof RoomEventLiteral.RespondToAdvertise>,
    rinfo: RemoteUDPInfo
  ) => void;
  onRemoteBroadcastStop: (payload: FromSocketUnion<typeof RoomEventLiteral.BroadcastStop>) => void;
  onStartListening: (appId: UUID) => IWSRoom | undefined;
  onReceiverListening: (
    payload: FromSocketUnion<typeof RoomEventLiteral.Listening>,
    rinfo: RemoteUDPInfo
  ) => void;
  onRemoteNotListening: (payload: FromSocketUnion<typeof RoomEventLiteral.NotListening>) => void;
  onEmitterRequestHelp: (payload: FromSocketUnion<typeof RoomEventLiteral.RequestHelp>) => void;
  onEmitterStopsHelpRequest: (
    payload: FromSocketUnion<typeof RoomEventLiteral.RequestStop>
  ) => void;
  updateIncomingResponder: (
    payload: FromSocketUnion<typeof RoomEventLiteral.RespondToHelp>
  ) => void;
  onInvalidMessage: (payload: FromSocketUnion<typeof RoomEventLiteral.Invalid>) => void;
  onRemoteStatusResponse: (
    payload: FromSocketUnion<typeof RoomEventLiteral.ImOkay>,
    rinfo: RemoteUDPInfo
  ) => void;
  onDeviceCleanUp: (appId: UUID) => void;

  sendDiscovery: () => void;
};

export type IRoomEmitterSlice = {
  //  Emitter mode
  incomingResponder: string | null;
  currentListeners: Map<UUID, IRoomListener>;
  requestHelp: () => void;
};

export type IRoomReceiverSlice = {
  roomsToDiscover: Map<UUID, IWSRoom>;
  roomsListeningTo: Map<UUID, IWSRoomListener>;
  respondToHelp: (appId: UUID) => void;
  addToListeningTo: (appId: UUID) => void;
  deleteListeningTo: (appId: UUID) => void;
};
