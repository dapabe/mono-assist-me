import { zodResolver } from '@hookform/resolvers/zod'
import { IRegisterLocalSchema, RegisterLocalSchema } from '@mono/assist-api'
import { trpcReact } from '@renderer/services/trpc'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { Button, Label, Spinner, XStack, YStack } from 'tamagui'
import { createForm } from './-components/form'

export const Route = createFileRoute('/')({
  beforeLoad: (opts) => {
    if (opts.context.localAuth.isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: Component
})

const Form = createForm<IRegisterLocalSchema>()

function Component(): ReactNode {
  const ApiRegister = trpcReact.PUBLIC.register.useMutation()
  const nav = Route.useNavigate()

  const handleSubmit = async (values: IRegisterLocalSchema): Promise<void> => {
    await ApiRegister.mutateAsync(values)
    if (ApiRegister.isSuccess) return await nav({ to: '/dashboard' })
    console.log(ApiRegister.error)
  }

  return (
    <YStack>
      <Form
        defaultValues={{ name: '' }}
        //@ts-ignore recursive type depth
        resolver={zodResolver(RegisterLocalSchema)}
        onSubmit={handleSubmit}
      >
        <XStack items={'center'}>
          <Label htmlFor="name">Nombre con el que otros te veran</Label>
          <Form.Input id="name" name="name" flex={1} />
        </XStack>
        <Form.Error name="name" />
        <Form.Trigger asChild>
          <Button icon={ApiRegister.isLoading ? <Spinner /> : undefined}>
            Guardar
          </Button>
        </Form.Trigger>
      </Form>
    </YStack>
  )
}
