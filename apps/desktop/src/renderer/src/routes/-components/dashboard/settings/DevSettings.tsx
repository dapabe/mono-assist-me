import { trpcReact } from '@renderer/services/trpc'
import { useNavigate } from '@tanstack/react-router'
import { ReactNode } from 'react'

export function DevSettings(): ReactNode {
  const nav = useNavigate()
  const deleteAccount = trpcReact.UTILS.LocalLogout.useMutation()

  const handleDelete = async (): Promise<void> => {
    await deleteAccount.mutateAsync()
    await nav({ reloadDocument: true })
  }

  return (
    <div>
      <button className="btn btn-warning" onClick={handleDelete}>
        Delete Account
      </button>
    </div>
  )
}
