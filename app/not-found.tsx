import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-display text-7xl text-ink mb-4">404</h1>
        <p className="text-ink-muted text-sm mb-8">Halaman tidak ditemukan.</p>
        <Link
          href="/decks"
          className="text-ink underline underline-offset-4 text-sm hover:text-ink-muted transition-colors"
        >
          Kembali ke Decks
        </Link>
      </div>
    </div>
  )
}
