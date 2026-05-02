'use client'
import { useEffect, useRef } from 'react'

type Props = {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Hapus',
  onConfirm,
  onCancel,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (open) ref.current?.showModal()
    else ref.current?.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      className="rounded-xl bg-surface p-6 w-full max-w-sm shadow-lg backdrop:bg-ink/20 backdrop:backdrop-blur-sm"
    >
      <h2 className="text-ink font-semibold text-base mb-1">{title}</h2>
      {description && (
        <p className="text-ink-muted text-sm mb-6">{description}</p>
      )}
      <div className="flex gap-3 justify-end mt-6">
        <button
          onClick={onCancel}
          className="h-10 px-4 rounded-lg text-sm font-medium text-ink-muted hover:bg-cream transition-colors"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          className="h-10 px-4 rounded-lg bg-ink text-surface text-sm font-medium hover:opacity-80 transition-opacity"
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
