type Color = 'mint' | 'coral' | 'sun'
type Tilt = 'left' | 'right' | 'none'

type Props = {
  children?: React.ReactNode
  color?: Color
  tilt?: Tilt
  className?: string
}

const TILT_CLASS: Record<Tilt, string> = {
  left: 'tilt-extra',
  right: 'tilt-soft',
  none: '',
}

/**
 * Washi-tape ornamental strip — for decorative accent on hero cards or empty states.
 * Diagonal stripes with soft fade edges (torn-tape feel).
 *
 * @example
 *   <TapeStrip color="mint" tilt="left">BARU</TapeStrip>
 */
export default function TapeStrip({
  children,
  color = 'mint',
  tilt = 'left',
  className = '',
}: Props) {
  return (
    <span className={`tape tape-${color} ${TILT_CLASS[tilt]} ${className}`}>
      {children}
    </span>
  )
}
