'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

type SearchItem = {
  id: string
  title: string
  description: string | null
  folderId: string
  folderName: string
  cardCount: number
}

type Props = { items: SearchItem[] }

export default function SearchClient({ items }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.description?.toLowerCase().includes(q) ?? false) ||
        item.folderName.toLowerCase().includes(q)
    )
  }, [items, query])

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle" width="18" height="18" fill="none" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          placeholder="Cari deck, deskripsi, atau folder..."
          className="w-full h-14 rounded-xl border border-cream-dark bg-surface pl-12 pr-4 text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-ink/20"
        />
      </div>

      {items.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-3 text-center">
          <p className="font-display text-2xl text-ink">Belum ada deck</p>
          <p className="text-ink-muted text-sm">Buat folder dan deck dulu untuk bisa dicari.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-2 text-center">
          <p className="font-display text-xl text-ink">Tidak ditemukan</p>
          <p className="text-ink-muted text-sm">Coba kata kunci lain.</p>
        </div>
      ) : (
        <div className="border border-cream-dark rounded-2xl overflow-hidden bg-surface">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/decks/${item.id}`}
              className="flex items-center px-4 py-4 border-b border-cream-dark last:border-b-0 gap-3 min-h-18 hover:bg-cream transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-ink font-medium text-base leading-snug truncate">{item.title}</p>
                <p className="text-ink-muted text-xs mt-0.5">
                  📁 {item.folderName} · {item.cardCount} kartu
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filtered.length > 0 && query && (
        <p className="text-ink-subtle text-xs text-center">
          {filtered.length} dari {items.length} deck
        </p>
      )}
    </div>
  )
}
