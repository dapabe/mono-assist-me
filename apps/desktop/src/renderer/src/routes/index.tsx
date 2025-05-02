import { zodResolver } from '@hookform/resolvers/zod'
import { IRegisterLocalSchema, RegisterLocalSchema } from '@mono/assist-api'
import { trpcReact } from '@renderer/services/trpc'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { Spinner } from '@renderer/ui/Spinner'

export const Route = createFileRoute('/')({
  beforeLoad: (opts) => {
    if (opts.context.localAuth.isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: Component
})

function Component(): ReactNode {
  const ApiRegister = trpcReact.PUBLIC.register.useMutation()
  const form = useForm<IRegisterLocalSchema>({
    defaultValues: { name: '' }
  })
  const nav = Route.useNavigate()

  const handleSubmit = async (values: IRegisterLocalSchema): Promise<void> => {
    await ApiRegister.mutateAsync(values)
    if (ApiRegister.isSuccess) return await nav({ to: '/dashboard' })
    console.log(ApiRegister.error)
  }

  return (
    <form
      //@ts-ignore recursive type depth
      // resolver={zodResolver(RegisterLocalSchema)}
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="name">Nombre con el que otros te veran</label>
        <input {...form.register('name')} />
      </div>
      <button type="submit">
        {ApiRegister.isLoading ? <Spinner /> : undefined}
        {!ApiRegister.isLoading && 'Guardar'}
      </button>
    </form>
  )
}
