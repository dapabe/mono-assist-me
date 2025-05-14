import { trpcReact } from '@renderer/services/trpc'
import { createFileRoute } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { UpdateNameForm } from './-components/dashboard/settings/UpdateName.form'
import { DevSettings } from './-components/dashboard/settings/DevSettings'
import { LocalSwitcher } from './-components/dashboard/settings/LocalSwitcher'

export const Route = createFileRoute('/dashboard/settings')({
  component: RouteComponent
})

function RouteComponent(): ReactNode {
  const ApiLocalData = trpcReact.PROTECTED.getLocalData.useQuery()
  return (
    <section className="grow pt-4 [*]:px-4 flex flex-col overflow-y-auto gap-y-4">
      <LocalSwitcher />
      <UpdateNameForm
        values={{
          name: ApiLocalData.data?.currentName ?? ''
        }}
        isLoading={ApiLocalData.isLoading}
        loadErrors={{ name: ApiLocalData.error?.message }}
      />
      {import.meta.env.DEV && <DevSettings />}
    </section>
  )
}
