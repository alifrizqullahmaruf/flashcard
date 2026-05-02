'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import FlashCard from '@/components/cards/FlashCard'
import ProgressBadge from '@/components/study/ProgressBadge'

type Card = { id: string; soal: string; jawaban: string }

type Props = {
  cards: Card[]
  deckId: string
}

export default function StudyCarousel({ cards: initialCards, deckId }: Props) {
  const router = useRouter()
  const [cards, setCards] = useState(initialCards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [done, setDone] = useState(false)
  const isScrollingRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  function shuffle() {
    if (isScrollingRef.current) return
    setCards((prev) => {
      const arr = [...prev]
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    })
    setCurrentIndex(0)
    setDone(false)
    containerRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <div className="fixed inset-0 z-50 bg-cream">
      <ProgressBadge current={currentIndex + 1} total={cards.length} />

      {/* Shuffle button */}
      <button
        onClick={shuffle}
        className="fixed top-4 right-4 z-50 h-8 px-3 rounded-full bg-ink/80 backdrop-blur-sm text-surface text-xs font-medium hover:bg-ink transition-colors"
      >
        Acak
      </button>

      {/* Back button */}
      <button
        onClick={() => router.push(`/decks/${deckId}`)}
        className="fixed top-4 left-4 z-50 h-8 px-3 rounded-full bg-ink/80 backdrop-blur-sm text-surface text-xs font-medium hover:bg-ink transition-colors"
      >
        ← Keluar
      </button>

      {/* Scroll container */}
      <div
        ref={containerRef}
        onScroll={() => {
          isScrollingRef.current = true
          clearTimeout((containerRef as any)._scrollTimer)
          ;(containerRef as any)._scrollTimer = setTimeout(() => {
            isScrollingRef.current = false
          }, 150)
        }}
        style={{
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          height: '100dvh',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y',
          contain: 'strict',
        }}
      >
        {cards.map((card, i) => (
          <div
            key={card.id}
            data-snap-index={i}
            style={{
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              height: '100dvh',
              minHeight: '-webkit-fill-available',
            }}
          >
            <FlashCard soal={card.soal} jawaban={card.jawaban} index={i} />
          </div>
        ))}

        {/* Completion screen */}
        <div
          style={{
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            height: '100dvh',
          }}
          className="flex flex-col items-center justify-center gap-6 bg-cream px-6"
        >
          <h2 className="font-display text-3xl text-ink">Selesai!</h2>
          <p className="text-ink-muted text-sm">{cards.length} kartu sudah dikerjakan.</p>
          <div className="flex gap-3">
            <button
              onClick={shuffle}
              className="h-12 px-6 rounded-lg border border-cream-dark text-ink text-sm font-medium hover:bg-cream-dark transition-colors"
            >
              Ulangi Acak
            </button>
            <button
              onClick={() => {
                containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
                setCurrentIndex(0)
              }}
              className="h-12 px-6 rounded-lg bg-ink text-surface text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Ulangi dari Awal
            </button>
          </div>
          <button
            onClick={() => router.push(`/decks/${deckId}`)}
            className="text-ink-muted text-sm underline underline-offset-4 hover:text-ink"
          >
            Kembali ke deck
          </button>
        </div>
      </div>
    </div>
  )
}
