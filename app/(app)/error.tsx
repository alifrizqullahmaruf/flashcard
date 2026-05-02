'use client'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4 py-16">
      <h2 className="font-display text-2xl text-ink">Terjadi kesalahan</h2>
      <p className="text-ink-muted text-sm text-center max-w-xs">
        {error.message || 'Sesuatu tidak berjalan semestinya.'}
      </p>
      <button
        onClick={reset}
        className="h-10 px-6 rounded-lg bg-ink text-surface text-sm font-medium hover:opacity-80 transition-opacity"
      >
        Coba Lagi
      </button>
    </div>
  )
}
