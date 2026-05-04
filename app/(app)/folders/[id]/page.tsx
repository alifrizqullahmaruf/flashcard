import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUserId } from '@/lib/auth'
import { getFolderById, getDecksInFolder } from '@/lib/firestore/folders'
import { resolveIconVisual } from '@/lib/folders/icons'
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
        {/* Folder icon hero */}
        <div className="flex items-center gap-4 mb-4">
          {(() => {
            const v = resolveIconVisual(folder.id, folder.icon)
            return (
              <div
                className={`w-16 h-16 rounded-card-lg ${v.bg} flex items-center justify-center text-4xl shrink-0`}
                style={v.text.startsWith('#') ? { color: v.text } : undefined}
              >
                {v.emoji}
              </div>
            )
          })()}
          <div className="flex-1 min-w-0">
            <p className="text-ink-muted text-xs font-bold uppercase tracking-wide">Folder</p>
            <p className="text-ink font-display text-xl tracking-tight truncate">{folder.name}</p>
          </div>
        </div>

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
              <DeckCard key={deck.id} deck={deck} folderIcon={folder.icon} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
