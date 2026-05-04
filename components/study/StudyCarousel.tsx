'use client'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import FlashCard from '@/components/cards/FlashCard'
import ProgressBadge from '@/components/study/ProgressBadge'
import { rateCard } from '@/lib/actions/study.actions'
import { previewRatings, type FsrsRating } from '@/lib/fsrs/scheduler'
import { toast } from '@/lib/toast'
import type { CardData, FsrsStateName } from '@/lib/types'

export type StudyCard = {
  id: string
  soal: string
  jawaban: string
  state: FsrsStateName
  due: string | null
  stability: number | null
  difficulty: number | null
  elapsedDays: number | null
  scheduledDays: number | null
  reps: number | null
  lapses: number | null
  lastReview: string | null
}

type Props = {
  cards: StudyCard[]
  deckId: string
}

function studyCardToCardData(c: StudyCard, deckId: string): CardData {
  const base = {
    id: c.id,
    deckId,
    soal: c.soal,
    jawaban: c.jawaban,
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  if (c.state === 'new') return { ...base, state: 'new' }
  return {
    ...base,
    state: c.state,
    due: new Date(c.due!),
    stability: c.stability!,
    difficulty: c.difficulty!,
    elapsedDays: c.elapsedDays!,
    scheduledDays: c.scheduledDays!,
    reps: c.reps!,
    lapses: c.lapses!,
    lastReview: new Date(c.lastReview!),
  }
}

function formatInterval(days: number): string {
  if (days < 1 / 1440) return '<1m'
  if (days < 1 / 24) {
    const m = Math.round(days * 1440)
    return `${m}m`
  }
  if (days < 1) {
    const h = Math.round(days * 24)
    return `${h}j`
  }
  if (days < 30) {
    const d = Math.round(days)
    return `${d}h`
  }
  if (days < 365) {
    const mo = Math.round(days / 30)
    return `${mo}bln`
  }
  const y = Math.round((days / 365) * 10) / 10
  return `${y}thn`
}

const RATING_CONFIG: Array<{
  rating: FsrsRating
  label: string
  hint: string
  bgClass: string
  shadow: string
  textClass: string
}> = [
  { rating: 'Again', label: 'Lagi',   hint: 'Lupa',     bgClass: 'bg-coral',     shadow: '#E03B3B', textClass: 'text-white' },
  { rating: 'Hard',  label: 'Susah',  hint: 'Ragu',     bgClass: 'bg-sun',       shadow: '#F5B800', textClass: 'text-ink'   },
  { rating: 'Good',  label: 'Bagus',  hint: 'OK',       bgClass: 'bg-mint',      shadow: '#008F73', textClass: 'text-white' },
  { rating: 'Easy',  label: 'Mudah',  hint: 'Gampang',  bgClass: 'bg-sky',       shadow: '#1E96E0', textClass: 'text-white' },
]

export default function StudyCarousel({ cards, deckId }: Props) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set())
  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const containerRef = useRef<HTMLDivElement>(null)

  const total = cards.length
  const isCompletion = currentIndex >= total
  const currentCard = isCompletion ? null : cards[currentIndex]
  const isFlipped = currentCard ? flippedIds.has(currentCard.id) : false
  const isRated = currentCard ? ratedIds.has(currentCard.id) : false

  // Compute interval previews for current card
  const previews = useMemo(() => {
    if (!currentCard) return null
    return previewRatings(studyCardToCardData(currentCard, deckId), new Date())
  }, [currentCard?.id, deckId])

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

  function goPrev() {
    if (currentIndex <= 0) return
    scrollToIndex(currentIndex - 1)
  }

  function goNext() {
    if (currentIndex >= total) return
    scrollToIndex(currentIndex + 1)
  }

  function handleFlip() {
    if (!currentCard) return
    setFlippedIds((prev) => {
      const next = new Set(prev)
      if (next.has(currentCard.id)) next.delete(currentCard.id)
      else next.add(currentCard.id)
      return next
    })
  }

  function handleRate(rating: FsrsRating) {
    if (!currentCard || isRated) return
    const cardId = currentCard.id

    setRatedIds((prev) => new Set(prev).add(cardId))

    startTransition(async () => {
      const result = await rateCard(deckId, cardId, rating)
      if (!result.success) {
        toast(`Gagal menyimpan: ${result.error}`)
        setRatedIds((prev) => {
          const next = new Set(prev)
          next.delete(cardId)
          return next
        })
        return
      }
    })

    // Advance to next card
    setTimeout(() => scrollToIndex(currentIndex + 1), 200)
  }

  // Keyboard nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === ' ' && currentCard && !isRated) {
        e.preventDefault()
        handleFlip()
      } else if (isFlipped && !isRated && currentCard) {
        if (e.key === '1') handleRate('Again')
        else if (e.key === '2') handleRate('Hard')
        else if (e.key === '3') handleRate('Good')
        else if (e.key === '4') handleRate('Easy')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentIndex, total, isFlipped, isRated, currentCard?.id])

  return (
    <div className="fixed inset-0 z-50 bg-bg paper-bg">
      <ProgressBadge current={Math.min(currentIndex + 1, total)} total={total} />

      <button
        onClick={() => router.push(`/decks/${deckId}`)}
        className="fixed top-4 left-4 z-50 h-9 px-4 rounded-full bg-ink/85 backdrop-blur-sm text-surface text-xs font-bold hover:bg-ink transition-colors"
      >
        ← Keluar
      </button>

      {/* Prev/Next buttons (desktop only) */}
      {!isCompletion && currentIndex > 0 && (
        <button
          onClick={goPrev}
          aria-label="Kartu sebelumnya"
          className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-surface border-2 border-ink-faint items-center justify-center hover:bg-mint-soft hover:border-mint transition-all active:scale-95"
          style={{ boxShadow: '0 4px 0 0 #E5E7EB' }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {!isCompletion && (
        <button
          onClick={goNext}
          aria-label="Kartu selanjutnya"
          className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-surface border-2 border-ink-faint items-center justify-center hover:bg-mint-soft hover:border-mint transition-all active:scale-95"
          style={{ boxShadow: '0 4px 0 0 #E5E7EB' }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Horizontal swipe container */}
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
          const cardFlipped = flippedIds.has(card.id)
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
              className="flex items-center justify-center pb-44 pt-16"
            >
              <FlashCard
                soal={card.soal}
                jawaban={card.jawaban}
                index={i}
                flipped={cardFlipped}
                onFlip={() => {
                  setFlippedIds((prev) => {
                    const next = new Set(prev)
                    if (next.has(card.id)) next.delete(card.id)
                    else next.add(card.id)
                    return next
                  })
                }}
              />
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
          className="flex flex-col items-center justify-center gap-6 px-6"
        >
          <div className="text-7xl mb-2 bounce-in">🎉</div>
          <h2 className="font-display text-4xl text-ink tracking-tight">Selesai!</h2>
          <p className="text-ink-muted text-base font-medium text-center max-w-sm">
            {ratedIds.size} dari {total} kartu sudah dinilai. Algoritma sudah menjadwalkan kartu untuk review berikutnya.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
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

      {/* Rating panel — fixed at bottom, only when card is flipped */}
      {!isCompletion && currentCard && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-3 pointer-events-none"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)' }}
        >
          {!isFlipped ? (
            <div className="text-center text-ink-subtle text-xs font-bold tracking-wide pointer-events-none">
              Tap kartu untuk lihat jawaban &nbsp;·&nbsp; ← Geser →
            </div>
          ) : isRated ? (
            <div className="max-w-md mx-auto bg-mint-soft border-2 border-mint rounded-pill px-5 py-3 text-center pointer-events-auto">
              <p className="text-mint-deep text-sm font-bold">
                ✓ Tersimpan. Geser ke kartu berikutnya →
              </p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto grid grid-cols-4 gap-2 pointer-events-auto">
              {RATING_CONFIG.map((cfg) => {
                const preview = previews?.[cfg.rating]
                const interval = preview ? formatInterval(preview.scheduledDays) : ''
                return (
                  <button
                    key={cfg.rating}
                    onClick={() => handleRate(cfg.rating)}
                    disabled={isPending}
                    className={`btn-3d ${cfg.bgClass} ${cfg.textClass} flex-col h-16 px-2 text-xs disabled:opacity-50`}
                    style={{ boxShadow: `0 5px 0 0 ${cfg.shadow}` }}
                  >
                    <span className="font-extrabold text-sm leading-none">{cfg.label}</span>
                    <span className="text-[10px] opacity-85 mt-0.5 leading-none tabular-nums">{interval}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </div>
  )
}
