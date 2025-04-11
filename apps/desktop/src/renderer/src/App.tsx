import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { trpcReact } from './services/trpc'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ipcLink } from 'electron-trpc/renderer'

function App(): JSX.Element {
  const IPCInitialize = trpcReact.protected.initialize.useMutation()

  // const IPCRequestHelp = trpcReact.requestHelp.useQuery()

  // const IPCSendDiscovery = trpcReact.sendDiscovery.useQuery()

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <button onClick={() => IPCInitialize.mutateAsync()}>Init</button>
          {/* <button onClick={IPCRequestHelp}>Help</button>
          <button onClick={IPCSendDiscovery.}>Discovery</button> */}
        </div>
      </div>
      <Versions></Versions>
    </>
  )
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
        <App />
      </QueryClientProvider>
    </trpcReact.Provider>
  )
}
