import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ContextPractice from '@/components/de/ContextPractice'

export const metadata = { title: 'Latihan konteks' }

export default function KonteksPage() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/de" className="text-sm font-medium text-ink-muted flex items-center gap-1 w-fit">
        <ArrowLeft size={16} />Beranda
      </Link>
      <header>
        <p className="de-label">Im Kontext</p>
        <h1 className="text-[2rem] font-semibold tracking-tight leading-tight">Latihan konteks</h1>
        <p className="text-ink-muted mt-1">Pakai kata yang sudah kamu pelajari di dalam kalimat.</p>
      </header>
      <ContextPractice />
    </div>
  )
}
