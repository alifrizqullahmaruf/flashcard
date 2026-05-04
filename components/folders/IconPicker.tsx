'use client'
import { useEffect } from 'react'
import { ICON_CATEGORIES } from '@/lib/folders/icons'

type Props = {
  open: boolean
  selected: string | null  // null = "Default (auto)"
  onSelect: (icon: string | null) => void
  onClose: () => void
}

export default function IconPicker({ open, selected, onSelect, onClose }: Props) {
  // Lock body scroll while open
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md max-h-[85dvh] overflow-y-auto bg-surface rounded-t-card-lg sm:rounded-card-lg border-2 border-ink-faint shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Pilih icon folder"
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-ink-faint px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-display text-xl text-ink tracking-tight">Pilih Icon</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="w-9 h-9 rounded-full bg-bg-soft text-ink-muted flex items-center justify-center hover:bg-ink-faint active:scale-95 transition-all"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Default (auto) option */}
          <button
            type="button"
            onClick={() => { onSelect(null); onClose() }}
            className={`w-full flex items-center gap-4 p-4 rounded-card border-2 transition-all active:scale-[0.98] ${
              selected === null
                ? 'border-mint bg-mint-soft'
                : 'border-ink-faint bg-surface hover:border-mint hover:bg-mint-soft/40'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-bg-soft flex items-center justify-center text-2xl shrink-0">
              📁
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-ink font-bold text-base">Default (auto)</p>
              <p className="text-ink-muted text-xs font-medium">Sistem pilih icon & warna otomatis</p>
            </div>
            {selected === null && (
              <span className="text-mint-deep text-lg shrink-0">✓</span>
            )}
          </button>

          {/* Categorized grids */}
          {ICON_CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <p className="text-ink-subtle text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </p>
              <div className="grid grid-cols-6 gap-2">
                {cat.icons.map((icon) => {
                  const isActive = selected === icon
                  return (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => { onSelect(icon); onClose() }}
                      aria-label={`Pilih ${icon}`}
                      className={`aspect-square rounded-card flex items-center justify-center text-2xl border-2 transition-all active:scale-90 ${
                        isActive
                          ? 'border-mint bg-mint-soft scale-105'
                          : 'border-ink-faint bg-surface hover:border-mint hover:bg-mint-soft/40'
                      }`}
                    >
                      {icon}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
