'use client'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { deleteDeck } from '@/lib/actions/deck.actions'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { toast } from '@/lib/toast'
import { resolveIconVisual } from '@/lib/folders/icons'
import type { DeckWithCount } from '@/lib/types'

type Props = {
  deck: DeckWithCount
  /**
   * Folder's icon, used as default when deck.icon is null (inherit pattern).
   * Pass undefined or null when folder context not available — falls back to
   * stack-of-cards visual.
   */
  folderIcon?: string | null
}

export default function DeckCard({ deck, folderIcon }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteDeck(deck.id)
      if (result.success) toast('Deck berhasil dihapus.')
      setConfirmOpen(false)
    })
  }

  const cardCount = deck._count.cards
  // Effective icon: deck override → folder inherit → stack-of-cards fallback
  const effectiveIcon = deck.icon ?? folderIcon ?? null
  const showEmoji = !!effectiveIcon
  const visual = showEmoji ? resolveIconVisual(deck.id, effectiveIcon) : null

  return (
    <>
      <div className="flex items-center px-4 py-4 border-b border-ink-faint last:border-b-0 gap-3 hover:bg-bg-soft/50 transition-colors">
        <Link href={`/decks/${deck.id}`} className="flex-1 min-w-0 flex items-center gap-3">
          {/* Icon: emoji if set/inherited, else stack-of-cards default */}
          {showEmoji && visual ? (
            <div
              className={`w-12 h-12 rounded-2xl ${visual.bg} flex items-center justify-center text-2xl shrink-0`}
              style={visual.text.startsWith('#') ? { color: visual.text } : undefined}
            >
              {visual.emoji}
            </div>
          ) : (
            <div className="relative w-12 h-12 shrink-0">
              <div className="absolute inset-0 rounded-xl bg-mint-soft border border-mint/40 transform -rotate-3" />
              <div className="absolute inset-0 rounded-xl bg-mint-soft border border-mint/60 transform rotate-2" />
              <div className="absolute inset-0 rounded-xl bg-mint flex items-center justify-center text-white">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2.2" />
                  <path d="M3 9h18" stroke="currentColor" strokeWidth="2.2" />
                </svg>
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-ink font-extrabold text-base leading-snug truncate">{deck.title}</p>
            <p className="text-ink-muted text-xs mt-0.5 font-medium">
              {cardCount} {cardCount === 1 ? 'kartu' : 'kartu'}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href={`/decks/${deck.id}/study`}
            className="btn-3d btn-3d-mint h-10 px-4 text-xs"
          >
            Belajar
          </Link>
          <Link
            href={`/decks/${deck.id}/edit`}
            className="h-10 w-10 rounded-xl text-ink-muted flex items-center justify-center hover:bg-bg-soft active:scale-95 transition-all"
            aria-label="Edit"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={isPending}
            className="h-10 w-10 rounded-xl text-ink-muted flex items-center justify-center hover:bg-coral-soft hover:text-coral-deep active:scale-95 transition-all disabled:opacity-40"
            aria-label="Hapus"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={`Hapus "${deck.title}"?`}
        description="Semua kartu dalam deck ini akan ikut terhapus."
        confirmLabel="Hapus"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
