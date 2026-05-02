'use client'
import { useEffect, useState } from 'react'

type ToastItem = { id: number; message: string; type: 'success' | 'error' }

export default function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    function handler(e: Event) {
      const { message, type } = (e as CustomEvent<{ message: string; type: 'success' | 'error' }>).detail
      const id = Date.now()
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 3000)
    }
    window.addEventListener('app:toast', handler)
    return () => window.removeEventListener('app:toast', handler)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none md:bottom-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all ${
            t.type === 'success'
              ? 'bg-ink text-surface'
              : 'bg-red-600 text-white'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
