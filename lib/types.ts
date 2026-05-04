export type FsrsStateName = 'new' | 'learning' | 'review' | 'relearning'

export type FsrsState =
  | { state: 'new' }
  | {
      state: 'learning' | 'review' | 'relearning'
      due: Date
      stability: number
      difficulty: number
      elapsedDays: number
      scheduledDays: number
      reps: number
      lapses: number
      lastReview: Date
    }

export type CardBase = {
  id: string
  soal: string
  jawaban: string
  order: number
  deckId: string
  createdAt: Date
  updatedAt: Date
}

export type CardData = CardBase & FsrsState

export type FolderData = {
  id: string
  name: string
  description: string | null
  icon: string | null  // emoji string set by user; null = use deterministic fallback
  userId: string
  createdAt: Date
  updatedAt: Date
}

export type FolderWithCount = FolderData & {
  _count: { decks: number }
}

export type DeckData = {
  id: string
  title: string
  description: string | null
  icon: string | null  // user-set emoji; null = inherit from parent folder
  folderId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export type DeckWithCount = DeckData & {
  _count: { cards: number }
}

export type DeckWithCards = DeckData & {
  cards: CardData[]
}

export type UserData = {
  uid: string
  email: string | null
  timezone: string
  currentStreak: number
  longestStreak: number
  lastStudyDate: string | null
  dailyGoal: number
  cardsStudiedToday: number
  streakFreezes: number
  createdAt: Date
  updatedAt: Date
}

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }
