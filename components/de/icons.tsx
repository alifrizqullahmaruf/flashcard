import { Clock, GraduationCap, Hash, IdCard, Palette, Users, UtensilsCrossed, type LucideIcon } from 'lucide-react'

/** Category → line icon (one consistent icon set instead of emoji stickers). */
export const CATEGORY_ICON: Record<string, LucideIcon> = {
  person: IdCard,
  familie: Users,
  zeit: Clock,
  essen: UtensilsCrossed,
  schule: GraduationCap,
  farben: Palette,
  zahlen: Hash,
}

export function CategoryIcon({
  slug,
  color = '#0A0A0A',
  bg = 'transparent',
  size = 20,
}: {
  slug: string
  color?: string
  bg?: string
  size?: number
}) {
  const Icon = CATEGORY_ICON[slug] ?? Hash
  return (
    <span
      className="inline-flex items-center justify-center rounded-card shrink-0 border border-ink-faint"
      style={{ background: bg, color, width: size * 2.1, height: size * 2.1 }}
    >
      <Icon size={size} strokeWidth={1.6} />
    </span>
  )
}
