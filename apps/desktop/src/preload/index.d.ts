import { ElectronAPI } from '@electron-toolkit/preload'
import type { BridgeApi } from './index'

declare global {
  interface Window {
    electron: ElectronAPI
    api: BridgeApi
  }
}
