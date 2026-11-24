import type { MetadataRoute } from 'next'

/** Web App Manifest → lets phones install Klar to the home screen (PWA). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Klar — Bahasa Jerman sampai lulus Goethe',
    short_name: 'Klar',
    description: 'Belajar bahasa Jerman A1–C2 untuk Goethe-Zertifikat: materi, latihan, dan flashcard bersuara.',
    id: '/de',
    start_url: '/de',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FAFAFA',
    theme_color: '#FAFAFA',
    lang: 'id',
    categories: ['education'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
