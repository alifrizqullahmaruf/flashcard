import Link from 'next/link'
import { ArrowLeft, Mic, AudioLines } from 'lucide-react'
import MANIFEST from '@/lib/de/audio-manifest.json'

type Native = { word: string; author: string; license: string; page?: string; file: string }

export const metadata = { title: 'Kredit audio · Hafalin Deutsch' }

export default function KreditPage() {
  const natives = Object.values(MANIFEST as Record<string, { native?: Native }>)
    .map((e) => e.native)
    .filter((n): n is Native => !!n)
    .sort((a, b) => a.word.localeCompare(b.word, 'de'))

  return (
    <div className="flex flex-col gap-4">
      <Link href="/de/progress" className="text-sm font-extrabold text-ink-muted flex items-center gap-1 w-fit">
        <ArrowLeft size={16} strokeWidth={2.6} />Progress
      </Link>
      <h1 className="font-display font-extrabold text-3xl">Kredit audio</h1>

      <section className="paper-card border-2 border-ink-faint rounded-card-lg p-4 flex flex-col gap-2">
        <p className="font-extrabold flex items-center gap-2"><Mic size={18} strokeWidth={2.4} />Rekaman penutur asli</p>
        <p className="text-sm text-ink-muted">
          Pengucapan kata tunggal memakai rekaman orang Jerman asli dari Wiktionary / Wikimedia Commons. Terima kasih kepada para perekam berikut:
        </p>
        <ul className="text-sm flex flex-col gap-1.5 mt-1">
          {natives.map((n) => (
            <li key={n.file} className="flex flex-wrap gap-x-1.5">
              <b>{n.word}</b>
              <span className="text-ink-muted">·</span>
              {n.page ? (
                <a href={n.page} target="_blank" rel="noreferrer" className="underline text-sky-dark">{n.author}</a>
              ) : (
                <span>{n.author}</span>
              )}
              <span className="text-ink-subtle">({n.license})</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="paper-card border-2 border-ink-faint rounded-card-lg p-4 flex flex-col gap-2">
        <p className="font-extrabold flex items-center gap-2"><AudioLines size={18} strokeWidth={2.4} />Suara kalimat</p>
        <p className="text-sm text-ink-muted">
          Kalimat contoh memakai suara <b>Thorsten</b>: suara pria Jerman asli dari dataset terbuka Thorsten-Voice (CC0), dibuat dengan mesin open-source Piper TTS.
        </p>
      </section>
    </div>
  )
}
