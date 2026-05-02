import Link from 'next/link'
import { getCurrentUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getFolders } from '@/lib/firestore/folders'
import FolderCard from '@/components/folders/FolderCard'
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
            className="h-9 px-4 rounded-full bg-ink text-surface text-sm font-medium flex items-center hover:opacity-80 transition-opacity"
          >
            + Folder
          </Link>
        }
      />

      <div className="flex-1 px-4 py-4">
        {folders.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            <p className="font-display text-2xl text-ink">Belum ada folder</p>
            <p className="text-ink-muted text-sm">Buat folder dulu untuk mengelompokkan deck.</p>
            <Link href="/folders/new" className="mt-2 text-ink text-sm underline underline-offset-4">
              Buat folder
            </Link>
          </div>
        ) : (
          <div className="border border-cream-dark rounded-2xl overflow-hidden bg-surface">
            {folders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
