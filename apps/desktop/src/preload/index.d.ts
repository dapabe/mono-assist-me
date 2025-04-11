import { ElectronAPI } from '@electron-toolkit/preload'
// import { exposeElectronTRPC } from 'electron-trpc/main'

declare global {
  interface Window {
    electron: ElectronAPI
    // api: ReturnType<typeof exposeElectronTRPC>
  }
}
