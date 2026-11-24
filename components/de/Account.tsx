'use client'
import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CircleUserRound } from 'lucide-react'
import { hasFirebaseConfig } from '@/lib/firebase/client'
import { getProfile } from '@/lib/de/progress'
import { useProgress } from '@/lib/de/useProgress'
import { startSync, useSyncStatus } from '@/lib/de/sync'

/** Starts progress sync + sends new learners to onboarding. Mounted once in the Klar layout. */
export function AccountGate() {
  const status = useSyncStatus()
  // null = not read yet (server render / hydration); { p: null } = no profile saved
  const loaded = useProgress(() => ({ p: getProfile() }))
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => startSync(), [])

  // Wait until the first sync settled (so a returning learner on a new device keeps their profile)
  const settled = !hasFirebaseConfig() || status.state === 'ok' || status.state === 'offline' || status.state === 'error' || (status.state === 'off' && status.ready)
  const exempt = /^\/de\/(mulai-belajar|offline|akun)(\/|$)/.test(pathname)
  const needsOnboarding = settled && loaded !== null && loaded.p === null && !exempt && pathname.startsWith('/de')

  useEffect(() => {
    if (needsOnboarding) router.replace(`/de/mulai-belajar?next=${encodeURIComponent(pathname)}`)
  }, [needsOnboarding, pathname, router])

  return null
}

/** Small avatar (Google photo) linking to the account page. */
export function AccountChip() {
  const { user } = useSyncStatus()
  return (
    <Link href="/de/akun" aria-label="Akun" className="w-8 h-8 rounded-pill overflow-hidden border border-ink-faint flex items-center justify-center bg-surface shrink-0">
      {user?.photo ? (
        <Image src={user.photo} alt="" width={32} height={32} unoptimized className="w-full h-full object-cover" />
      ) : (
        <CircleUserRound size={18} className="text-ink-muted" />
      )}
    </Link>
  )
}
