import Versions from '@renderer/components/Versions'
import { trpcReact } from '@renderer/services/trpc'
import { createFileRoute } from '@tanstack/react-router'
import { ReactNode } from 'react'

export const Route = createFileRoute('/')({
  component: Component
})

function Component(): ReactNode {
  const IPCInitialize = trpcReact.protected.initialize.useMutation()
  return (
    <>
      {/* <img alt="logo" className="logo" src={electronLogo} /> */}
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
