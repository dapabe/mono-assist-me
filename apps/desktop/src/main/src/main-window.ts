import { BrowserWindow, shell } from 'electron'
import path from 'node:path'
import { attachTRPCHandlers } from '../trpc/router'
import icon from '../../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'

export function createMainWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 460,
    height: 650,
    resizable: false,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '..', '..', 'preload', 'index.js'),
      sandbox: false
    }
  })

  attachTRPCHandlers(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}
