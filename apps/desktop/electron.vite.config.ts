import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import * as path from 'node:path'
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
        tailwindcss(),
        TanStackRouterVite({
          target: 'react',
          autoCodeSplitting: true,
          quoteStyle: 'single',
          routeFileIgnorePrefix: '-',
          routesDirectory: path.resolve('src', 'renderer', 'src', 'routes'),
          generatedRouteTree: path.resolve(
            'src',
            'renderer',
            'src',
            'routeTree.gen.ts'
          )
        }),
        react()
      ]
    }
  }
})
