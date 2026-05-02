export default function StudyLoading() {
  return (
    <div className="fixed inset-0 z-50 bg-cream flex items-center justify-center">
      <div className="w-full max-w-lg px-6">
        <div
          className="skeleton rounded-xl w-full"
          style={{ aspectRatio: '3/2' }}
        />
        <p className="text-center text-ink-subtle text-sm mt-6">Memuat kartu...</p>
      </div>
    </div>
  )
}
