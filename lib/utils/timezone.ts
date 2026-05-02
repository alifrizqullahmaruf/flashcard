/**
 * Validate IANA timezone string. Use Intl.supportedValuesOf when available (Node 18+),
 * fallback to constructing DateTimeFormat (throws on invalid).
 */
export function isValidTimezone(tz: string): boolean {
  if (!tz || typeof tz !== 'string') return false

  // Modern: Intl.supportedValuesOf('timeZone') — Node 18+, browsers 2022+
  const supported = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf
  if (typeof supported === 'function') {
    return supported('timeZone').includes(tz)
  }

  // Fallback: construct DateTimeFormat — throws if invalid
  try {
    new Intl.DateTimeFormat('en-CA', { timeZone: tz })
    return true
  } catch {
    return false
  }
}

/**
 * Compute today's date in user's timezone, formatted as YYYY-MM-DD.
 * Server-side only — never trust client-supplied todayDate.
 */
export function computeTodayDate(timezone: string, now: Date = new Date()): string {
  if (!isValidTimezone(timezone)) {
    throw new Error(`Invalid timezone: ${timezone}`)
  }
  // 'en-CA' locale outputs YYYY-MM-DD natively
  return new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(now)
}

/**
 * Compute yesterday's date string in user's timezone.
 * Used for streak continuity check (current === yesterday + 1 day).
 */
export function computeYesterdayDate(timezone: string, now: Date = new Date()): string {
  const todayStr = computeTodayDate(timezone, now)
  const [y, m, d] = todayStr.split('-').map(Number)
  // Construct UTC date safely, subtract 1 day, format back
  const utc = new Date(Date.UTC(y, m - 1, d - 1))
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC' }).format(utc)
}

/**
 * Default timezone for users without one stored.
 * Asia/Jakarta is the primary user demographic per project context.
 */
export const DEFAULT_TIMEZONE = 'Asia/Jakarta'
