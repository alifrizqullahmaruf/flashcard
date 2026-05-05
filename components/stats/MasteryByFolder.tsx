'use client'
import Link from 'next/link'
import { t } from '@/lib/i18n/translations'
import type { FolderMastery } from '@/lib/firestore/stats'
import type { Locale } from '@/lib/types'

type Props = {
  folders: FolderMastery[]
  locale: Locale
}

export default function MasteryByFolder({ folders, locale }: Props) {
  if (folders.length === 0) return null

  const visible = folders.filter((f) => f.totalCards > 0).slice(0, 8)
  if (visible.length === 0) return null

  return (
    <div>
      <h2 className="font-display text-xl text-ink mb-3 tracking-tight">{t('stats.folders_title', locale)}</h2>
      <div className="card-3d-soft overflow-hidden">
        {visible.map((folder, i) => (
          <Link
            key={folder.folderId}
            href={`/folders/${folder.folderId}`}
            className={`flex items-center gap-3 px-4 py-4 hover:bg-bg-soft transition-colors ${
              i < visible.length - 1 ? 'border-b border-ink-faint' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-mint-soft flex items-center justify-center text-xl shrink-0">
              {folder.folderIcon ?? '📁'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-ink font-bold text-sm truncate">{folder.folderName}</p>
                <p className="text-ink-muted text-xs font-bold tabular shrink-0">
                  {folder.masteryPct}%
                </p>
              </div>
              <div className="h-1.5 rounded-pill bg-bg-soft overflow-hidden mb-1">
                <div
                  className="h-full rounded-pill transition-all"
                  style={{
                    width: `${folder.masteryPct}%`,
                    background: 'linear-gradient(90deg, #00D4A8 0%, #00B891 100%)',
                  }}
                />
              </div>
              <p className="text-[11px] text-ink-muted font-medium">
                {folder.newCount > 0 && <>{t('stats.folders_progress_new', locale, { n: folder.newCount })} · </>}
                {folder.learningCount > 0 && <>{t('stats.folders_progress_learning', locale, { n: folder.learningCount })} · </>}
                {t('stats.folders_progress_mastered', locale, { n: folder.masteredCount })}
              </p>
            </div>
            <span className="text-ink-subtle text-base shrink-0">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
