import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUserId } from '@/lib/auth'
import { getDeckWithCards } from '@/lib/firestore/decks'
import PageHeader from '@/components/layout/PageHeader'

export default async function DeckDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const userId = await getCurrentUserId()
  if (!userId) notFound()

  const deck = await getDeckWithCards(id, userId)
  if (!deck) notFound()

  return (
    <>
      <PageHeader
        title={deck.title}
        backHref={`/folders/${deck.folderId}`}
        action={
          <div className="flex gap-2">
            {deck.cards.length > 0 && (
              <Link
                href={`/decks/${deck.id}/study`}
                className="h-9 px-4 rounded-full bg-ink text-surface text-sm font-medium flex items-center hover:opacity-80 transition-opacity"
              >
                Belajar
              </Link>
            )}
            <Link
              href={`/decks/${deck.id}/edit`}
              className="h-9 px-4 rounded-full border border-cream-dark text-ink text-sm font-medium flex items-center hover:bg-cream-dark transition-colors"
            >
              Edit
            </Link>
          </div>
        }
      />

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {deck.description && (
          <p className="text-ink-muted text-sm mb-4">{deck.description}</p>
        )}
        <p className="text-ink-subtle text-xs mb-3">{deck.cards.length} kartu</p>

        {deck.cards.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-center border border-cream-dark rounded-2xl bg-surface">
            <p className="text-ink-muted text-sm">Deck ini belum punya kartu.</p>
            <Link href={`/decks/${deck.id}/edit`} className="text-ink text-sm underline underline-offset-4">
              Tambah kartu
            </Link>
          </div>
        ) : (
          <div className="border border-cream-dark rounded-2xl overflow-hidden bg-surface">
            {deck.cards.map((card, i) => (
              <div key={card.id} className="px-4 py-4 border-b border-cream-dark last:border-b-0">
                <p className="text-ink-subtle text-xs mb-1">#{i + 1}</p>
                <p className="text-ink text-sm font-medium mb-1">{card.soal}</p>
                <p className="text-ink-muted text-sm">{card.jawaban}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
