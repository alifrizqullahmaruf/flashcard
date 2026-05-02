import {
  fsrs,
  generatorParameters,
  createEmptyCard,
  Rating,
  State,
  type Card as FsrsCard,
  type ReviewLog,
} from 'ts-fsrs'
import type { CardData, FsrsState } from '@/lib/types'

const scheduler = fsrs(generatorParameters({ request_retention: 0.9 }))

export const RATING_MAP = {
  Again: Rating.Again,
  Hard: Rating.Hard,
  Good: Rating.Good,
  Easy: Rating.Easy,
} as const satisfies Record<string, Rating>

export type FsrsRating = keyof typeof RATING_MAP

const STATE_TO_NAME: Record<State, FsrsState['state']> = {
  [State.New]: 'new',
  [State.Learning]: 'learning',
  [State.Review]: 'review',
  [State.Relearning]: 'relearning',
}

const NAME_TO_STATE: Record<FsrsState['state'], State> = {
  new: State.New,
  learning: State.Learning,
  review: State.Review,
  relearning: State.Relearning,
}

export function createNewState(): FsrsState {
  return { state: 'new' }
}

function cardToFsrs(card: CardData): FsrsCard {
  if (card.state === 'new') {
    return createEmptyCard()
  }
  return {
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsedDays,
    scheduled_days: card.scheduledDays,
    reps: card.reps,
    lapses: card.lapses,
    state: NAME_TO_STATE[card.state],
    last_review: card.lastReview,
    learning_steps: 0,
  }
}

function fsrsToState(fsrsCard: FsrsCard): FsrsState {
  const stateName = STATE_TO_NAME[fsrsCard.state]
  if (stateName === 'new') return { state: 'new' }
  return {
    state: stateName,
    due: fsrsCard.due,
    stability: fsrsCard.stability,
    difficulty: fsrsCard.difficulty,
    elapsedDays: fsrsCard.elapsed_days,
    scheduledDays: fsrsCard.scheduled_days,
    reps: fsrsCard.reps,
    lapses: fsrsCard.lapses,
    lastReview: fsrsCard.last_review ?? new Date(),
  }
}

export function applyRating(
  card: CardData,
  now: Date,
  rating: FsrsRating
): { nextState: FsrsState; log: ReviewLog } {
  const fsrsCard = cardToFsrs(card)
  const result = scheduler.next(fsrsCard, now, RATING_MAP[rating])
  return { nextState: fsrsToState(result.card), log: result.log }
}

export type RatingPreview = {
  due: Date
  scheduledDays: number
}

export function previewRatings(
  card: CardData,
  now: Date
): Record<FsrsRating, RatingPreview> {
  const fsrsCard = cardToFsrs(card)
  const previews = scheduler.repeat(fsrsCard, now)
  return {
    Again: { due: previews[Rating.Again].card.due, scheduledDays: previews[Rating.Again].card.scheduled_days },
    Hard: { due: previews[Rating.Hard].card.due, scheduledDays: previews[Rating.Hard].card.scheduled_days },
    Good: { due: previews[Rating.Good].card.due, scheduledDays: previews[Rating.Good].card.scheduled_days },
    Easy: { due: previews[Rating.Easy].card.due, scheduledDays: previews[Rating.Easy].card.scheduled_days },
  }
}
