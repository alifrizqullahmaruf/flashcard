import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUserId } from '@/lib/auth'
import { getFolderById, getDecksInFolder } from '@/lib/firestore/folders'
import DeckCard from '@/components/decks/DeckCard'
import PageHeader from '@/components/layout/PageHeader'

export default async function FolderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const userId = await getCurrentUserId()
  if (!userId) notFound()

  const folder = await getFolderById(id, userId)
  if (!folder) notFound()

  const decks = await getDecksInFolder(id, userId)

  return (
    <>
      <PageHeader
        title={folder.name}
        backHref="/decks"
        action={
          <Link
            href={`/decks/new?folderId=${folder.id}`}
            className="h-9 px-4 rounded-full bg-ink text-surface text-sm font-medium flex items-center hover:opacity-80 transition-opacity"
          >
            + Deck
          </Link>
        }
      />

      <div className="flex-1 px-4 py-4">
        {folder.description && (
          <p className="text-ink-muted text-sm mb-4">{folder.description}</p>
        )}

        {decks.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            <p className="font-display text-2xl text-ink">Belum ada deck</p>
            <p className="text-ink-muted text-sm">Buat deck pertama di folder ini.</p>
            <Link href={`/decks/new?folderId=${folder.id}`} className="mt-2 text-ink text-sm underline underline-offset-4">
              Buat sekarang
            </Link>
          </div>
        ) : (
          <div className="border border-cream-dark rounded-2xl overflow-hidden bg-surface">
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
