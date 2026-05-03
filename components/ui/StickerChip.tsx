type Color = 'mint' | 'coral' | 'sun' | 'sky' | 'purple'
type Tilt = 'left' | 'right' | 'mild' | 'none'

type Props = {
  children: React.ReactNode
  color?: Color
  tilt?: Tilt
  icon?: React.ReactNode
  className?: string
}

const TILT_CLASS: Record<Tilt, string> = {
  left: 'sticker-tilt-left',
  right: 'sticker-tilt-right',
  mild: 'sticker-tilt-mild',
  none: '',
}

/**
 * Sticker-style chip — tilted, bordered, with subtle drop shadow.
 * Mimics a sticker stuck on paper.
 *
 * @example
 *   <StickerChip color="coral" tilt="left" icon="🔥">5 hari</StickerChip>
 */
export default function StickerChip({
  children,
  color = 'mint',
  tilt = 'mild',
  icon,
  className = '',
}: Props) {
  return (
    <span className={`sticker sticker-${color} ${TILT_CLASS[tilt]} ${className}`}>
      {icon && <span className="text-base leading-none">{icon}</span>}
      <span>{children}</span>
    </span>
  )
}
