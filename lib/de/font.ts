import { Geist } from 'next/font/google'

/** Klar's single typeface — declared once and shared by every Klar layout. */
export const geist = Geist({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-geist', display: 'swap' })
