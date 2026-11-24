import type { Metadata, Viewport } from 'next'
import { geist } from '@/lib/de/font'
import DeNav from '@/components/de/DeNav'
import { PwaRegister } from '@/components/de/Pwa'
import { AccountGate } from '@/components/de/Account'


export const metadata: Metadata = {
  title: { default: 'Klar — Bahasa Jerman sampai lulus Goethe', template: '%s · Klar' },
  description: 'Belajar bahasa Jerman A1–C2 untuk Goethe-Zertifikat: materi grammar, latihan, dan flashcard dengan suara asli.',
  applicationName: 'Klar',
  appleWebApp: { capable: true, title: 'Klar', statusBarStyle: 'default' },
}

export const viewport: Viewport = { themeColor: '#FAFAFA' }

export default function DeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`de-ui ${geist.variable} min-h-dvh`}>
      <main className="mx-auto max-w-md px-5 pt-6 pb-8">{children}</main>
      <DeNav />
      <PwaRegister />
      <AccountGate />
    </div>
  )
}
