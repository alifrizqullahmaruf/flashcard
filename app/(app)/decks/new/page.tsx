import { redirect } from 'next/navigation'
import { getCurrentUserId } from '@/lib/auth'
import { getFolderById } from '@/lib/firestore/folders'
import PageHeader from '@/components/layout/PageHeader'
import NewDeckClient from '@/components/decks/NewDeckClient'

export default async function NewDeckPage({
  searchParams,
}: {
  searchParams: Promise<{ folderId?: string }>
}) {
  const userId = await getCurrentUserId()
  if (!userId) redirect('/login')

  const { folderId } = await searchParams
  if (!folderId) redirect('/decks')

  const folder = await getFolderById(folderId, userId)
  if (!folder) redirect('/decks')

  return (
    <>
      <PageHeader title="Buat Deck Baru" backHref={`/folders/${folder.id}`} />
      <div className="flex-1 px-4 py-5 overflow-y-auto">
        <p className="text-ink-muted text-sm mb-4">
          Folder: <span className="text-ink font-medium">{folder.name}</span>
        </p>
        <NewDeckClient folderId={folder.id} />
      </div>
    </>
  )
}
