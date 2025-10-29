import { createRoomStore, IRoomState } from '@mono/assist-api'
import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'

export const NodeMemoryState = createStore<IRoomState>()(
  subscribeWithSelector(createRoomStore())
)
