import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUserId } from '@/lib/auth'
import { getDeckWithCards } from '@/lib/firestore/decks'
import StudyCarousel from '@/components/study/StudyCarousel'

export default async function StudyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const userId = await getCurrentUserId()
  if (!userId) notFound()

  const deck = await getDeckWithCards(id, userId)
  if (!deck) notFound()

  if (deck.cards.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
        <h2 className="font-display text-2xl text-ink">Deck kosong</h2>
        <p className="text-ink-muted text-sm">Tambah kartu dulu sebelum belajar.</p>
        <Link
          href={`/decks/${id}/edit`}
          className="h-12 px-6 rounded-lg bg-ink text-surface text-sm font-medium flex items-center hover:opacity-80"
        >
          Tambah Kartu
        </Link>
      </div>
    )
  }

  return (
    <StudyCarousel
      cards={deck.cards.map((c) => ({ id: c.id, soal: c.soal, jawaban: c.jawaban }))}
      deckId={id}
    />
  )
}
