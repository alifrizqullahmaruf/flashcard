import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import Toaster from '@/components/ui/Toaster'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh paper-bg">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 pb-28 md:pb-6">
        {children}
      </main>
      <BottomNav />
      <Toaster />
    </div>
  )
}
