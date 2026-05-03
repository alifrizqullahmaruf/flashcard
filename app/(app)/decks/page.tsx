import Link from 'next/link'
import { getCurrentUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getFolders } from '@/lib/firestore/folders'
import FoldersListClient from '@/components/decks/FoldersListClient'
import PageHeader from '@/components/layout/PageHeader'

export default async function DecksPage() {
  const userId = await getCurrentUserId()
  if (!userId) redirect('/login')

  const folders = await getFolders(userId)

  return (
    <>
      <PageHeader
        title="Folder"
        action={
          <Link
            href="/folders/new"
            className="btn-3d btn-3d-mint h-11 px-5 text-xs"
          >
            + Folder
          </Link>
        }
      />

      <div className="flex-1 px-5 py-4 max-w-2xl mx-auto w-full">
        <FoldersListClient folders={folders} />
      </div>
    </>
  )
}
