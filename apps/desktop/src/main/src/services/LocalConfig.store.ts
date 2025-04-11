/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILocalData, LocalDataSchema, stringToJSONSchema, vanillaRoomStore } from '@mono/assist-api'
import { createStore } from 'zustand/vanilla'
import fs, { constants } from 'node:fs/promises'
import path from 'node:path'
import { app } from 'electron'
import { ZodError } from 'zod'

const room = vanillaRoomStore.getState()
const localPath = path.join(app.getAppPath(), 'local-user.json')

type ILocalConfigStore = {
  getLocalData: () => Promise<ILocalData>
  updateCurrentName: (name: string) => Promise<void>
}

export const LocalConfigStore = createStore<ILocalConfigStore>((set, get) => ({
  getLocalData: async (): Promise<ILocalData> => {
    const rewriteLocalData = () =>
      fs.writeFile(localPath, JSON.stringify(LocalDataSchema.parse({})), 'utf-8')
    try {
      await fs.access(localPath, constants.R_OK)
      const file = await fs.readFile(localPath, 'utf-8')
      const json = stringToJSONSchema.safeParse(file)
      if (json.error) throw json.error
      const parsed = LocalDataSchema.safeParse(json.data)
      if (parsed.error) throw parsed.error
      return parsed.data
    } catch (error: any) {
      if (error instanceof ZodError) {
        await rewriteLocalData()
        return await get().getLocalData()
      } else if (error.code === 'ENOENT') {
        await rewriteLocalData()
        return await get().getLocalData()
      } else {
        console.log(`Unexpected error: ${error}`)
      }
    }
    throw new Error()
  },
  updateCurrentName: async (name): Promise<void> => {
    const data = await get().getLocalData()
    await fs.writeFile(localPath, JSON.stringify({ ...data, currentName: name }), 'utf-8')
    room.updateCurrentName(name)
  },
  updateCurrentAppId: async (appId) => {
    const data = await get().getLocalData()
  }
}))
