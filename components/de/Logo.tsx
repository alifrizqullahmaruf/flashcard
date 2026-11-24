/** "Klar" wordmark: name + the three gender bars (der · die · das). */
export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const big = size === 'lg'
  return (
    <span className="inline-flex flex-col items-start gap-1" aria-label="Klar">
      <span className={`${big ? 'text-[2.5rem]' : 'text-xl'} font-semibold tracking-[-0.04em] leading-none`}>Klar</span>
      <span className={`flex ${big ? 'gap-1.5' : 'gap-1'}`} aria-hidden>
        {['#2563EB', '#DC2626', '#059669'].map((c) => (
          <span key={c} className={`${big ? 'w-5 h-1.5' : 'w-2.5 h-1'} rounded-full`} style={{ background: c }} />
        ))}
      </span>
    </span>
  )
}
