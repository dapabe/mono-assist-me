import { zodResolver } from '@hookform/resolvers/zod'
import { IRegisterLocalSchema, RegisterLocalSchema } from '@mono/assist-api'
import { useTranslation } from 'react-i18next'
import { trpcReact } from '@renderer/services/trpc'
import { IFormProps } from '@renderer/types/forms'
import { Spinner } from '@renderer/ui/Spinner'
import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'

// const Form = createForm<IRegisterLocalSchema>()
export function UpdateNameForm({
  values,
  isLoading,
  loadErrors
}: IFormProps<IRegisterLocalSchema>): ReactNode {
  const { t } = useTranslation()

  const ApiUpdateName = trpcReact.PROTECTED.updateLocalName.useMutation()

  const form = useForm<IRegisterLocalSchema>({
    defaultValues: { name: values.name }
    // resolver: zodResolver(RegisterLocalSchema)
  })

  const handleSubmit = async (): Promise<void> => {
    await ApiUpdateName.mutateAsync(form.getValues())
  }

  if (isLoading && !loadErrors?.name) return <Spinner />

  return (
    <form onSubmit={handleSubmit}>
      <div className="join flex">
        <label className="input join-item grow">
          <span className="label">
            {t('Dashboard.PageSettings.FormLocalName.Label')}
          </span>
          <input
            id="name"
            {...form.register('name')}
            disabled={loadErrors?.name || ApiUpdateName.isLoading}
            placeholder={loadErrors?.name ? 'name error on load test' : ''}
          />
        </label>
        <button
          type="submit"
          disabled={loadErrors?.name || ApiUpdateName.isLoading}
          className="btn btn-secondary join-item"
        >
          {ApiUpdateName.isLoading ? <Spinner /> : null}
          {!ApiUpdateName.isLoading && t('CommonWords.Update')}
        </button>
      </div>
      <label htmlFor="name" className="label text-xs text-center">
        {t('Dashboard.PageSettings.FormLocalName.Hint')}
      </label>
    </form>
  )
}
