import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// Self-hosted variable fonts (no Google Fonts download at build time — that
// download was flaky on Vercel and failed builds).
const jakarta = localFont({
  src: './fonts/plus-jakarta-sans-latin-wght-normal.woff2',
  weight: '200 800',
  variable: '--font-jakarta',
  display: 'swap',
})

const bricolage = localFont({
  src: './fonts/bricolage-grotesque-latin-wght-normal.woff2',
  weight: '200 800',
  variable: '--font-bricolage',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hafalin — Belajar sebentar, inget selamanya',
  description: 'Flashcard app untuk pelajar Indonesia. Spaced repetition modern dengan vibe yang seru.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#00D4A8',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${jakarta.variable} ${bricolage.variable} antialiased`}>
      <body className="font-sans" style={{ color: '#1F2937' }}>
        {children}
      </body>
    </html>
  )
}
