import { Geist } from 'next/font/google'

const geist = Geist({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-geist', display: 'swap' })

export default function MulaiLayout({ children }: { children: React.ReactNode }) {
  return <div className={`de-ui ${geist.variable} min-h-dvh`}>{children}</div>
}
