import { useNavigate } from '@tanstack/react-router'
import { PropsWithChildren, ReactNode } from 'react'
import { Button, XGroup, YStack } from 'tamagui'

export function DashboardLayout(props: PropsWithChildren): ReactNode {
  const nav = useNavigate()
  return (
    <YStack>
      <XGroup justify={'center'}>
        <XGroup.Item>
          <Button
            width={'34%'}
            rounded={0}
            onPress={() => nav({ to: '/dashboard' })}
          >
            Llamar
          </Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button
            width={'32%'}
            onPress={() => nav({ to: '/dashboard/receiver' })}
          >
            Listas
          </Button>

          {/* <Link to="/dashboard/receiver">Listas</Link> */}
        </XGroup.Item>
        <XGroup.Item>
          <Button
            width={'34%'}
            radiused={true}
            rounded={0}
            onPress={() => nav({ to: '/dashboard/settings' })}
          >
            Configuración
          </Button>
        </XGroup.Item>
      </XGroup>
      <YStack flex={1}>{props.children}</YStack>
    </YStack>
  )
}
