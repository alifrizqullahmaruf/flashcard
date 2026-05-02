'use client'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { deleteDeck } from '@/lib/actions/deck.actions'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { toast } from '@/lib/toast'
import type { DeckWithCount } from '@/lib/types'

type Props = { deck: DeckWithCount }

export default function DeckCard({ deck }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteDeck(deck.id)
      if (result.success) toast('Deck berhasil dihapus.')
      setConfirmOpen(false)
    })
  }

  return (
    <>
      <div className="flex items-center px-4 py-4 border-b border-cream-dark last:border-b-0 gap-3 min-h-18">
        {/* Info */}
        <Link href={`/decks/${deck.id}`} className="flex-1 min-w-0 block">
          <p className="text-ink font-medium text-base leading-snug truncate">{deck.title}</p>
          <p className="text-ink-muted text-sm mt-0.5">{deck._count.cards} kartu</p>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href={`/decks/${deck.id}/study`}
            className="h-9 px-3 rounded-xl bg-ink text-surface text-sm font-medium flex items-center hover:opacity-80 transition-opacity"
          >
            Belajar
          </Link>
          <Link
            href={`/decks/${deck.id}/edit`}
            className="h-9 w-9 rounded-xl border border-cream-dark text-ink-muted flex items-center justify-center hover:bg-cream-dark transition-colors"
            aria-label="Edit"
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={isPending}
            className="h-9 w-9 rounded-xl border border-cream-dark text-ink-muted flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-40"
            aria-label="Hapus"
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
