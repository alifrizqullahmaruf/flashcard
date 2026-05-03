'use client'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { deleteFolder } from '@/lib/actions/folder.actions'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { toast } from '@/lib/toast'
import type { FolderWithCount } from '@/lib/types'

type Props = { folder: FolderWithCount }

// Deterministic color rotation by id hash (so each folder keeps the same color)
const COLOR_VARIANTS = [
  { bg: 'bg-mint-soft', text: 'text-mint-deep', emoji: '📘' },
  { bg: 'bg-coral-soft', text: 'text-coral-deep', emoji: '📕' },
  { bg: 'bg-sun-soft', text: 'text-ink', emoji: '📒' },
  { bg: 'bg-sky-soft', text: 'text-sky-dark', emoji: '📗' },
  { bg: 'bg-purple-soft', text: '#6D28D9', emoji: '📓' },
] as const

function colorFor(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0
  return COLOR_VARIANTS[Math.abs(hash) % COLOR_VARIANTS.length]
}

export default function FolderCard({ folder }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteFolder(folder.id)
      if (result.success) toast('Folder berhasil dihapus.')
      setConfirmOpen(false)
    })
  }

  const deckCount = folder._count.decks
  const c = colorFor(folder.id)

  return (
    <>
      <div className="flex items-center px-4 py-4 border-b border-ink-faint last:border-b-0 gap-3 hover:bg-bg-soft/50 transition-colors">
        <Link href={`/folders/${folder.id}`} className="flex-1 min-w-0 flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl ${c.bg} flex items-center justify-center text-2xl shrink-0`}
            style={typeof c.text === 'string' && c.text.startsWith('#') ? { color: c.text } : undefined}
          >
            {c.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-ink font-extrabold text-base leading-snug truncate">{folder.name}</p>
            <p className="text-ink-muted text-xs mt-0.5 font-medium">
              {deckCount} {deckCount === 1 ? 'deck' : 'deck'}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1 shrink-0">
          <Link
            href={`/folders/${folder.id}/edit`}
            className="h-10 w-10 rounded-xl text-ink-muted flex items-center justify-center hover:bg-bg-soft active:scale-95 transition-all"
            aria-label="Edit folder"
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
            aria-label="Hapus folder"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={`Hapus folder "${folder.name}"?`}
        description={
          deckCount > 0
            ? `Folder ini berisi ${deckCount} deck. Semua deck dan kartu di dalamnya akan ikut terhapus.`
            : 'Folder kosong ini akan dihapus.'
        }
        confirmLabel="Hapus"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
