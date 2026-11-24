import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { GENDER_STYLE, type Gender } from '@/lib/de/content'
import Speak from '@/components/de/Speak'
import { lessonSpeech } from '@/lib/de/speech-texts'

function textOf(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  return ''
}

/** ~~~contoh block → example cards. Each line: `Deutsch | Indonesia`. */
function Examples({ raw }: { raw: string }) {
  const rows = raw
    .trim()
    .split('\n')
    .map((l) => l.split('|').map((x) => x.trim()))
    .filter(([de]) => de)
  return (
    <div className="flex flex-col gap-2 my-1">
      {rows.map(([de, id], i) => (
        <div key={i} className="flex items-center gap-3 border-l-2 border-ink-faint pl-3 py-1">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-ink leading-snug">{de}</p>
            {id && <p className="text-[13px] text-ink-muted leading-snug mt-0.5">{id}</p>}
          </div>
          {/* speak only the German part, without arrows */}
          <Speak text={lessonSpeech(de)} size="sm" />
        </div>
      ))}
    </div>
  )
}

export default function Lesson({ body }: { body: string }) {
  return (
    <div className="text-[15px] leading-relaxed text-ink space-y-3">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h3: ({ children }) => <h3 className="text-lg font-semibold tracking-tight pt-5 border-t border-ink-faint mt-5">{children}</h3>,
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
          strong: ({ children }) => {
            const t = textOf(children)
            const g = GENDER_STYLE[t as Gender]
            return (
              <strong className="font-extrabold" style={{ color: g?.color }}>
                {children}
              </strong>
            )
          },
          em: ({ children }) => <em className="italic text-ink">{children}</em>,
          del: ({ children }) => <del className="text-coral-deep decoration-2">{children}</del>,
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children }) =>
            className === 'language-contoh' ? (
              <Examples raw={textOf(children)} />
            ) : (
              <code className="px-1.5 py-0.5 rounded bg-bg-soft font-bold">{children}</code>
            ),
          table: ({ children }) => (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm border-separate border-spacing-0 rounded-card overflow-hidden border-2 border-ink-faint bg-surface">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => <th className="bg-bg-soft text-left px-3 py-2 text-[11px] uppercase tracking-[0.08em] font-medium text-ink-muted whitespace-nowrap">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 border-t border-ink-faint whitespace-nowrap">{children}</td>,
        }}
      >
        {body.trim()}
      </ReactMarkdown>
    </div>
  )
}
