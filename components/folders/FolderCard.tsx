'use client'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { deleteFolder } from '@/lib/actions/folder.actions'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { toast } from '@/lib/toast'
import type { FolderWithCount } from '@/lib/types'

type Props = { folder: FolderWithCount }

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

  return (
    <>
      <div className="flex items-center px-4 py-4 border-b border-cream-dark last:border-b-0 gap-3 min-h-18">
        <Link href={`/folders/${folder.id}`} className="flex-1 min-w-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cream-dark flex items-center justify-center shrink-0">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-ink font-medium text-base leading-snug truncate">{folder.name}</p>
            <p className="text-ink-muted text-sm mt-0.5">{deckCount} deck</p>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href={`/folders/${folder.id}/edit`}
            className="h-9 w-9 rounded-xl border border-cream-dark text-ink-muted flex items-center justify-center hover:bg-cream-dark transition-colors"
            aria-label="Edit folder"
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
            aria-label="Hapus folder"
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
