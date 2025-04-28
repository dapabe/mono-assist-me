import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import { exposeElectronTRPC } from 'electron-trpc/main'

const api = {
  onError: (
    callback: (error: { title: string; message: string }) => void
  ): void => {
    ipcRenderer.on('show-error', (_, error) => callback(error))
  }
} as const

export type BridgeApi = typeof api

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    // Custom APIs for renderer
    contextBridge.exposeInMainWorld('api', api)
    process.once('loaded', exposeElectronTRPC)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  // window.electron = electronAPI
  // @ts-ignore (define in dts)
  // window.api = api
}
