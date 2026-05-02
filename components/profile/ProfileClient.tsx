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
      className="w-full h-14 rounded-xl border border-red-200 text-red-600 text-base font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {isPending ? 'Keluar...' : 'Keluar dari akun'}
    </button>
  )
}
