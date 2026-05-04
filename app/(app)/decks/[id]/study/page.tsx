import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUserId } from '@/lib/auth'
import { adminDb } from '@/lib/firebase/admin'
import { getDueCards } from '@/lib/firestore/cards'
import { type StudyCard } from '@/components/study/StudyCarousel'
import { type QuizCard } from '@/components/study/QuizCarousel'
import StudyModeRouter from '@/components/study/StudyModeRouter'
import { pickDistractors, buildOptions, isQuizEligible } from '@/lib/quiz/distractors'

export const dynamic = 'force-dynamic'

export default async function StudyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const userId = await getCurrentUserId()
  if (!userId) notFound()

  const deckSnap = await adminDb
    .collection('users').doc(userId)
    .collection('decks').doc(id)
    .get()
  if (!deckSnap.exists) notFound()

  const deckTitle = (deckSnap.data() as { title: string }).title
  const dueCards = await getDueCards(userId, id)

  if (dueCards.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5 text-center">
        <div className="text-7xl bounce-in">🎉</div>
        <h2 className="font-display text-3xl text-ink tracking-tight">Semua sudah dikuasai!</h2>
        <p className="text-ink-muted text-base font-medium max-w-sm">
          Tidak ada kartu yang perlu diulang sekarang. Cek lagi besok atau tambah kartu baru.
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          <Link
            href={`/decks/${id}`}
            className="btn-3d btn-3d-outline h-12 px-6 text-sm"
          >
            Kembali ke {deckTitle}
          </Link>
          <Link
            href={`/decks/${id}/edit`}
            className="btn-3d btn-3d-mint h-12 px-6 text-sm"
          >
            Tambah Kartu
          </Link>
        </div>
      </div>
    )
  }

  // Build flashcard cards (existing format)
  const flashcardCards: StudyCard[] = dueCards.map((c) => ({
    id: c.id,
    soal: c.soal,
    jawaban: c.jawaban,
    state: c.state,
    due: c.state === 'new' ? null : c.due.toISOString(),
    stability: c.state === 'new' ? null : c.stability,
    difficulty: c.state === 'new' ? null : c.difficulty,
    elapsedDays: c.state === 'new' ? null : c.elapsedDays,
    scheduledDays: c.state === 'new' ? null : c.scheduledDays,
    reps: c.state === 'new' ? null : c.reps,
    lapses: c.state === 'new' ? null : c.lapses,
    lastReview: c.state === 'new' ? null : c.lastReview.toISOString(),
  }))

  // Build quiz cards (eligible only, with pre-computed options)
  const allDeckAnswers = dueCards.map((c) => c.jawaban)
  const eligibleCards = dueCards.filter((c) => isQuizEligible(c.jawaban))
  const quizCards: QuizCard[] = []

  // Need ≥4 cards total (1 correct + 3 distractors), so eligible pool must have >= 4 unique answers
  // pickDistractors already throws if pool < 3 — guard at orchestration level instead
  if (eligibleCards.length >= 4) {
    for (const card of eligibleCards) {
      try {
        const distractors = pickDistractors(card.jawaban, allDeckAnswers)
        const options = buildOptions(card.jawaban, distractors)
        quizCards.push({
          id: card.id,
          soal: card.soal,
          jawaban: card.jawaban,
          options,
        })
      } catch {
        // Pool kebetulan tidak cukup untuk kartu ini (banyak duplikat) — skip
        continue
      }
    }
  }

  return (
    <StudyModeRouter
      deckId={id}
      deckTitle={deckTitle}
      flashcardCards={flashcardCards}
      quizCards={quizCards}
    />
  )
}
