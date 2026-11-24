import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { PwaRegister } from '@/components/de/Pwa'

const geist = Geist({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-geist', display: 'swap' })

export const metadata: Metadata = {
  title: 'Klar — Pilih bahasa',
  description: 'Belajar bahasa asing sampai lulus ujian: Jerman (Goethe), Inggris, Jepang.',
  applicationName: 'Klar',
  appleWebApp: { capable: true, title: 'Klar', statusBarStyle: 'default' },
}

export const viewport: Viewport = { themeColor: '#FAFAFA' }

export default function MulaiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`de-ui ${geist.variable} min-h-dvh`}>
      {children}
      <PwaRegister />
    </div>
  )
}
