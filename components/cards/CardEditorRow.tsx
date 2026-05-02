'use client'
import { useRef, useState } from 'react'
import type { CardInput } from '@/lib/utils/import'

type Props = {
  onAdd: (card: CardInput) => void
}

export default function CardEditorRow({ onAdd }: Props) {
  const [soal, setSoal] = useState('')
  const [jawaban, setJawaban] = useState('')
  const soalRef = useRef<HTMLInputElement>(null)
  const jawabanRef = useRef<HTMLInputElement>(null)

  function submit() {
    const s = soal.trim()
    const j = jawaban.trim()
    if (!s || !j) return
    onAdd({ soal: s, jawaban: j })
    setSoal('')
    setJawaban('')
    soalRef.current?.focus()
  }

  return (
    <div className="flex gap-2 items-center">
      <input
        ref={soalRef}
        value={soal}
        onChange={(e) => setSoal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Tab') { e.preventDefault(); jawabanRef.current?.focus() }
        }}
        placeholder="Soal"
        className="flex-1 h-11 rounded-lg border border-cream-dark bg-surface px-3 text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-ink/20"
      />
      <input
        ref={jawabanRef}
        value={jawaban}
        onChange={(e) => setJawaban(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); submit() }
        }}
        placeholder="Jawaban"
        className="flex-1 h-11 rounded-lg border border-cream-dark bg-surface px-3 text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-ink/20"
      />
      <button
        type="button"
        onClick={submit}
        className="h-11 w-11 rounded-lg bg-ink text-surface text-xl font-light flex items-center justify-center hover:opacity-80 transition-opacity shrink-0"
      >
        +
      </button>
    </div>
  )
}
