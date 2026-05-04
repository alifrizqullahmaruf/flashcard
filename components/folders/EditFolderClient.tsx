'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateFolder } from '@/lib/actions/folder.actions'
import { toast } from '@/lib/toast'
import IconPicker from '@/components/folders/IconPicker'
import { resolveIconVisual } from '@/lib/folders/icons'
import type { FolderData } from '@/lib/types'

type Props = { folder: FolderData }

export default function EditFolderClient({ folder }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [icon, setIcon] = useState<string | null>(folder.icon)
  const [pickerOpen, setPickerOpen] = useState(false)

  const previewVisual = resolveIconVisual(folder.id, icon)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    if (icon) formData.set('icon', icon)
    else formData.delete('icon')

    startTransition(async () => {
      const result = await updateFolder(folder.id, formData)
      if (!result.success) {
        setError(result.error)
      } else {
        toast('Perubahan tersimpan!')
        router.push(`/folders/${folder.id}`)
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-6">
        {/* Icon picker button */}
        <div className="flex flex-col gap-2">
          <label className="text-ink text-sm font-medium">Icon</label>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-3 p-3 rounded-xl border-2 border-ink-faint bg-surface hover:border-mint transition-all active:scale-[0.98]"
          >
            <div className={`w-12 h-12 rounded-2xl ${previewVisual.bg} flex items-center justify-center text-2xl shrink-0`}>
              {previewVisual.emoji}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-ink font-bold text-sm">
                {icon ? 'Custom icon' : 'Default (auto)'}
              </p>
              <p className="text-ink-muted text-xs">Klik untuk ganti</p>
            </div>
            <span className="text-ink-subtle text-base shrink-0">→</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-ink text-sm font-medium">Nama Folder</label>
          <input
            id="name" name="name" required maxLength={100}
            defaultValue={folder.name}
            className="h-14 rounded-xl border border-cream-dark bg-surface px-4 text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-ink text-sm font-medium">
            Deskripsi <span className="text-ink-muted font-normal">(opsional)</span>
          </label>
          <textarea
            id="description" name="description" rows={2} maxLength={500}
            defaultValue={folder.description ?? ''}
            className="rounded-xl border border-cream-dark bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-ink/20 resize-none"
          />
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <button
          type="submit" disabled={isPending}
          className="w-full h-14 rounded-xl bg-ink text-surface text-base font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>

      <IconPicker
        open={pickerOpen}
        selected={icon}
        onSelect={(v) => setIcon(v)}
        onClose={() => setPickerOpen(false)}
      />
    </>
  )
}
