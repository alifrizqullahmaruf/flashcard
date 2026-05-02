'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateFolder } from '@/lib/actions/folder.actions'
import { toast } from '@/lib/toast'
import type { FolderData } from '@/lib/types'

type Props = { folder: FolderData }

export default function EditFolderClient({ folder }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-6">
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
  )
}
