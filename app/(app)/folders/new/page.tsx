import { redirect } from 'next/navigation'
import { getCurrentUserId } from '@/lib/auth'
import PageHeader from '@/components/layout/PageHeader'
import NewFolderClient from '@/components/folders/NewFolderClient'

export default async function NewFolderPage() {
  const userId = await getCurrentUserId()
  if (!userId) redirect('/login')

  return (
    <>
      <PageHeader title="Folder Baru" backHref="/decks" />
      <div className="flex-1 px-4 py-5 overflow-y-auto">
        <NewFolderClient />
      </div>
    </>
  )
}
