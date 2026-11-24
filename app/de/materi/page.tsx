import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { LEVELS } from '@/lib/de/content'
import { getPractice } from '@/lib/de/exercises'
import { LevelTopicBar, TopicStageIcon } from '@/components/de/TopicStatus'

const pad = (n: number) => String(n).padStart(2, '0')

export default function MateriPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="de-label">Grammatik</p>
        <h1 className="text-[2rem] font-semibold tracking-tight leading-tight">Materi</h1>
        <p className="text-ink-muted mt-1">Yang wajib dikuasai untuk tiap level Goethe-Zertifikat.</p>
      </header>

      {LEVELS.map((lv, idx) => (
        <details key={lv.id} open={idx === 0} className="bg-surface border border-ink-faint rounded-card-lg overflow-hidden group">
          <summary className="list-none cursor-pointer px-4 py-4 flex items-center gap-4">
            <span className="text-[1.75rem] font-semibold tracking-tight w-10 shrink-0 leading-none">{lv.label}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium leading-tight">{lv.exam}</p>
              <p className="text-xs text-ink-subtle mt-1">{lv.topics.length} topik · {lv.vocab}</p>
              <LevelTopicBar level={lv.id} topics={lv.topics.filter((t) => t.body).map((t) => t.slug)} />
            </div>
            <ChevronDown size={18} className="text-ink-subtle group-open:rotate-180 transition" />
          </summary>
          <ol className="border-t border-ink-faint divide-y divide-ink-faint">
            {lv.topics.map((t, i) => {
              const practice = getPractice(lv.id, t.slug)
              const inner = (
                <>
                  <span className={`text-sm tabular-nums w-6 shrink-0 ${t.body ? 'text-ink' : 'text-ink-faint'}`}>{pad(i + 1)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium leading-snug ${t.body ? '' : 'text-ink-subtle'}`}>{t.title}</p>
                    <p className="text-[13px] text-ink-subtle leading-snug mt-0.5">
                      {t.summary}
                      {practice && <> · {practice.items.length} soal</>}
                    </p>
                  </div>
                  {t.body ? <TopicStageIcon level={lv.id} topic={t.slug} /> : <span className="de-label">Segera</span>}
                </>
              )
              return (
                <li key={t.slug}>
                  {t.body ? (
                    <Link href={`/de/materi/${lv.id}/${t.slug}`} className="flex items-center gap-3 px-4 py-3.5 active:bg-bg-soft transition-colors">
                      {inner}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3.5">{inner}</div>
                  )}
                </li>
              )
            })}
          </ol>
        </details>
      ))}
    </div>
  )
}
