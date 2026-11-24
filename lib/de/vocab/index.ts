/**
 * Vocabulary per level. One file per category: lib/de/vocab/<level>/<slug>.ts
 * The array order = learning order (getNewWords serves new words in this order).
 * Every new word must pass scripts/de-vocab/validate.ts (gender/plural vs Wiktionary).
 */
import type { Category, LevelId } from '../content'
import person from './a1/person'
import familie from './a1/familie'
import essen from './a1/essen'
import schule from './a1/schule'
import farben from './a1/farben'
import zahlen from './a1/zahlen'
import zeit from './a1/zeit'

export const CATEGORIES: Record<LevelId, Category[]> = {
  a1: [person, familie, zahlen, zeit, essen, schule, farben],
  a2: [],
  b1: [],
  b2: [],
  c1: [],
  c2: [],
}
