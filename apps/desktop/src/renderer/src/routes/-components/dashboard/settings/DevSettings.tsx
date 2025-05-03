import { trpcReact } from '@renderer/services/trpc'

import { ReactNode } from 'react'

export function DevSettings(): ReactNode {
  const deleteAccount = trpcReact.UTILS.LocalLogout.useMutation()

  const handleDelete = async (): Promise<void> => {
    await deleteAccount.mutateAsync()
    window.location.reload()
  }

  return (
    <fieldset className="fieldset p-4 rounded-box border border-error mt-auto">
      <legend className="fieldset-legend">DEV Actions</legend>
      <button className="btn btn-error" onClick={handleDelete}>
        Delete Local Account
      </button>
    </fieldset>
  )
}
