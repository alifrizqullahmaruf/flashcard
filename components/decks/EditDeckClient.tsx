'use client'
import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateDeck } from '@/lib/actions/deck.actions'
import { toast } from '@/lib/toast'
import CardEditorRow from '@/components/cards/CardEditorRow'
import CardLiveList from '@/components/cards/CardLiveList'
import ImportModal from '@/components/cards/ImportModal'
import IconPicker from '@/components/folders/IconPicker'
import { resolveIconVisual } from '@/lib/folders/icons'
import type { CardInput } from '@/lib/utils/import'
import type { DeckWithCards, FolderData } from '@/lib/types'

type Props = { deck: DeckWithCards; folders: FolderData[] }

export default function EditDeckClient({ deck, folders }: Props) {
  const router = useRouter()
  const [folderId, setFolderId] = useState<string>(deck.folderId)
  const [cards, setCards] = useState<CardInput[]>(
    deck.cards.map((c) => ({ id: c.id, soal: c.soal, jawaban: c.jawaban }))
  )
  const [error, setError] = useState<string | null>(null)
  const [importOpen, setImportOpen] = useState(false)
  const [icon, setIcon] = useState<string | null>(deck.icon)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Lookup folder icon for inherit-default preview
  const folderIcon = useMemo(() => {
    return folders.find((f) => f.id === folderId)?.icon ?? null
  }, [folders, folderId])

  const effectiveIcon = icon ?? folderIcon
  const previewVisual = resolveIconVisual(deck.id, effectiveIcon)

  const addCard = (card: CardInput) => setCards((prev) => [...prev, card])
  const deleteCard = (i: number) => setCards((prev) => prev.filter((_, idx) => idx !== i))
  const importCards = (imported: CardInput[]) => setCards((prev) => [...prev, ...imported])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    if (icon) formData.set('icon', icon)
    else formData.delete('icon')
    startTransition(async () => {
      const result = await updateDeck(deck.id, formData, cards, folderId)
      if (!result.success) {
        setError(result.error)
      } else {
        toast('Perubahan berhasil disimpan!')
        router.push(`/decks/${deck.id}`)
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

        {/* Folder */}
        <div className="flex flex-col gap-2">
          <label htmlFor="folder" className="text-ink text-sm font-medium">Folder</label>
          <select
            id="folder"
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
            className="h-14 rounded-xl border border-cream-dark bg-surface px-4 text-base text-ink focus:outline-none focus:ring-2 focus:ring-ink/20"
          >
            {folders.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        {/* Judul */}
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-ink text-sm font-medium">Judul Deck</label>
          <input
            id="title" name="title" required maxLength={255}
            defaultValue={deck.title}
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
            defaultValue={deck.description ?? ''}
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

        <button
          type="submit" disabled={isPending}
          className="w-full h-14 rounded-xl bg-ink text-surface text-base font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
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
