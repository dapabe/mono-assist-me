import * as path from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
//@ts-ignore The source is on the root node_modules
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// --entry ../../node_modules/electron
export default defineConfig(() => {
  return {
    main: {
      plugins: [externalizeDepsPlugin()]
    },
    preload: {
      plugins: [externalizeDepsPlugin()]
    },
    renderer: {
      resolve: {
        alias: {
          '@renderer': path.resolve('src', 'renderer', 'src')
        }
      },
      plugins: [
        TanStackRouterVite({
          target: 'react',
          autoCodeSplitting: true,
          quoteStyle: 'single',
          routeFileIgnorePrefix: '-',
          routesDirectory: './src/renderer/src/routes',
          generatedRouteTree: './src/renderer/src/routeTree.gen.ts'
        }),
        react()
      ]
    }
  }
})
