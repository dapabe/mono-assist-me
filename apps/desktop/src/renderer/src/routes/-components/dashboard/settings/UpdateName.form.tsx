import { zodResolver } from '@hookform/resolvers/zod'
import { IRegisterLocalSchema, RegisterLocalSchema } from '@mono/assist-api'
import { trpcReact } from '@renderer/services/trpc'
import { IFormProps } from '@renderer/types/forms'
import { ReactNode } from 'react'
import { Button, Label, Spinner, XStack, YStack } from 'tamagui'
import { createForm } from '../../form'

const Form = createForm<IRegisterLocalSchema>()
export function UpdateNameForm({
  values,
  isLoading,
  loadErrors
}: IFormProps<IRegisterLocalSchema>): ReactNode {
  const ApiUpdateName = trpcReact.PROTECTED.updateLocalName.useMutation()

  const handleSubmit = async (values: IRegisterLocalSchema): Promise<void> => {
    await ApiUpdateName.mutateAsync(values)
  }

  if (isLoading && !loadErrors?.name) return <Spinner />

  return (
    <Form
      defaultValues={{ name: values.name }}
      resolver={zodResolver(RegisterLocalSchema)}
      onSubmit={handleSubmit}
    >
      <YStack rowGap={'$4'} columnGap={'$4'}>
        <YStack>
          <XStack columnGap={'$4'} items={'center'}>
            <Label htmlFor="name">Nombre actual</Label>
            <Form.Input
              // disabled={ApiUpdateName.isLoading || loadErrors?.name}
              flex={1}
              id="name"
              name="name"
              disabled={loadErrors?.name}
              placeholder={loadErrors?.name ? 'name error on load test' : null}
            />
            <Form.Trigger
              asChild
              disabled={ApiUpdateName.isLoading || loadErrors?.name}
              flex={1}
            >
              <Button icon={ApiUpdateName.isLoading ? <Spinner /> : null}>
                Actualizar
              </Button>
            </Form.Trigger>
          </XStack>
          <Form.Error name="name" />
        </YStack>
      </YStack>
    </Form>
  )
}
