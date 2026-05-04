'use client'
import { useState } from 'react'
import ModePicker from '@/components/study/ModePicker'
import StudyCarousel, { type StudyCard } from '@/components/study/StudyCarousel'
import QuizCarousel, { type QuizCard } from '@/components/study/QuizCarousel'

type Mode = 'picker' | 'flashcard' | 'quiz'

type Props = {
  deckId: string
  deckTitle: string
  flashcardCards: StudyCard[]
  quizCards: QuizCard[]
}

export default function StudyModeRouter({
  deckId,
  deckTitle,
  flashcardCards,
  quizCards,
}: Props) {
  const [mode, setMode] = useState<Mode>('picker')

  if (mode === 'picker') {
    return (
      <ModePicker
        deckTitle={deckTitle}
        deckId={deckId}
        flashcardCount={flashcardCards.length}
        quizEligibleCount={quizCards.length}
        onPickFlashcard={() => setMode('flashcard')}
        onPickQuiz={() => setMode('quiz')}
      />
    )
  }

  if (mode === 'flashcard') {
    return <StudyCarousel cards={flashcardCards} deckId={deckId} />
  }

  return <QuizCarousel cards={quizCards} deckId={deckId} />
}
