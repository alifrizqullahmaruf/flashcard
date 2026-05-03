'use client'
import { useTransition } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { logout } from '@/lib/actions/auth.actions'

export default function ProfileLogoutButton() {
  const [isPending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => {
      await signOut(auth)
      await logout()
    })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="btn-3d btn-3d-coral w-full h-14 text-base"
    >
      {isPending ? 'Keluar...' : 'Keluar dari Akun'}
    </button>
  )
}
