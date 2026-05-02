type Props = { current: number; total: number }

export default function ProgressBadge({ current, total }: Props) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-ink/80 backdrop-blur-sm text-surface text-xs font-medium px-3 py-1.5 rounded-full">
        {current} / {total}
      </div>
    </div>
  )
}
