import { Geist } from 'next/font/google'
import DeNav from '@/components/de/DeNav'

const geist = Geist({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-geist', display: 'swap' })

export const metadata = { title: 'Hafalin Deutsch — MVP' }

export default function DeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`de-ui ${geist.variable} min-h-dvh`}>
      <main className="mx-auto max-w-md px-5 pt-6 pb-8">{children}</main>
      <DeNav />
    </div>
  )
}
