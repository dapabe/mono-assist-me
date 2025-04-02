import * as path from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

// --entry ../../node_modules/electron
export default defineConfig((config) => {
  return {
    main: {
      // base: './',
      plugins: [externalizeDepsPlugin()]
    },
    preload: {
      plugins: [externalizeDepsPlugin()]
    },
    renderer: {
      // root: '.',
      resolve: {
        alias: {
          '@renderer': path.resolve('src', 'renderer', 'src')
        }
      },
      plugins: [react()]
    }
  }
})
