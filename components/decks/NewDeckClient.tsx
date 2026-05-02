'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createDeck } from '@/lib/actions/deck.actions'
import { toast } from '@/lib/toast'
import CardEditorRow from '@/components/cards/CardEditorRow'
import CardLiveList from '@/components/cards/CardLiveList'
import ImportModal from '@/components/cards/ImportModal'
import type { CardInput } from '@/lib/utils/import'

type Props = { folderId: string }

export default function NewDeckClient({ folderId }: Props) {
  const router = useRouter()
  const [cards, setCards] = useState<CardInput[]>([])
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
    </>
  )
}
