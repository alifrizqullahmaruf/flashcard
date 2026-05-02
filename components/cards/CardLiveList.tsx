'use client'
import type { CardInput } from '@/lib/utils/import'

type Props = {
  cards: CardInput[]
  onDelete: (index: number) => void
}

export default function CardLiveList({ cards, onDelete }: Props) {
  if (cards.length === 0) return null

  return (
    <div className="flex flex-col divide-y divide-cream-dark border border-cream-dark rounded-xl overflow-hidden">
      {cards.map((card, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 bg-surface">
          <span className="text-ink-subtle text-xs w-5 shrink-0 text-right">{i + 1}</span>
          <div className="flex-1 min-w-0 grid grid-cols-2 gap-3">
            <p className="text-sm text-ink truncate">{card.soal}</p>
            <p className="text-sm text-ink-muted truncate">{card.jawaban}</p>
          </div>
          <button
            type="button"
            onClick={() => onDelete(i)}
            className="text-ink-subtle hover:text-ink text-lg leading-none shrink-0 w-8 h-8 flex items-center justify-center rounded hover:bg-cream transition-colors"
            aria-label="Hapus kartu"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
