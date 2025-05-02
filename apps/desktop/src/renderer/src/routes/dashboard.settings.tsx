import { trpcReact } from '@renderer/services/trpc'
import { createFileRoute } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { UpdateNameForm } from './-components/dashboard/settings/UpdateName.form'

export const Route = createFileRoute('/dashboard/settings')({
  component: RouteComponent
})

function RouteComponent(): ReactNode {
  const ApiLocalData = trpcReact.PROTECTED.getLocalData.useQuery()
  return (
    <section className="grow mt-4 [*]:px-4">
      <UpdateNameForm
        isLoading={ApiLocalData.isLoading}
        loadErrors={{ name: !!ApiLocalData.error }}
        values={{
          name: ApiLocalData.data?.currentName ?? ''
        }}
      />
    </section>
  )
}
