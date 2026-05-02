import { notFound } from 'next/navigation'
import { getCurrentUserId } from '@/lib/auth'
import { getDeckWithCards } from '@/lib/firestore/decks'
import { getFolders } from '@/lib/firestore/folders'
import PageHeader from '@/components/layout/PageHeader'
import EditDeckClient from '@/components/decks/EditDeckClient'

export default async function EditDeckPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const userId = await getCurrentUserId()
  if (!userId) notFound()

  const [deck, folders] = await Promise.all([
    getDeckWithCards(id, userId),
    getFolders(userId),
  ])

  if (!deck) notFound()

  return (
    <>
      <PageHeader title="Edit Deck" backHref={`/decks/${deck.id}`} />
      <div className="flex-1 px-4 py-5 overflow-y-auto">
        <EditDeckClient deck={deck} folders={folders} />
      </div>
    </>
  )
}
