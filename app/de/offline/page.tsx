import Link from 'next/link'
import { WifiOff } from 'lucide-react'

export const metadata = { title: 'Offline' }

/** Shown by the service worker when a page was never opened and there is no connection. */
export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center text-center gap-4 pt-16">
      <span className="w-14 h-14 rounded-pill bg-bg-soft flex items-center justify-center">
        <WifiOff size={26} />
      </span>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kamu sedang offline</h1>
        <p className="text-ink-muted mt-1 max-w-xs">
          Halaman ini belum tersimpan di HP. Halaman yang pernah kamu buka tetap bisa dipakai. Untuk menyimpan semuanya, pakai
          <b className="text-ink font-medium"> Unduh untuk offline</b> di Progress saat online.
        </p>
      </div>
      <Link href="/de" className="h-11 px-5 rounded-btn bg-ink text-white font-medium btn-press inline-flex items-center">
        Ke Beranda
      </Link>
    </div>
  )
}
