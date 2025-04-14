import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createHashHistory,
  createRouter,
  RouterProvider
} from '@tanstack/react-router'
import { ipcLink } from 'electron-trpc/renderer'
import { ReactNode, useState } from 'react'
import { TamaguiProvider } from 'tamagui'
import { routeTree } from './routeTree.gen'
import {
  LocalAuthProvider,
  useLocalAuth
} from './routes/-components/providers/LocalAuth.provider'
import { trpcReact } from './services/trpc'
import { TamaguiConfig } from './tamagui.config'

//  Needed for Electron since all the router is shipped with the app, doesnt really need lazy load
const hashHistory = createHashHistory()
const router = createRouter({
  history: hashHistory,
  routeTree,
  context: {
    localAuth: undefined!
  }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function ContextRouter(): ReactNode {
  const localAuth = useLocalAuth()
  return (
    <TamaguiProvider config={TamaguiConfig} defaultTheme="dark">
      <RouterProvider router={router} context={{ localAuth }} />
    </TamaguiProvider>
  )
}

export function Root(): React.ReactNode {
  const [qc] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpcReact.createClient({
      links: [ipcLink()]
    })
  )

  // useInsertionEffect(() => {
  //   document.head.insertAdjacentHTML('beforeend', TamaguiConfig.getCSS())
  // }, [])

  return (
    <trpcReact.Provider client={trpcClient} queryClient={qc}>
      <QueryClientProvider client={qc}>
        <LocalAuthProvider>
          <ContextRouter />
        </LocalAuthProvider>
      </QueryClientProvider>
    </trpcReact.Provider>
  )
}
