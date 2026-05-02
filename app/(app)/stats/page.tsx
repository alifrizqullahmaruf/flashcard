import { redirect } from 'next/navigation'
import { getCurrentUserId } from '@/lib/auth'
import { getUserStats } from '@/lib/firestore/stats'
import { getFolders } from '@/lib/firestore/folders'
import PageHeader from '@/components/layout/PageHeader'
import Link from 'next/link'

export default async function StatsPage() {
  const userId = await getCurrentUserId()
  if (!userId) redirect('/login')

  const [stats, folders] = await Promise.all([
    getUserStats(userId),
    getFolders(userId),
  ])

  const topFolders = [...folders]
    .sort((a, b) => b._count.decks - a._count.decks)
    .slice(0, 5)

  return (
    <>
      <PageHeader title="Progress" />
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Folder" value={stats.folderCount} />
          <StatCard label="Deck" value={stats.deckCount} />
          <StatCard label="Kartu" value={stats.cardCount} />
        </div>

        {folders.length > 0 && (
          <div className="mb-2">
            <p className="text-ink text-sm font-medium mb-3">Folder teratas</p>
            <div className="border border-cream-dark rounded-2xl overflow-hidden bg-surface">
              {topFolders.map((folder) => (
                <Link
                  key={folder.id}
                  href={`/folders/${folder.id}`}
                  className="flex items-center px-4 py-4 border-b border-cream-dark last:border-b-0 gap-3 hover:bg-cream transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-ink font-medium text-base truncate">{folder.name}</p>
                    <p className="text-ink-muted text-sm mt-0.5">{folder._count.decks} deck</p>
                  </div>
                  <span className="text-ink-subtle text-sm">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {stats.deckCount === 0 && (
          <div className="py-16 flex flex-col items-center gap-3 text-center border border-cream-dark rounded-2xl bg-surface">
            <p className="font-display text-xl text-ink">Belum ada progres</p>
            <p className="text-ink-muted text-sm">Mulai bikin folder dan deck untuk lihat statistik.</p>
            <Link href="/decks" className="mt-2 text-ink text-sm underline underline-offset-4">
              Mulai sekarang
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-cream-dark rounded-2xl bg-surface px-4 py-5 flex flex-col items-center gap-1">
      <p className="font-display text-3xl text-ink">{value}</p>
      <p className="text-ink-muted text-xs">{label}</p>
    </div>
  )
}
