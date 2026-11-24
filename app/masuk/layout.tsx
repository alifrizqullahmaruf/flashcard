import type { Metadata, Viewport } from 'next'
import { geist } from '@/lib/de/font'
import { PwaRegister } from '@/components/de/Pwa'


export const metadata: Metadata = {
  title: 'Masuk · Klar',
  description: 'Masuk ke Klar untuk menyimpan dan menyinkronkan progres belajar bahasa Jerman.',
  applicationName: 'Klar',
  appleWebApp: { capable: true, title: 'Klar', statusBarStyle: 'default' },
}

export const viewport: Viewport = { themeColor: '#FAFAFA' }

export default function MasukLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`de-ui ${geist.variable} min-h-dvh`}>
      {children}
      <PwaRegister />
    </div>
  )
}
