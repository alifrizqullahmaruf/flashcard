type Props = {
  className?: string
  /** Color of the line. Defaults to ink-faint (subtle border) */
  color?: string
}

/**
 * Pencil-sketch divider — replaces flat <hr> with a hand-drawn-feel line.
 * Uses SVG with intentional imperfections (slight wobble, varying opacity).
 */
export default function PencilDivider({ className = '', color = '#9CA3AF' }: Props) {
  return (
    <div className={`w-full ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 400 8"
        preserveAspectRatio="none"
        className="w-full h-2 opacity-60"
      >
        <path
          d="M2 4 Q 50 2, 100 4 T 200 4 T 300 3.5 T 398 4"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Secondary tiny stroke for hand-drawn double-line feel */}
        <path
          d="M5 5 Q 80 6, 160 4.5 T 320 5 L 395 5"
          stroke={color}
          strokeWidth="0.6"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </svg>
    </div>
  )
}
