/**
 * Achievement system — 6 badges × 4 tiers each.
 *
 * Tiers: bronze → silver → gold → diamond
 * Each tier has a threshold; user unlocks all tiers ≤ their stat.
 * "Current tier" = highest unlocked. "Next tier" = first locked.
 */

export type Tier = 'bronze' | 'silver' | 'gold' | 'diamond'
export type AchievementId = 'wildfire' | 'scholar' | 'marathon' | 'sharpshooter' | 'curator' | 'daily_habit'

export interface AchievementDef {
  id: AchievementId
  name: string                    // Bahasa Indonesia user-facing
  emoji: string
  description: string             // Short hook
  metricLabel: string             // Unit (e.g., "hari", "kartu")
  thresholds: Record<Tier, number>
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'wildfire',
    name: 'Streak Master',
    emoji: '🔥',
    description: 'Belajar setiap hari',
    metricLabel: 'hari',
    thresholds: { bronze: 7, silver: 30, gold: 100, diamond: 365 },
  },
  {
    id: 'scholar',
    name: 'Sang Cendekia',
    emoji: '📚',
    description: 'Kartu sudah dihafal',
    metricLabel: 'kartu',
    thresholds: { bronze: 10, silver: 100, gold: 500, diamond: 2000 },
  },
  {
    id: 'marathon',
    name: 'Pelari Maraton',
    emoji: '🏃',
    description: 'Total review yang dilakukan',
    metricLabel: 'review',
    thresholds: { bronze: 50, silver: 500, gold: 5000, diamond: 25000 },
  },
  {
    id: 'sharpshooter',
    name: 'Penembak Jitu',
    emoji: '🎯',
    description: 'Tingkat hafalan kartu',
    metricLabel: '% retensi',
    thresholds: { bronze: 70, silver: 80, gold: 90, diamond: 95 },
  },
  {
    id: 'curator',
    name: 'Kurator',
    emoji: '📁',
    description: 'Folder yang dibuat',
    metricLabel: 'folder',
    thresholds: { bronze: 1, silver: 5, gold: 15, diamond: 30 },
  },
  {
    id: 'daily_habit',
    name: 'Kebiasaan Harian',
    emoji: '📅',
    description: 'Hari aktif belajar',
    metricLabel: 'hari',
    thresholds: { bronze: 10, silver: 50, gold: 200, diamond: 500 },
  },
]

export interface AchievementProgress {
  def: AchievementDef
  currentValue: number
  currentTier: Tier | null   // null = not yet bronze
  nextTier: Tier | null      // null = already diamond
  progressToNext: number      // 0-1
  nextThreshold: number | null
}

export function computeAchievementProgress(
  def: AchievementDef,
  currentValue: number
): AchievementProgress {
  const tiers: Tier[] = ['bronze', 'silver', 'gold', 'diamond']
  let currentTier: Tier | null = null
  let nextTier: Tier | null = 'bronze'

  for (const tier of tiers) {
    if (currentValue >= def.thresholds[tier]) {
      currentTier = tier
      const idx = tiers.indexOf(tier)
      nextTier = idx < tiers.length - 1 ? tiers[idx + 1] : null
    }
  }

  const nextThreshold = nextTier ? def.thresholds[nextTier] : null
  const baseValue = currentTier ? def.thresholds[currentTier] : 0
  const progressToNext = nextThreshold
    ? Math.min(1, Math.max(0, (currentValue - baseValue) / (nextThreshold - baseValue)))
    : 1

  return {
    def,
    currentValue,
    currentTier,
    nextTier,
    progressToNext,
    nextThreshold,
  }
}

export interface AchievementInputs {
  currentStreak: number
  masteredCount: number
  totalReps: number
  retentionPct: number       // 0-100
  folderCount: number
  totalDaysStudied: number
}

export function computeAllAchievements(input: AchievementInputs): AchievementProgress[] {
  const valueFor: Record<AchievementId, number> = {
    wildfire: input.currentStreak,
    scholar: input.masteredCount,
    marathon: input.totalReps,
    sharpshooter: input.retentionPct,
    curator: input.folderCount,
    daily_habit: input.totalDaysStudied,
  }
  return ACHIEVEMENTS.map((def) => computeAchievementProgress(def, valueFor[def.id]))
}

export const TIER_VISUAL: Record<Tier, { color: string; soft: string; ring: string; label: string }> = {
  bronze:  { color: '#B87333', soft: '#FBE5D6', ring: '#A85F1F', label: 'Perunggu' },
  silver:  { color: '#9AA0A6', soft: '#EEF2F6', ring: '#6B7280', label: 'Perak' },
  gold:    { color: '#F5B800', soft: '#FFF7D6', ring: '#D49A00', label: 'Emas' },
  diamond: { color: '#4DB8FF', soft: '#E5F4FF', ring: '#1E96E0', label: 'Diamond' },
}
