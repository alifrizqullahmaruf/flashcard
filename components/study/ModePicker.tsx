'use client'
import { useRouter } from 'next/navigation'

type Props = {
  deckTitle: string
  deckId: string
  flashcardCount: number
  quizEligibleCount: number
  onPickFlashcard: () => void
  onPickQuiz: () => void
}

export default function ModePicker({
  deckTitle,
  deckId,
  flashcardCount,
  quizEligibleCount,
  onPickFlashcard,
  onPickQuiz,
}: Props) {
  const router = useRouter()
  const quizDisabled = quizEligibleCount < 4

  return (
    <div className="fixed inset-0 z-50 paper-bg flex flex-col">
      <button
        onClick={() => router.push(`/decks/${deckId}`)}
        className="absolute top-4 left-4 z-10 h-9 px-4 rounded-full bg-ink/85 backdrop-blur-sm text-surface text-xs font-bold hover:bg-ink transition-colors"
      >
        ← Keluar
      </button>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-16 max-w-lg mx-auto w-full gap-6">
        <div className="text-center">
          <h1 className="font-display text-3xl text-ink tracking-tight mb-1">{deckTitle}</h1>
          <p className="text-ink-muted text-sm font-medium">Pilih cara belajar hari ini</p>
        </div>

        {/* Mode 1: Flashcard */}
        <button
          onClick={onPickFlashcard}
          className="w-full text-left card-3d p-5 hover:border-mint hover:shadow-md transition-all active:scale-[0.98] bounce-in"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-mint-soft flex items-center justify-center text-3xl shrink-0">
              📖
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h2 className="font-display text-xl text-ink tracking-tight">Flashcard</h2>
                <span className="sticker sticker-mint shrink-0">{flashcardCount}</span>
              </div>
              <p className="text-ink-muted text-sm leading-relaxed mb-2">
                Lihat soal → flip → nilai diri sendiri (Lagi/Susah/Bagus/Mudah).
              </p>
              <p className="text-ink-subtle text-xs font-medium">
                Cocok untuk: belajar pertama kali, hafalan kuat
              </p>
            </div>
          </div>
        </button>

        {/* Mode 2: Quiz */}
        <button
          onClick={quizDisabled ? undefined : onPickQuiz}
          disabled={quizDisabled}
          className={`w-full text-left card-3d p-5 transition-all bounce-in ${
            quizDisabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:border-coral hover:shadow-md active:scale-[0.98]'
          }`}
          style={{ animationDelay: '80ms' }}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-coral-soft flex items-center justify-center text-3xl shrink-0">
              🎯
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h2 className="font-display text-xl text-ink tracking-tight">Kuis Pilihan Ganda</h2>
                <span className="sticker sticker-coral shrink-0">{quizEligibleCount}</span>
              </div>
              <p className="text-ink-muted text-sm leading-relaxed mb-2">
                4 opsi → pilih yang benar. Auto-rating berdasarkan kecepatan & ketepatan.
              </p>
              {quizDisabled ? (
                <p className="text-coral-deep text-xs font-bold">
                  Butuh ≥4 kartu pendek di deck ini
                </p>
              ) : (
                <p className="text-ink-subtle text-xs font-medium">
                  Cocok untuk: review cepat, cek pemahaman
                </p>
              )}
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
