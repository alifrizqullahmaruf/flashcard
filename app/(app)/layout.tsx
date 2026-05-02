import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import Toaster from '@/components/ui/Toaster'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-cream">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 pb-14 md:pb-0">
        {children}
      </main>
      <BottomNav />
      <Toaster />
    </div>
  )
}
