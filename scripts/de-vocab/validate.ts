/**
 * Validates German vocabulary against de.wiktionary.org:
 *   - nouns: gender (der/die/das) and nominative plural
 *   - all:   required fields, duplicates, example sentence uses the word
 *
 * Run:  npx tsx scripts/de-vocab/validate.ts [level]      (default: all levels)
 * Exit code 1 if any MISMATCH, so it can gate commits.
 * Responses are cached in scripts/de-vocab/.cache (git-ignored).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { CATEGORIES, type LevelId, type Word } from '../../lib/de/content'

const CACHE = join(__dirname, '.cache')
const UA = 'HafalinMVP/0.1 (educational prototype; vocabulary check)'
const GENDER: Record<string, Word['gender']> = { m: 'der', f: 'die', n: 'das' }

type Report = { level: string; cat: string; word: string; status: 'OK' | 'MISMATCH' | 'WARN' | 'NOT_FOUND'; note: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const cacheFile = (title: string) => join(CACHE, encodeURIComponent(title) + '.txt')

/** Fetch many pages in one request (≤ 50 titles) — far fewer requests than one-by-one. */
async function prefetch(titles: string[]) {
  if (!existsSync(CACHE)) mkdirSync(CACHE, { recursive: true })
  const todo = [...new Set(titles)].filter((t) => !existsSync(cacheFile(t)))
  for (let i = 0; i < todo.length; i += 50) {
    const batch = todo.slice(i, i + 50)
    const url =
      'https://de.wiktionary.org/w/api.php?action=query&format=json&formatversion=2&redirects=1' +
      `&prop=revisions&rvprop=content&rvslots=main&titles=${encodeURIComponent(batch.join('|'))}`
    let json: {
      query?: {
        pages?: { title: string; missing?: boolean; revisions?: { slots: { main: { content: string } } }[] }[]
        redirects?: { from: string; to: string }[]
        normalized?: { from: string; to: string }[]
      }
    } | null = null
    for (let attempt = 0; attempt < 6 && !json; attempt++) {
      const res = await fetch(url, { headers: { 'User-Agent': UA } })
      if (res.status === 429 || res.status >= 500) {
        const wait = Number(res.headers.get('retry-after') ?? 0) * 1000 || 3000 * 2 ** attempt
        console.log(`  ${res.status}, tunggu ${wait / 1000}s`)
        await sleep(wait)
        continue
      }
      json = await res.json()
    }
    if (!json) throw new Error('Wiktionary unreachable')
    const alias = new Map<string, string>()
    for (const r of [...(json.query?.normalized ?? []), ...(json.query?.redirects ?? [])]) alias.set(r.to, r.from)
    const got = new Set<string>()
    for (const p of json.query?.pages ?? []) {
      const text = p.missing ? '__MISSING__' : (p.revisions?.[0]?.slots.main.content ?? '__MISSING__')
      let t = p.title
      writeFileSync(cacheFile(t), text)
      got.add(t)
      while (alias.has(t)) {
        t = alias.get(t)!
        writeFileSync(cacheFile(t), text)
        got.add(t)
      }
    }
    for (const t of batch) if (!got.has(t)) writeFileSync(cacheFile(t), '__MISSING__')
    await sleep(1000)
  }
}

async function wikitext(title: string): Promise<string | null> {
  if (!existsSync(cacheFile(title))) await prefetch([title])
  const cached = readFileSync(cacheFile(title), 'utf8')
  return cached === '__MISSING__' ? null : cached
}

/** Only the German-language section of the page. */
function germanSection(text: string): string {
  const start = text.search(/\{\{Sprache\|Deutsch\}\}/)
  if (start < 0) return ''
  const rest = text.slice(start + 10)
  const next = rest.search(/\n== .*\(\{\{Sprache\|(?!Deutsch)/)
  return next < 0 ? rest : rest.slice(0, next)
}

function field(sec: string, name: string): string[] {
  const re = new RegExp(`\\|${name}(?: \\d)?=([^\\n|]*)`, 'g')
  return [...sec.matchAll(re)].map((m) => m[1].trim()).filter(Boolean)
}

async function checkNoun(w: Word): Promise<{ status: Report['status']; note: string }> {
  const text = await wikitext(w.de)
  if (!text) return { status: 'NOT_FOUND', note: 'halaman tidak ada' }
  const sec = germanSection(text)
  if (!sec) return { status: 'NOT_FOUND', note: 'tidak ada bagian Deutsch' }

  const genders = new Set(field(sec, 'Genus').map((g) => GENDER[g]).filter(Boolean))
  const plurals = new Set(field(sec, 'Nominativ Plural').map((p) => p.replace(/^—$|^-$/, '–')))
  const notes: string[] = []
  let status: Report['status'] = 'OK'

  if (w.plural === 'Pl.') {
    // plural-only noun (e.g. Eltern): Wiktionary marks Genus=0 / no singular
    if (genders.size && !field(sec, 'Genus').includes('0')) notes.push(`Wiktionary punya genus ${[...genders].join('/')}`)
    return { status: notes.length ? 'WARN' : 'OK', note: notes.join('; ') || 'hanya jamak' }
  }

  if (!genders.size) {
    status = 'WARN'
    notes.push('genus tidak terbaca')
  } else if (!w.gender || !genders.has(w.gender)) {
    status = 'MISMATCH'
    notes.push(`gender: kita=${w.gender ?? '-'}, Wiktionary=${[...genders].join('/')}`)
  }

  const ours = w.plural?.replace(/^die /, '')
  if (ours === '–') {
    if (plurals.size && ![...plurals].includes('–')) {
      if (status === 'OK') status = 'WARN'
      notes.push(`kita: tanpa jamak, Wiktionary: ${[...plurals].join(', ')}`)
    }
  } else if (ours) {
    if (!plurals.size) {
      if (status === 'OK') status = 'WARN'
      notes.push('jamak tidak terbaca')
    } else if (!plurals.has(ours)) {
      status = 'MISMATCH'
      notes.push(`jamak: kita=${ours}, Wiktionary=${[...plurals].join(', ')}`)
    }
  } else {
    if (status === 'OK') status = 'WARN'
    notes.push('field plural kosong')
  }
  return { status, note: notes.join('; ') }
}

function structural(level: string, cat: string, w: Word, seen: Map<string, string>): Report[] {
  const out: Report[] = []
  const r = (status: Report['status'], note: string) => out.push({ level, cat, word: w.de, status, note })
  for (const f of ['de', 'id', 'kind', 'example', 'exampleId'] as const) if (!w[f]) r('MISMATCH', `field ${f} kosong`)
  if (w.kind === 'noun' && !w.gender) r('MISMATCH', 'nomen tanpa gender')
  if (w.kind === 'verb' && !w.forms) r('WARN', 'verba tanpa forms (er-Form · Perfekt)')
  const key = `${w.de}|${w.kind}`
  if (seen.has(key)) r('MISMATCH', `duplikat (juga di ${seen.get(key)})`)
  seen.set(key, cat)
  const stem = w.de.toLowerCase().slice(0, Math.max(3, Math.min(5, w.de.length - 2)))
  if (!w.example.toLowerCase().includes(stem)) r('WARN', 'contoh kalimat tidak memuat kata ini (cek bentuk)')
  return out
}

async function main() {
  const only = process.argv[2] as LevelId | undefined
  const reports: Report[] = []
  const nouns = Object.entries(CATEGORIES)
    .filter(([level]) => !only || level === only)
    .flatMap(([, cats]) => cats.flatMap((c) => c.words.filter((w) => w.kind === 'noun').map((w) => w.de)))
  await prefetch(nouns)
  for (const [level, cats] of Object.entries(CATEGORIES)) {
    if (only && level !== only) continue
    const seen = new Map<string, string>()
    for (const c of cats) {
      for (const w of c.words) {
        reports.push(...structural(level, c.slug, w, seen))
        if (w.kind === 'noun') {
          const { status, note } = await checkNoun(w)
          reports.push({ level, cat: c.slug, word: w.de, status, note })
        }
      }
    }
  }
  const bad = reports.filter((r) => r.status !== 'OK')
  for (const r of bad) console.log(`${r.status.padEnd(9)} ${r.level}/${r.cat.padEnd(12)} ${r.word.padEnd(16)} ${r.note}`)
  const count = (s: Report['status']) => reports.filter((r) => r.status === s).length
  console.log(`\nOK ${count('OK')} · WARN ${count('WARN')} · NOT_FOUND ${count('NOT_FOUND')} · MISMATCH ${count('MISMATCH')}`)
  if (count('MISMATCH')) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
