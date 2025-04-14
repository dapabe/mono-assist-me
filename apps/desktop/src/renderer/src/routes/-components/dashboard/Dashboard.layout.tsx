import { Link } from '@tanstack/react-router'
import { PropsWithChildren, ReactNode } from 'react'
import { Group, YStack } from 'tamagui'

export function DashboardLayout(props: PropsWithChildren): ReactNode {
  return (
    <>
      <Group
        orientation="horizontal"
        //  justify={'space-around'}
        //   gap={'$2'}
        //    paddingBlock={'$4'}
      >
        <Group.Item>
          <Link to="/dashboard">Llamar</Link>
        </Group.Item>
        <Group.Item>
          <Link to="/dashboard/receiver">Listas</Link>
        </Group.Item>
        <Group.Item>
          <Link to="/dashboard/settings">Configuración</Link>
        </Group.Item>
      </Group>
      <YStack>{props.children}</YStack>
    </>
  )
}
