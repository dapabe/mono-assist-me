import { initTRPC } from '@trpc/server'

export const tInstance = initTRPC.create({ isServer: true })
