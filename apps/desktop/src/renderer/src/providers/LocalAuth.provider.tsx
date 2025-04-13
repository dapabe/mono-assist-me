import { trpcReact } from '@renderer/services/trpc'
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useMemo
} from 'react'
export type ILocalAuthContext = {
  isAuthenticated: boolean
  register: (name: string) => Promise<void>
}

const LocalAuthContext = createContext<ILocalAuthContext | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useLocalAuth(): ILocalAuthContext {
  const ctx = useContext(LocalAuthContext)
  if (!ctx) throw new Error('cannot use outside LocalAuthContext')
  return ctx
}

export function LocalAuthProvider(props: PropsWithChildren): ReactNode {
  const trpcRegister = trpcReact.public.register.useMutation()
  const trpcAuthenticated = trpcReact.public.isAuthenticated.useQuery()

  const register = async (name: string): Promise<void> => {
    await trpcRegister.mutateAsync({ name })
  }

  const values = useMemo<ILocalAuthContext>(
    () => ({
      isAuthenticated: !!trpcAuthenticated.data,
      register
    }),
    [register, trpcAuthenticated.isLoading]
  )
  console.log({ values })
  return (
    <LocalAuthContext.Provider value={values}>
      {props.children}
    </LocalAuthContext.Provider>
  )
}
