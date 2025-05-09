import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createHashHistory,
  createRouter,
  RouterProvider
} from '@tanstack/react-router'
import { ipcLink } from 'electron-trpc/renderer'
import { ReactNode, useEffect, useState } from 'react'
import { routeTree } from './routeTree.gen'
import {
  LocalAuthProvider,
  useLocalAuth
} from './routes/-components/providers/LocalAuth.provider'
import { trpcReact } from './services/trpc'
import { loadLocale } from '@mono/assist-api/i18n/utils/sync'
import TypesafeI18n from '@mono/assist-api/i18n/react'

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
  return <RouterProvider router={router} context={{ localAuth }} />
}

export function Root(): React.ReactNode {
  const [qc] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpcReact.createClient({
      links: [ipcLink()]
    })
  )
  const [localeLoaded, setLoaded] = useState(false)

  useEffect(() => {
    loadLocale('en')
    setLoaded(true)
  }, [])

  if (!localeLoaded) return null

  return (
    <TypesafeI18n locale="en">
      <trpcReact.Provider client={trpcClient} queryClient={qc}>
        <QueryClientProvider client={qc}>
          <LocalAuthProvider>
            <ContextRouter />
          </LocalAuthProvider>
        </QueryClientProvider>
      </trpcReact.Provider>
    </TypesafeI18n>
  )
}
