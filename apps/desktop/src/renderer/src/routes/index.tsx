import { zodResolver } from '@hookform/resolvers/zod'
import { IRegisterLocalSchema, RegisterLocalSchema } from '@mono/assist-api'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { Spinner } from '@renderer/ui/Spinner'
import { useLocalAuth } from './-components/providers/LocalAuth.provider'
import { useI18nContext } from '@mono/assist-api/i18n/react'

export const Route = createFileRoute('/')({
  beforeLoad: (opts) => {
    if (opts.context.localAuth.isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: Component
})

function Component(): ReactNode {
  const { LL } = useI18nContext()

  const { register } = useLocalAuth()
  const form = useForm<IRegisterLocalSchema>({
    defaultValues: { name: '' }
  })
  const nav = Route.useNavigate()

  const handleSubmit = async (): Promise<void> => {
    await register(form.getValues().name)
      .then(async () => {
        await nav({ to: '/dashboard' })
      })
      .catch((reason) => {
        console.log(reason)
      })
    // if (ApiRegister.isSuccess) return await nav({ to: '/dashboard' })
  }

  return (
    <form
      //@ts-ignore recursive type depth
      // resolver={zodResolver(RegisterLocalSchema)}
      onSubmit={handleSubmit}
      className="min-h-svh flex flex-col justify-center items-center"
    >
      <fieldset className="fieldset bg-base-200 p-4 rounded-box">
        <label htmlFor="name" className="label text-lg">
          {LL.FormLocalRegister.Label()}
        </label>
        <input
          id="name"
          {...form.register('name')}
          className="input input-lg input-neutral"
          placeholder={LL.FormLocalRegister.Placeholder()}
        />
        <label role="definition" htmlFor="name" className="label text-sm">
          {LL.FormLocalRegister.Hint()}
        </label>
        <button
          type="submit"
          className="btn btn-lg btn-neutral"
          disabled={form.formState.isLoading}
        >
          {form.formState.isLoading ? <Spinner /> : undefined}
          {!form.formState.isLoading && LL.CommonWords.Continue()}
        </button>
      </fieldset>
    </form>
  )
}
