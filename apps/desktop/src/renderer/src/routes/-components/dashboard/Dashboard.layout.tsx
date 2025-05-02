import { Link, useLocation } from '@tanstack/react-router'
import { PropsWithChildren, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export function DashboardLayout(props: PropsWithChildren): ReactNode {
  const pathname = useLocation({
    select: (location) => location.pathname
  })

  return (
    <div className="flex flex-col min-h-svh">
      <div role="tablist" className="tabs tabs-box mx-2 mt-2">
        <Link
          role="tab"
          className={twMerge(
            'tab grow',
            pathname === '/dashboard' && 'tab-active'
          )}
          to="/dashboard"
        >
          Llamar
        </Link>
        <Link
          role="tab"
          className={twMerge(
            'tab grow',
            pathname === '/dashboard/receiver' && 'tab-active'
          )}
          to="/dashboard/receiver"
        >
          Listas
        </Link>
        <Link
          role="tab"
          className={twMerge(
            'tab grow',
            pathname === '/dashboard/settings' && 'tab-active'
          )}
          to="/dashboard/settings"
        >
          Configuración
        </Link>
      </div>
      {props.children}
    </div>
  )
}
