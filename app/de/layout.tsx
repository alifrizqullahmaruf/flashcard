import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import DeNav from '@/components/de/DeNav'

const geist = Geist({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-geist', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'Klar — Bahasa Jerman sampai lulus Goethe', template: '%s · Klar' },
  description: 'Belajar bahasa Jerman A1–C2 untuk Goethe-Zertifikat: materi grammar, latihan, dan flashcard dengan suara asli.',
  applicationName: 'Klar',
}

export const viewport: Viewport = { themeColor: '#FAFAFA' }

export default function DeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`de-ui ${geist.variable} min-h-dvh`}>
      <main className="mx-auto max-w-md px-5 pt-6 pb-8">{children}</main>
      <DeNav />
    </div>
  )
}
