import Link from 'next/link'
import { ChevronRight, Lock } from 'lucide-react'

// Language codes instead of flags: a flag is a country, not a language.
const LANGS = [
  { code: 'DE', name: 'Bahasa Jerman', native: 'Deutsch', target: 'Goethe-Zertifikat A1–C2', href: '/de', ready: true },
  { code: 'EN', name: 'Bahasa Inggris', native: 'English', target: 'IELTS / TOEFL', ready: false },
  { code: 'JA', name: 'Bahasa Jepang', native: '日本語', target: 'JLPT N5–N1', ready: false },
]

export default function MulaiPage() {
  return (
    <div className="min-h-dvh">
      <main className="mx-auto max-w-md px-5 py-12 flex flex-col gap-8">
        <div>
          <p className="de-label">Hafalin</p>
          <h1 className="text-[2rem] font-semibold tracking-tight leading-tight mt-1">Mau belajar bahasa apa?</h1>
          <p className="text-ink-muted mt-2">Pilih satu dulu. Kamu bisa ganti kapan saja.</p>
        </div>
        <div className="bg-surface border border-ink-faint rounded-card-lg divide-y divide-ink-faint overflow-hidden">
          {LANGS.map((l) => {
            const inner = (
              <>
                <span
                  className={`w-11 h-11 rounded-card flex items-center justify-center text-sm font-semibold tracking-wide shrink-0 ${
                    l.ready ? 'bg-ink text-white' : 'border border-ink-faint text-ink-subtle'
                  }`}
                >
                  {l.code}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium leading-tight">{l.name}</p>
                  <p className="text-[13px] text-ink-subtle mt-0.5">{l.native} · {l.target}</p>
                </div>
                {l.ready ? (
                  <ChevronRight className="text-ink-subtle" size={18} />
                ) : (
                  <span className="de-label flex items-center gap-1">
                    <Lock size={11} />
                    Segera
                  </span>
                )}
              </>
            )
            const cls = 'px-4 py-4 flex items-center gap-4'
            return l.ready ? (
              <Link key={l.code} href={l.href!} className={`${cls} active:bg-bg-soft transition-colors`}>
                {inner}
              </Link>
            ) : (
              <div key={l.code} className={cls}>{inner}</div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
