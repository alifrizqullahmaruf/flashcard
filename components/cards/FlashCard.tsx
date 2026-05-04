'use client'

type Props = {
  soal: string
  jawaban: string
  index: number
  flipped: boolean
  onFlip: () => void
}

export default function FlashCard({ soal, jawaban, index, flipped, onFlip }: Props) {
  return (
    <div
      className="card-container w-full h-full flex items-center justify-center px-6 cursor-pointer select-none"
      onClick={onFlip}
      data-index={index}
    >
      <div
        className="card-inner relative w-full max-w-lg aspect-3/2"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.45s ease',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front — Soal */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-card-lg bg-surface border-2 border-ink-faint p-8"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            boxShadow: '0 4px 0 0 #E5E7EB, 0 8px 24px -4px rgba(0,0,0,0.06)',
          }}
        >
          <p className="text-ink-subtle text-xs font-bold uppercase tracking-widest mb-4">Soal</p>
          <p className="text-ink text-2xl text-center leading-relaxed font-semibold">{soal}</p>
          <p className="text-ink-subtle text-xs mt-6 font-medium">Tap untuk lihat jawaban</p>
        </div>

        {/* Back — Jawaban */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-card-lg p-8"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #00D4A8 0%, #00B891 100%)',
            boxShadow: '0 4px 0 0 #008F73, 0 8px 24px -4px rgba(0,143,115,0.25)',
          }}
        >
          <p className="text-white/85 text-xs font-bold uppercase tracking-widest mb-4">Jawaban</p>
          <p className="text-white text-2xl text-center leading-relaxed font-semibold">{jawaban}</p>
          <p className="text-white/70 text-xs mt-6 font-medium">Pilih seberapa kamu hafal ↓</p>
        </div>
      </div>
    </div>
  )
}
