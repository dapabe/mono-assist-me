import { defaultRoomStore, IRoomState } from '@mono/assist-api';
import { create } from 'zustand';

export const useRoomStore = create<IRoomState>(defaultRoomStore);
