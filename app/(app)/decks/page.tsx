import Link from 'next/link'
import { getCurrentUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getFolders } from '@/lib/firestore/folders'
import { getUserData } from '@/lib/firestore/user'
import { t } from '@/lib/i18n/translations'
import FoldersListClient from '@/components/decks/FoldersListClient'
import PageHeader from '@/components/layout/PageHeader'

export default async function DecksPage() {
  const userId = await getCurrentUserId()
  if (!userId) redirect('/login')

  const [folders, userData] = await Promise.all([
    getFolders(userId),
    getUserData(userId),
  ])
  const locale = userData.language

  return (
    <>
      <PageHeader
        title={t('decks.title', locale)}
        action={
          <Link
            href="/folders/new"
            className="btn-3d btn-3d-mint h-11 px-5 text-xs"
          >
            {t('decks.add_folder', locale)}
          </Link>
        }
      />

      <div className="flex-1 px-5 py-4 max-w-2xl mx-auto w-full">
        <FoldersListClient folders={folders} />
      </div>
    </>
  )
}
