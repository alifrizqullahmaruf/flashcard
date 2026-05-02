'use client'
import { useState } from 'react'

type Props = {
  soal: string
  jawaban: string
  index: number
}

export default function FlashCard({ soal, jawaban, index }: Props) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="card-container w-full h-full flex items-center justify-center px-6 cursor-pointer select-none"
      onClick={() => setFlipped((f) => !f)}
      data-index={index}
    >
      <div className={`card-inner relative w-full max-w-lg aspect-[3/2]`}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.45s ease',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front — Soal */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-surface border border-cream-dark p-8"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            boxShadow: '0 1px 2px rgba(26,26,26,0.04), 0 4px 12px rgba(26,26,26,0.06)',
          }}
        >
          <p className="text-ink-subtle text-xs font-medium uppercase tracking-widest mb-4">Soal</p>
          <p className="text-ink text-xl text-center leading-relaxed">{soal}</p>
          <p className="text-ink-subtle text-xs mt-6">Tap untuk lihat jawaban</p>
        </div>

        {/* Back — Jawaban */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-ink p-8"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: '0 1px 2px rgba(26,26,26,0.04), 0 4px 12px rgba(26,26,26,0.06)',
          }}
        >
          <p className="text-surface/50 text-xs font-medium uppercase tracking-widest mb-4">Jawaban</p>
          <p className="text-surface text-xl text-center leading-relaxed">{jawaban}</p>
          <p className="text-surface/30 text-xs mt-6">Tap untuk balik</p>
        </div>
      </div>
    </div>
  )
}
