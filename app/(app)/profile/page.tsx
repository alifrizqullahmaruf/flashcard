import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import PageHeader from '@/components/layout/PageHeader'
import ProfileLogoutButton from '@/components/profile/ProfileClient'

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return (
    <>
      <PageHeader title="Profil" />
      <div className="flex-1 px-4 py-5 overflow-y-auto">
        <div className="flex flex-col gap-6">
          {/* Avatar + Email */}
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-20 h-20 rounded-full bg-cream-dark flex items-center justify-center">
              <span className="font-display text-3xl text-ink">
                {user.email?.[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
            <div className="text-center">
              <p className="text-ink font-medium text-base break-all">{user.email ?? 'Tanpa email'}</p>
              <p className="text-ink-subtle text-xs mt-1">User ID: {user.uid.slice(0, 8)}...</p>
            </div>
          </div>

          {/* Info section */}
          <div className="border border-cream-dark rounded-2xl overflow-hidden bg-surface">
            <div className="px-4 py-4 border-b border-cream-dark">
              <p className="text-ink-muted text-xs mb-1">Email</p>
              <p className="text-ink text-sm break-all">{user.email ?? '-'}</p>
            </div>
            <div className="px-4 py-4">
              <p className="text-ink-muted text-xs mb-1">Status</p>
              <p className="text-ink text-sm">Aktif</p>
            </div>
          </div>

          {/* Logout */}
          <ProfileLogoutButton />
        </div>
      </div>
    </>
  )
}
