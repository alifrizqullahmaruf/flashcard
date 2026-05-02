import { notFound } from 'next/navigation'
import { getCurrentUserId } from '@/lib/auth'
import { getFolderById } from '@/lib/firestore/folders'
import PageHeader from '@/components/layout/PageHeader'
import EditFolderClient from '@/components/folders/EditFolderClient'

export default async function EditFolderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const userId = await getCurrentUserId()
  if (!userId) notFound()

  const folder = await getFolderById(id, userId)
  if (!folder) notFound()

  return (
    <>
      <PageHeader title="Edit Folder" backHref={`/folders/${folder.id}`} />
      <div className="flex-1 px-4 py-5 overflow-y-auto">
        <EditFolderClient folder={folder} />
      </div>
    </>
  )
}
