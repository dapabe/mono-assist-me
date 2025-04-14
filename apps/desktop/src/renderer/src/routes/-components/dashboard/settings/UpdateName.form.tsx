import { zodResolver } from '@hookform/resolvers/zod'
import { IRegisterLocalSchema, RegisterLocalSchema } from '@mono/assist-api'
import { trpcReact } from '@renderer/services/trpc'
import { IFormProps } from '@renderer/types/forms'
import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Form, Input, Label, Spinner, XStack } from 'tamagui'

export function UpdateNameForm({
  values,
  isLoading,
  laodErrors
}: IFormProps<IRegisterLocalSchema>): ReactNode {
  const ApiUpdateName = trpcReact.PROTECTED.updateLocalName.useMutation()

  const form = useForm<IRegisterLocalSchema>({
    defaultValues: { name: values.name },
    resolver: zodResolver(RegisterLocalSchema)
  })

  const handleSubmit = async (): Promise<void> => {
    console.log(form.getValues())
    // await ApiUpdateName.mutateAsync({ name: '' })
  }

  if (isLoading && !laodErrors?.name) return <Spinner />

  return (
    <Form onSubmit={handleSubmit}>
      <XStack items={'center'}>
        <Label htmlFor="name">Nombre actual</Label>
        <Input
          {...form.register('name')}
          disabled={ApiUpdateName.isLoading || laodErrors?.name}
          flex={1}
          id="name"
          placeholder={laodErrors?.name ? 'name error on load' : undefined}
        />
      </XStack>

      <Form.Trigger
        asChild
        disabled={ApiUpdateName.isLoading || laodErrors?.name}
      >
        <Button icon={ApiUpdateName.isLoading ? <Spinner /> : undefined}>
          Actualizar
        </Button>
      </Form.Trigger>
    </Form>
  )
}
