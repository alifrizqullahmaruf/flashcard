'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateDeck } from '@/lib/actions/deck.actions'
import { toast } from '@/lib/toast'
import CardEditorRow from '@/components/cards/CardEditorRow'
import CardLiveList from '@/components/cards/CardLiveList'
import ImportModal from '@/components/cards/ImportModal'
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
  const [isPending, startTransition] = useTransition()

  const addCard = (card: CardInput) => setCards((prev) => [...prev, card])
  const deleteCard = (i: number) => setCards((prev) => prev.filter((_, idx) => idx !== i))
  const importCards = (imported: CardInput[]) => setCards((prev) => [...prev, ...imported])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
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
    </>
  )
}
