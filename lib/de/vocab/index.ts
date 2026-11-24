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
import einkaufen from './a1/einkaufen'
import wohnen from './a1/wohnen'
import stadt from './a1/stadt'
import reisen from './a1/reisen'
import koerper from './a1/koerper'
import arbeit from './a1/arbeit'
import freizeit from './a1/freizeit'
import kommunikation from './a1/kommunikation'
import wetter from './a1/wetter'
import verben from './a1/verben'
import kleinwoerter from './a1/kleinwoerter'
import zahlen from './a1/zahlen'
import zeit from './a1/zeit'

export const CATEGORIES: Record<LevelId, Category[]> = {
  a1: [person, familie, zahlen, zeit, essen, einkaufen, wohnen, stadt, reisen, koerper, arbeit, schule, freizeit, kommunikation, wetter, farben, verben, kleinwoerter],
  a2: [],
  b1: [],
  b2: [],
  c1: [],
  c2: [],
}
