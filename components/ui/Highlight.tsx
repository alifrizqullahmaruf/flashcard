type Color = 'mint' | 'coral' | 'sun' | 'sky'

type Props = {
  children: React.ReactNode
  color?: Color
  className?: string
}

/**
 * Highlighter-style underline for emphasizing text.
 * Renders a translucent color band on the lower half of text — like real highlighter ink.
 *
 * @example
 *   <Highlight color="sun">inget selamanya</Highlight>
 */
export default function Highlight({ children, color = 'mint', className = '' }: Props) {
  return <span className={`highlight-${color} ${className}`}>{children}</span>
}
