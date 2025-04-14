import { Link } from '@tanstack/react-router'
import { PropsWithChildren, ReactNode } from 'react'
import { XStack, YStack } from 'tamagui'

export function DashboardLayout(props: PropsWithChildren): ReactNode {
  return (
    <>
      <XStack justify={'space-around'} gap={'$2'} paddingBlock={'$4'}>
        <Link to="/dashboard">Llamar</Link>
        <Link to="/dashboard/receiver">Listas</Link>
        <Link to="/dashboard/settings">Configuración</Link>
      </XStack>
      <YStack>{props.children}</YStack>
    </>
  )
}
