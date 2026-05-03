'use client'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import FolderCard from '@/components/folders/FolderCard'
import type { FolderWithCount } from '@/lib/types'

type Props = { folders: FolderWithCount[] }

export default function FoldersListClient({ folders }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return folders
    return folders.filter((f) =>
      f.name.toLowerCase().includes(q) ||
      (f.description?.toLowerCase().includes(q) ?? false)
    )
  }, [folders, query])

  return (
    <div className="flex flex-col gap-4">
      {folders.length > 0 && (
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle" width="18" height="18" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari folder..."
            className="w-full h-12 rounded-pill border border-ink-faint bg-surface pl-11 pr-4 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-mint focus:ring-2 focus:ring-mint-soft"
          />
          {query && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-mint-dark text-xs font-bold"
            >
              Cari di semua deck →
            </Link>
          )}
        </div>
      )}

      {folders.length === 0 ? (
        <div className="bg-surface border-2 border-dashed border-ink-faint rounded-card-lg p-10 text-center mt-4">
          <div className="text-6xl mb-4">📂</div>
          <h3 className="font-extrabold text-ink text-xl mb-1">Belum ada folder</h3>
          <p className="text-ink-muted text-sm mb-5">Buat folder pertamamu untuk mulai mengelompokkan deck.</p>
          <Link
            href="/folders/new"
            className="btn-3d btn-3d-mint h-12 px-7 text-sm"
          >
            + Buat Folder
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-ink-muted text-sm">Tidak ada folder cocok dengan &quot;{query}&quot;</p>
        </div>
      ) : (
        <div className="bg-surface border border-ink-faint rounded-card-lg overflow-hidden">
          {filtered.map((folder) => (
            <FolderCard key={folder.id} folder={folder} />
          ))}
        </div>
      )}
    </div>
  )
}
