import {
  createHashHistory,
  createRouter,
  RouterProvider
} from '@tanstack/react-router'
import { ReactNode, useRef } from 'react'
import { routeTree } from './routeTree.gen'
import {
  LocalAuthProvider,
  useLocalAuth
} from './routes/-components/providers/LocalAuth.provider'
import { initI18nReact } from '@mono/assist-api/i18n/next'
import { I18nextProvider } from 'react-i18next'
import { TRPCProvider } from './TRPC.provider'

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
  const conf = useRef(initI18nReact()).current

  return (
    /**@ts-ignore This error is nonsense */
    <I18nextProvider i18n={conf}>
      <TRPCProvider>
        <LocalAuthProvider>
          <ContextRouter />
        </LocalAuthProvider>
      </TRPCProvider>
    </I18nextProvider>
  )
}
