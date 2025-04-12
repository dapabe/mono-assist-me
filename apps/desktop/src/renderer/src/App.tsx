import { trpcReact } from './services/trpc'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ipcLink } from 'electron-trpc/renderer'
import { createHashHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

//  Needed for Electron since all the router is shipped with the app, doesnt really need lazy load
const hashHistory = createHashHistory()
const router = createRouter({ history: hashHistory, routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function Root(): React.ReactNode {
  const [qc] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpcReact.createClient({
      links: [ipcLink()]
    })
  )
  return (
    <trpcReact.Provider client={trpcClient} queryClient={qc}>
      <QueryClientProvider client={qc}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </trpcReact.Provider>
  )
}
