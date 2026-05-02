/**
 * Script migrasi data dari SQLite (dev.db) ke Firestore.
 * Jalankan SEKALI sebelum deploy ke Vercel:
 *
 *   npx tsx scripts/migrate-to-firestore.ts
 *
 * Pastikan .env.local sudah ada dengan FIREBASE_PROJECT_ID,
 * FIREBASE_CLIENT_EMAIL, dan FIREBASE_PRIVATE_KEY.
 */
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import Database from 'better-sqlite3'
import path from 'path'

const projectId = process.env.FIREBASE_PROJECT_ID!
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!
let privateKey = process.env.FIREBASE_PRIVATE_KEY!

if (privateKey.startsWith('"')) privateKey = privateKey.slice(1, -1)
privateKey = privateKey.replace(/\\n/g, '\n')

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
}

const db = getFirestore()
const sqlite = new Database(path.join(process.cwd(), 'prisma', 'dev.db'))

interface SqliteDeck {
  id: string
  title: string
  description: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

interface SqliteCard {
  id: string
  soal: string
  jawaban: string
  order: number
  deckId: string
  createdAt: string
  updatedAt: string
}

async function migrate() {
  const decks = sqlite.prepare('SELECT * FROM Deck').all() as SqliteDeck[]
  console.log(`Migrasi ${decks.length} deck...`)

  for (const deck of decks) {
    const cards = sqlite
      .prepare('SELECT * FROM Card WHERE deckId = ? ORDER BY "order" ASC')
      .all(deck.id) as SqliteCard[]

    const batch = db.batch()
    const deckRef = db.collection('users').doc(deck.userId).collection('decks').doc(deck.id)

    batch.set(deckRef, {
      title: deck.title,
      description: deck.description ?? null,
      userId: deck.userId,
      cardCount: cards.length,
      createdAt: new Date(deck.createdAt),
      updatedAt: new Date(deck.updatedAt),
    })

    for (const card of cards) {
      const cardRef = deckRef.collection('cards').doc(card.id)
      batch.set(cardRef, {
        soal: card.soal,
        jawaban: card.jawaban,
        order: card.order,
        createdAt: new Date(card.createdAt),
        updatedAt: new Date(card.updatedAt),
      })
    }

    await batch.commit()
    console.log(`  ✓ Deck "${deck.title}" (${cards.length} kartu)`)
  }

  console.log('Migrasi selesai!')
  sqlite.close()
  process.exit(0)
}

migrate().catch((err) => {
  console.error('Migrasi gagal:', err)
  process.exit(1)
})
