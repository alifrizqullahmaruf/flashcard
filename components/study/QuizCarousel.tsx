'use client'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import ProgressBadge from '@/components/study/ProgressBadge'
import { rateCard } from '@/lib/actions/study.actions'
import type { FsrsRating } from '@/lib/fsrs/scheduler'
import { toast } from '@/lib/toast'

const EASY_THRESHOLD_MS = 3000
const FEEDBACK_DELAY_CORRECT = 800
const FEEDBACK_DELAY_WRONG = 1800

export type QuizCard = {
  id: string
  soal: string
  jawaban: string  // jawaban benar
  options: string[]  // 4 opsi sudah ter-shuffle
}

type AnswerRecord = {
  picked: string
  elapsedMs: number
  isCorrect: boolean
  rating: FsrsRating
}

type Props = {
  cards: QuizCard[]
  deckId: string
}

function computeRating(isCorrect: boolean, elapsedMs: number): FsrsRating {
  if (!isCorrect) return 'Again'
  if (elapsedMs < EASY_THRESHOLD_MS) return 'Easy'
  return 'Good'
}

export default function QuizCarousel({ cards, deckId }: Props) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<string, AnswerRecord>>(new Map())
  const [, startTransition] = useTransition()
  const containerRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<number>(0)

  const total = cards.length
  const isCompletion = currentIndex >= total
  const currentCard = isCompletion ? null : cards[currentIndex]
  const currentAnswer = currentCard ? answers.get(currentCard.id) : undefined
  const isAnswered = currentAnswer !== undefined

  // Reset timer saat pindah kartu
  useEffect(() => {
    startTimeRef.current = Date.now()
  }, [currentIndex])

  // IntersectionObserver untuk track index saat user swipe
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = container.querySelectorAll<HTMLElement>('[data-snap-index]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.snapIndex)
            setCurrentIndex(idx)
          }
        })
      },
      { threshold: 0.6, root: container }
    )

    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [cards.length])

  function scrollToIndex(idx: number) {
    const container = containerRef.current
    if (!container) return
    container.scrollTo({ left: idx * container.clientWidth, behavior: 'smooth' })
  }

  function handlePick(option: string) {
    if (!currentCard || isAnswered) return

    const elapsedMs = Date.now() - startTimeRef.current
    const isCorrect = option.trim().toLowerCase() === currentCard.jawaban.trim().toLowerCase()
    const rating = computeRating(isCorrect, elapsedMs)

    const record: AnswerRecord = { picked: option, elapsedMs, isCorrect, rating }
    setAnswers((prev) => {
      const next = new Map(prev)
      next.set(currentCard.id, record)
      return next
    })

    // Fire-and-forget rating dispatch
    startTransition(async () => {
      const result = await rateCard(deckId, currentCard.id, rating)
      if (!result.success) {
        toast(`Gagal simpan rating: ${result.error}`)
      }
    })

    // Auto-advance setelah delay
    const delay = isCorrect ? FEEDBACK_DELAY_CORRECT : FEEDBACK_DELAY_WRONG
    setTimeout(() => {
      const container = containerRef.current
      if (!container) return
      const liveIndex = Math.round(container.scrollLeft / container.clientWidth)
      scrollToIndex(liveIndex + 1)
    }, delay)
  }

  // Keyboard nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' && currentIndex < total) {
        scrollToIndex(currentIndex + 1)
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        scrollToIndex(currentIndex - 1)
      } else if (currentCard && !isAnswered) {
        const idx = ['1', '2', '3', '4'].indexOf(e.key)
        if (idx >= 0 && idx < currentCard.options.length) {
          handlePick(currentCard.options[idx])
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentIndex, total, isAnswered, currentCard?.id])

  // Stats untuk completion screen
  const stats = useMemo(() => {
    let correct = 0
    let totalElapsed = 0
    answers.forEach((a) => {
      if (a.isCorrect) correct++
      totalElapsed += a.elapsedMs
    })
    return {
      correct,
      total: answers.size,
      avgSeconds: answers.size > 0 ? Math.round((totalElapsed / answers.size) / 100) / 10 : 0,
      accuracy: answers.size > 0 ? Math.round((correct / answers.size) * 100) : 0,
    }
  }, [answers])

  return (
    <div className="fixed inset-0 z-50 paper-bg">
      <ProgressBadge current={Math.min(currentIndex + 1, total)} total={total} />

      <button
        onClick={() => router.push(`/decks/${deckId}`)}
        className="fixed top-4 left-4 z-50 h-9 px-4 rounded-full bg-ink/85 backdrop-blur-sm text-surface text-xs font-bold hover:bg-ink transition-colors"
      >
        ← Keluar
      </button>

      <div
        ref={containerRef}
        className="hide-scrollbar"
        style={{
          display: 'flex',
          overflowX: 'scroll',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          width: '100vw',
          height: '100dvh',
          overscrollBehavior: 'contain',
          touchAction: 'pan-x',
          scrollBehavior: 'smooth',
        }}
      >
        {cards.map((card, i) => {
          const answer = answers.get(card.id)
          return (
            <div
              key={card.id}
              data-snap-index={i}
              style={{
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                flex: '0 0 100vw',
                width: '100vw',
                height: '100dvh',
              }}
              className="flex flex-col items-center justify-center px-5 pt-16 pb-8 gap-6"
            >
              {/* Soal */}
              <div className="w-full max-w-lg flex flex-col items-center justify-center bg-surface border-2 border-ink-faint rounded-card-lg p-8 min-h-44"
                style={{ boxShadow: '0 4px 0 0 #E5E7EB' }}
              >
                <p className="text-ink-subtle text-xs font-bold uppercase tracking-widest mb-3">Soal</p>
                <p className="text-ink text-2xl text-center leading-relaxed font-semibold break-words">
                  {card.soal}
                </p>
              </div>

              {/* Opsi 4 buah */}
              <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-3">
                {card.options.map((opt, optIdx) => {
                  const isCorrectOpt = opt.trim().toLowerCase() === card.jawaban.trim().toLowerCase()
                  const isPicked = answer?.picked === opt

                  let stateClass = 'bg-surface border-ink-faint text-ink hover:border-mint hover:bg-mint-soft'
                  let shadowColor = '#E5E7EB'
                  if (answer) {
                    if (isCorrectOpt) {
                      stateClass = 'bg-mint border-mint text-white'
                      shadowColor = '#008F73'
                    } else if (isPicked) {
                      stateClass = 'bg-coral border-coral text-white'
                      shadowColor = '#E03B3B'
                    } else {
                      stateClass = 'bg-surface border-ink-faint text-ink-muted opacity-60'
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handlePick(opt)}
                      disabled={!!answer}
                      className={`min-h-14 px-4 py-3 rounded-btn border-2 text-base font-bold transition-all active:scale-[0.97] ${stateClass}`}
                      style={{ boxShadow: `0 4px 0 0 ${shadowColor}` }}
                    >
                      <span className="inline-block w-6 h-6 rounded-full bg-black/10 text-xs font-extrabold leading-6 mr-2">
                        {optIdx + 1}
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>

              {/* Feedback hint */}
              <div className="h-6 text-sm font-bold text-center" aria-live="polite">
                {answer && answer.isCorrect && (
                  <span className="text-mint-deep">✓ Benar! ({(answer.elapsedMs / 1000).toFixed(1)}s)</span>
                )}
                {answer && !answer.isCorrect && (
                  <span className="text-coral-deep">✗ Jawaban: {card.jawaban}</span>
                )}
                {!answer && (
                  <span className="text-ink-subtle text-xs">Pilih jawaban yang benar</span>
                )}
              </div>
            </div>
          )
        })}

        {/* Completion screen */}
        <div
          data-snap-index={total}
          style={{
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            flex: '0 0 100vw',
            width: '100vw',
            height: '100dvh',
          }}
          className="flex flex-col items-center justify-center gap-5 px-6 text-center"
        >
          <div className="text-7xl mb-2 bounce-in">🎉</div>
          <h2 className="font-display text-4xl text-ink tracking-tight">Selesai!</h2>

          <div className="grid grid-cols-3 gap-3 max-w-md w-full mt-2">
            <div className="card-3d-soft px-3 py-4 text-center">
              <p className="font-display text-2xl text-ink tabular leading-none">{stats.correct}/{stats.total}</p>
              <p className="text-xs text-ink-muted mt-1.5 font-bold uppercase">Benar</p>
            </div>
            <div className="card-3d-soft px-3 py-4 text-center">
              <p className="font-display text-2xl text-ink tabular leading-none">{stats.accuracy}%</p>
              <p className="text-xs text-ink-muted mt-1.5 font-bold uppercase">Akurasi</p>
            </div>
            <div className="card-3d-soft px-3 py-4 text-center">
              <p className="font-display text-2xl text-ink tabular leading-none">{stats.avgSeconds}s</p>
              <p className="text-xs text-ink-muted mt-1.5 font-bold uppercase">Rata-rata</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <button
              onClick={() => router.push(`/decks/${deckId}`)}
              className="btn-3d btn-3d-outline h-12 px-6 text-sm"
            >
              Kembali ke deck
            </button>
            <button
              onClick={() => router.refresh()}
              className="btn-3d btn-3d-mint h-12 px-6 text-sm"
            >
              Lanjut belajar
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </div>
  )
}
