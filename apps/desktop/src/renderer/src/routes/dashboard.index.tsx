import { trpcReact } from '@renderer/services/trpc'
import { createFileRoute } from '@tanstack/react-router'
import { ReactNode } from 'react'

export const Route = createFileRoute('/dashboard/')({
  component: Component
})

function Component(): ReactNode {
  const currentListeners = trpcReact.PROTECTED.getCurrentListeners.useQuery()
  const requestHelp = trpcReact.PROTECTED.requestHelp.useMutation()
  if (currentListeners.isLoading || currentListeners.isError) return null

  return (
    <section className="grow flex flex-col">
      <div className="grow flex items-center justify-center p-4">
        <button
          className="btn btn-primary btn-circle size-80 text-4xl"
          disabled={!currentListeners.data.length}
          onClick={() => requestHelp.mutate()}
        >
          Pedir ayuda
        </button>
      </div>
      <div className="divider m-0"></div>
      <div className="stats">
        <div className="stat">
          <div className="stat-title">Personas pendientes a ti:</div>
          <div className="stat-value font-mono">
            {currentListeners.data.length}
          </div>
        </div>
        <div className="stat">
          <label className="label text-sm hover:cursor-not-allowed">
            <input
              type="checkbox"
              defaultChecked
              disabled
              className="checkbox checkbox-sm rounded-sm"
            />
            Permitir ser descubierto
          </label>
        </div>
      </div>
    </section>
  )
}
