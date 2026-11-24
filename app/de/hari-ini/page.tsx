import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import DailySession from '@/components/de/DailySession'

export const metadata = { title: 'Hari ini · Hafalin Deutsch' }

export default function HariIniPage() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/de" className="text-sm font-extrabold text-ink-muted flex items-center gap-1 w-fit">
        <ArrowLeft size={16} strokeWidth={2.6} />Beranda
      </Link>
      <h1 className="font-display font-extrabold text-2xl leading-tight">Hari ini</h1>
      <DailySession />
    </div>
  )
}
