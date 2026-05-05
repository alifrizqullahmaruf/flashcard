import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import Toaster from '@/components/ui/Toaster'
import { LocaleProvider } from '@/components/i18n/LocaleProvider'
import { getCurrentUserId } from '@/lib/auth'
import { getUserData } from '@/lib/firestore/user'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userId = await getCurrentUserId()
  if (!userId) redirect('/login')

  const userData = await getUserData(userId)

  return (
    <LocaleProvider locale={userData.language}>
      <div className="flex min-h-dvh">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 pb-28 md:pb-6">
          {children}
        </main>
        <BottomNav />
        <Toaster />
      </div>
    </LocaleProvider>
  )
}
