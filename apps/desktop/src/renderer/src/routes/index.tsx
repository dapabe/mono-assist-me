import { zodResolver } from '@hookform/resolvers/zod'
import { IRegisterLocalSchema, RegisterLocalSchema } from '@mono/assist-api'
import { trpcReact } from '@renderer/services/trpc'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Form, Input, Label, XStack, YStack } from 'tamagui'

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
    defaultValues: { name: '' },
    resolver: zodResolver(RegisterLocalSchema)
  })

  const handleSubmit = async (): Promise<void> => {
    await ApiRegister.mutateAsync(form.getValues())
  }

  return (
    <YStack>
      <Form onSubmit={handleSubmit}>
        <XStack items={'center'}>
          <Label htmlFor="name">Nombre con el que otros te veran</Label>
          <Input
            {...form.register('name')}
            disabled={form.formState.isLoading}
            flex={1}
            id="name"
          />
        </XStack>
        <Form.Trigger asChild>
          <Button>Guardar</Button>
        </Form.Trigger>
      </Form>
    </YStack>
  )
}
