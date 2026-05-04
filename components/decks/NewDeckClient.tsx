'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createDeck } from '@/lib/actions/deck.actions'
import { toast } from '@/lib/toast'
import CardEditorRow from '@/components/cards/CardEditorRow'
import CardLiveList from '@/components/cards/CardLiveList'
import ImportModal from '@/components/cards/ImportModal'
import IconPicker from '@/components/folders/IconPicker'
import { resolveIconVisual } from '@/lib/folders/icons'
import type { CardInput } from '@/lib/utils/import'

type Props = {
  folderId: string
  folderIcon?: string | null  // for inherit-default visualization
}

export default function NewDeckClient({ folderId, folderIcon }: Props) {
  const router = useRouter()
  const [cards, setCards] = useState<CardInput[]>([])
  const [error, setError] = useState<string | null>(null)
  const [importOpen, setImportOpen] = useState(false)
  const [icon, setIcon] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const addCard = (card: CardInput) => setCards((prev) => [...prev, card])
  const deleteCard = (i: number) => setCards((prev) => prev.filter((_, idx) => idx !== i))
  const importCards = (imported: CardInput[]) => setCards((prev) => [...prev, ...imported])

  // Preview: deck icon if set, else folder icon, else fallback
  const effectiveIcon = icon ?? folderIcon ?? null
  const previewVisual = resolveIconVisual(folderId, effectiveIcon)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    if (icon) formData.set('icon', icon)
    else formData.delete('icon')
    startTransition(async () => {
      const result = await createDeck(formData, cards, folderId)
      if (!result.success) {
        setError(result.error)
      } else {
        toast('Deck berhasil dibuat!')
        router.push(`/decks/${result.data.id}`)
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-6">

        {/* Icon picker */}
        <div className="flex flex-col gap-2">
          <label className="text-ink text-sm font-medium">Icon</label>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-3 p-3 rounded-xl border-2 border-ink-faint bg-surface hover:border-mint transition-all active:scale-[0.98]"
          >
            <div className={`w-12 h-12 rounded-2xl ${previewVisual.bg} flex items-center justify-center text-2xl shrink-0`}>
              {previewVisual.emoji}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-ink font-bold text-sm">
                {icon ? 'Custom icon' : folderIcon ? 'Ikuti folder' : 'Default (auto)'}
              </p>
              <p className="text-ink-muted text-xs">Klik untuk ganti</p>
            </div>
            <span className="text-ink-subtle text-base shrink-0">→</span>
          </button>
        </div>

        {/* Judul */}
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-ink text-sm font-medium">Judul Deck</label>
          <input
            id="title" name="title" required autoFocus maxLength={255}
            placeholder="Contoh: Biologi Kelas 12"
            className="h-14 rounded-xl border border-cream-dark bg-surface px-4 text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
        </div>

        {/* Deskripsi */}
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-ink text-sm font-medium">
            Deskripsi <span className="text-ink-muted font-normal">(opsional)</span>
          </label>
          <textarea
            id="description" name="description" rows={2} maxLength={1000}
            placeholder="Topik, bab, atau catatan singkat..."
            className="rounded-xl border border-cream-dark bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-ink/20 resize-none"
          />
        </div>

        {/* Kartu */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-ink text-sm font-medium">
              Kartu {cards.length > 0 && <span className="text-ink-muted font-normal">({cards.length})</span>}
            </p>
            <button type="button" onClick={() => setImportOpen(true)}
              className="text-sm text-ink-muted underline underline-offset-2 hover:text-ink">
              Import
            </button>
          </div>
          <CardLiveList cards={cards} onDelete={deleteCard} />
          <CardEditorRow onAdd={addCard} />
          <p className="text-ink-subtle text-xs">Tab pindah field · Enter tambah kartu</p>
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        {/* Actions */}
        <button
          type="submit" disabled={isPending}
          className="w-full h-14 rounded-xl bg-ink text-surface text-base font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {isPending ? 'Menyimpan...' : 'Simpan Deck'}
        </button>
      </form>

      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onImport={importCards} />

      <IconPicker
        open={pickerOpen}
        selected={icon}
        onSelect={(v) => setIcon(v)}
        onClose={() => setPickerOpen(false)}
      />
    </>
  )
}
