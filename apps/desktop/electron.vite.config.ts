import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react'
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
      // build: {
      //   rollupOptions: {
      //     external: [
      //       'drizzle-orm',
      //       'drizzle-orm/*',
      //       'better-sqlite3',
      //       '@mono/assist-api/database/*',
      //       /drizzle-orm\/.*/
      //     ]
      //   }
      // },
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
          routesDirectory: path.resolve('src', 'renderer', 'src', 'routes'),
          generatedRouteTree: path.resolve(
            'src',
            'renderer',
            'src',
            'routeTree.gen.ts'
          )
        }),
        react(),
        tamaguiPlugin({
          config: path.resolve('src', 'renderer', 'src', 'tamagui.config.ts'),
          components: ['tamagui'],
          optimize: true
        })
      ]
    }
  }
})
