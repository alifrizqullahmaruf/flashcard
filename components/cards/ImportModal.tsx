'use client'
import { useEffect, useRef, useState } from 'react'
import { parseImportText, parseCsvFile, type CardInput } from '@/lib/utils/import'

type Props = {
  open: boolean
  onClose: () => void
  onImport: (cards: CardInput[]) => void
}

export default function ImportModal({ open, onClose, onImport }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [text, setText] = useState('')
  const [parsed, setParsed] = useState<CardInput[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) dialogRef.current?.showModal()
    else { dialogRef.current?.close(); reset() }
  }, [open])

  // Auto-parse setiap kali text berubah
  useEffect(() => {
    if (!text.trim()) { setParsed([]); setErrors([]); return }
    parseImportText(text).then((result) => {
      setParsed(result.cards)
      setErrors(result.errors)
    })
  }, [text])

  function reset() {
    setText(''); setParsed([]); setErrors([])
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const result = await parseCsvFile(file)
    setParsed(result.cards)
    setErrors(result.errors)
    setText('')
  }

  function handleConfirm() {
    if (isSubmitting || parsed.length === 0) return
    setIsSubmitting(true)
    try { onImport(parsed); onClose() }
    finally { setIsSubmitting(false) }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="rounded-xl bg-surface p-6 w-full max-w-lg shadow-lg backdrop:bg-ink/20 backdrop:backdrop-blur-sm m-auto"
    >
      <h2 className="text-ink font-semibold text-base mb-4">Import Kartu</h2>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-ink text-sm font-medium block mb-1">
            Tempel dari spreadsheet (Tab / Koma sebagai pemisah)
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder={'soal\tjawaban\nApa itu React?\tLibrary UI JavaScript'}
            className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-ink/20 resize-none font-mono"
          />
          {text.trim() && parsed.length === 0 && errors.length === 0 && (
            <p className="mt-1 text-ink-subtle text-xs">Mendeteksi format...</p>
          )}
        </div>

        <div className="flex items-center gap-3 text-ink-subtle text-xs">
          <div className="flex-1 h-px bg-cream-dark" />
          atau upload CSV
          <div className="flex-1 h-px bg-cream-dark" />
        </div>

        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="text-sm text-ink-muted file:mr-3 file:h-8 file:px-3 file:rounded-lg file:border-0 file:bg-cream file:text-ink file:text-sm file:cursor-pointer"
        />

        {errors.length > 0 && (
          <ul className="text-red-600 text-xs space-y-0.5">
            {errors.map((e, i) => <li key={i}>• {e}</li>)}
          </ul>
        )}

        {parsed.length > 0 && (
          <div>
            <p className="text-ink-muted text-xs mb-2">{parsed.length} kartu terdeteksi:</p>
            <div className="rounded-lg border border-cream-dark overflow-hidden max-h-40 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-cream sticky top-0">
                  <tr>
                    <th className="text-left px-3 py-2 text-ink-muted font-medium w-1/2">Soal</th>
                    <th className="text-left px-3 py-2 text-ink-muted font-medium w-1/2">Jawaban</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-dark">
                  {parsed.map((c, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 text-ink truncate max-w-0">{c.soal}</td>
                      <td className="px-3 py-2 text-ink-muted truncate max-w-0">{c.jawaban}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end mt-6">
        <button
          type="button"
          onClick={onClose}
          className="h-10 px-4 rounded-lg text-sm font-medium text-ink-muted hover:bg-cream transition-colors"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={parsed.length === 0 || isSubmitting}
          className="h-10 px-4 rounded-lg bg-ink text-surface text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
        >
          Impor {parsed.length > 0 ? `${parsed.length} kartu` : ''}
        </button>
      </div>
    </dialog>
  )
}
