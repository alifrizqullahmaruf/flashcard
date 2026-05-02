import { redirect } from 'next/navigation'
import { getCurrentUserId } from '@/lib/auth'
import { adminDb } from '@/lib/firebase/admin'
import PageHeader from '@/components/layout/PageHeader'
import SearchClient from '@/components/search/SearchClient'
import type { Timestamp } from 'firebase-admin/firestore'

interface DeckDoc {
  title: string
  description: string | null
  folderId: string
  cardCount: number
  createdAt: Timestamp
}

interface FolderDoc {
  name: string
}

export default async function SearchPage() {
  const userId = await getCurrentUserId()
  if (!userId) redirect('/login')

  const userRef = adminDb.collection('users').doc(userId)
  const [decksSnap, foldersSnap] = await Promise.all([
    userRef.collection('decks').orderBy('createdAt', 'desc').get(),
    userRef.collection('folders').get(),
  ])

  const folderNameMap = new Map<string, string>()
  foldersSnap.docs.forEach((doc) => {
    folderNameMap.set(doc.id, (doc.data() as FolderDoc).name)
  })

  const items = decksSnap.docs.map((doc) => {
    const data = doc.data() as DeckDoc
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      folderId: data.folderId,
      folderName: folderNameMap.get(data.folderId) ?? 'Folder dihapus',
      cardCount: data.cardCount ?? 0,
    }
  })

  return (
    <>
      <PageHeader title="Cari" />
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <SearchClient items={items} />
      </div>
    </>
  )
}
