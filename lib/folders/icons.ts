/**
 * Curated emoji list for folder icons, grouped by category.
 * Used by IconPicker UI and FolderCard fallback logic.
 */

export type IconCategory = {
  id: string
  label: string
  emoji: string  // emoji used in category header
  icons: readonly string[]
}

export const ICON_CATEGORIES: readonly IconCategory[] = [
  {
    id: 'belajar',
    label: 'Belajar',
    emoji: '📚',
    icons: ['📚', '📖', '✏️', '🎓', '🔬', '🧮', '📝', '🧪', '📐', '🧠'],
  },
  {
    id: 'bahasa',
    label: 'Bahasa & Negara',
    emoji: '🌏',
    icons: ['🗣️', '💬', '🌏', '🇮🇩', '🇯🇵', '🇰🇷', '🇨🇳', '🇬🇧', '🇺🇸', '🇫🇷', '🇩🇪', '🇪🇸'],
  },
  {
    id: 'hobi',
    label: 'Hobi & Skill',
    emoji: '🎨',
    icons: ['🎨', '🎵', '🎸', '⚽', '🏀', '🎮', '💻', '🎬', '📷', '🍳', '⚗️', '🧬'],
  },
  {
    id: 'umum',
    label: 'Umum',
    emoji: '⭐',
    icons: ['🎯', '⭐', '💡', '🔥', '⚡', '🌟', '📌', '💎', '🚀', '🏆', '🌱', '✨'],
  },
] as const

/**
 * Flat list of all valid emoji icons. Use to validate user input.
 */
export const ALL_ICONS: readonly string[] = ICON_CATEGORIES.flatMap((c) => c.icons)

/**
 * Fallback emoji + color for folders without a custom icon set.
 * Deterministic based on folder ID hash — same folder always gets same fallback.
 */
const FALLBACK_VARIANTS = [
  { emoji: '📘', bg: 'bg-mint-soft', text: 'text-mint-deep' },
  { emoji: '📕', bg: 'bg-coral-soft', text: 'text-coral-deep' },
  { emoji: '📒', bg: 'bg-sun-soft', text: 'text-ink' },
  { emoji: '📗', bg: 'bg-sky-soft', text: 'text-sky-dark' },
  { emoji: '📓', bg: 'bg-purple-soft', text: '#6D28D9' },
] as const

export type FolderIconVisual = {
  emoji: string
  bg: string
  text: string
}

/**
 * Pick deterministic fallback variant for a folder ID (when user hasn't set icon).
 */
export function fallbackVariant(folderId: string): FolderIconVisual {
  let hash = 0
  for (let i = 0; i < folderId.length; i++) hash = (hash * 31 + folderId.charCodeAt(i)) | 0
  return FALLBACK_VARIANTS[Math.abs(hash) % FALLBACK_VARIANTS.length]
}

/**
 * Resolve final icon visual for a folder: use user-set icon if present, else fallback.
 * The custom icon uses a neutral mint-soft background (no color personalization yet).
 */
export function resolveIconVisual(folderId: string, userIcon: string | null | undefined): FolderIconVisual {
  if (userIcon && userIcon.trim().length > 0) {
    return {
      emoji: userIcon,
      bg: 'bg-mint-soft',
      text: 'text-mint-deep',
    }
  }
  return fallbackVariant(folderId)
}
