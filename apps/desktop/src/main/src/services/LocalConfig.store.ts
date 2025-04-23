/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ILocalData,
  LocalDataSchema,
  stringToJSONSchema,
  UUID,
  vanillaRoomStore
} from '@mono/assist-api'
import { app } from 'electron'
import fs, { constants } from 'node:fs/promises'
import path from 'node:path'
import { isZodErrorLike } from 'zod-validation-error'
import { createStore } from 'zustand/vanilla'

const room = vanillaRoomStore.getState()
const localPath = path.join(app.getPath('userData'), 'local-user.json')

type ILocalConfigStore = {
  isAuthenticated: () => Promise<boolean>
  getLocalData: () => Promise<ILocalData>
  registerLocalData: (data: ILocalData) => Promise<void>
  updateCurrentName: (name: string) => Promise<void>
  updateCurrentAppId: (appId: UUID) => Promise<void>
}

export const LocalConfigStore = createStore<ILocalConfigStore>((_, get) => ({
  isAuthenticated: async (): Promise<boolean> => {
    try {
      await fs.access(localPath, constants.R_OK)
      const f = await fs.readFile(localPath, 'utf-8')
      const json = stringToJSONSchema.parse(f)
      LocalDataSchema.parse(json)
      return true
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return false
    }
  },
  getLocalData: async (): Promise<ILocalData> => {
    try {
      await fs.access(localPath, constants.R_OK)
      const file = await fs.readFile(localPath, 'utf-8')
      const json = stringToJSONSchema.parse(file)
      return LocalDataSchema.parse(json)
    } catch (error: any) {
      if (isZodErrorLike(error) || error.code === 'ENOENT') {
        // await rewriteLocalData()
        return await get().getLocalData()
      } else {
        console.log(`Unexpected error: ${error}`)
        process.exit(1)
      }
    }
  },
  registerLocalData: async (data): Promise<void> => {
    await fs.writeFile(localPath, JSON.stringify(data), 'utf-8')
  },
  updateCurrentName: async (name): Promise<void> => {
    const data = await get().getLocalData()
    await fs.writeFile(
      localPath,
      JSON.stringify({ ...data, currentName: name } satisfies ILocalData),
      'utf-8'
    )
    room.updateCurrentName(name)
  },
  updateCurrentAppId: async (appId): Promise<void> => {
    const data = await get().getLocalData()
    await fs.writeFile(
      localPath,
      JSON.stringify({
        ...data,
        currentAppId: appId
      } satisfies ILocalData),
      'utf-8'
    )
  }
}))
