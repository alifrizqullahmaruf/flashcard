'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, CalendarCheck, Check, CircleCheck, CircleX, Eye, Layers, Repeat, Sprout, Trophy, X } from 'lucide-react'
import { getCategory, getLevel, type Word } from '@/lib/de/content'
import { getPractice, type Exercise } from '@/lib/de/exercises'
import {
  DAILY_NEW,
  bumpStreak,
  getDueAll,
  getDueGrammar,
  getNewWords,
  newLeftToday,
  review,
  reviewGrammar,
  type CardRef,
  type GrammarRef,
} from '@/lib/de/progress'
import { useProgress } from '@/lib/de/useProgress'
import { solution } from '@/lib/de/speech-texts'
import Speak, { speakDe } from '@/components/de/Speak'
import { ExerciseBody } from '@/components/de/TopicPractice'
import { BottomSheet, Confetti, Details, IconBadge, haptic, spoken } from '@/components/de/WordFaces'

/**
 * "Hari ini" — one daily queue (Anki-style):
 *  1. kartu jatuh tempo (semua kategori)
 *  2. kata baru (maks. 10/hari): kenalan → cek hafal beberapa kartu kemudian
 *  3. soal grammar jatuh tempo dari materi yang sudah dibaca/dikuasai
 */

const MAX_DUE = 40
const MAX_GRAMMAR = 5
const REQUEUE_AT = 3

type Item =
  | { kind: 'new'; id: number; ref: CardRef; w: Word }
  | { kind: 'card'; id: number; ref: CardRef; w: Word; fresh: boolean; tries: number }
  | { kind: 'grammar'; id: number; ref: GrammarRef; ex: Exercise; title: string }

let uid = 0

function buildQueue(due: CardRef[], fresh: CardRef[], gram: GrammarRef[]): Item[] {
  const word = (r: CardRef) => getCategory(r.level, r.cat)?.words.find((w) => w.de === r.word)
  const base: Item[] = []
  for (const r of due) {
    const w = word(r)
    if (w) base.push({ kind: 'card', id: uid++, ref: r, w, fresh: false, tries: 0 })
  }
  for (const r of fresh) {
    const w = word(r)
    if (w) base.push({ kind: 'new', id: uid++, ref: r, w })
  }
  const g: Item[] = []
  for (const r of gram) {
    const ex = getPractice(r.level, r.topic)?.items[r.idx]
    const title = getLevel(r.level)?.topics.find((t) => t.slug === r.topic)?.title ?? r.topic
    if (ex) g.push({ kind: 'grammar', id: uid++, ref: r, ex, title })
  }
  // spread grammar between the cards (every 4th slot)
  const out: Item[] = []
  base.forEach((it, i) => {
    out.push(it)
    if ((i + 1) % 4 === 0 && g.length) out.push(g.shift()!)
  })
  return [...out, ...g]
}

export default function DailySession() {
  const snap = useProgress(() => ({
    due: getDueAll().slice(0, MAX_DUE),
    fresh: getNewWords(newLeftToday()),
    gram: getDueGrammar(MAX_GRAMMAR),
  }))
  // build the queue once, when storage is readable
  const [queue, setQueue] = useState<Item[] | null>(null)
  const [total, setTotal] = useState(0)
  if (snap && !queue) {
    const q = buildQueue(snap.due, snap.fresh, snap.gram)
    setQueue(q)
    setTotal(q.length)
  }

  const [done, setDone] = useState(0)
  const [stats, setStats] = useState({ hafal: 0, belum: 0, baru: 0, grammarOk: 0, grammar: 0 })

  if (!queue) return <div className="skeleton h-80 rounded-card-lg" />
  if (total === 0) return <AllDone />

  const cur = queue[0]
  if (!cur) return <Finished stats={stats} />

  function advance(requeue?: Item) {
    setQueue((q) => {
      const rest = q!.slice(1)
      if (requeue) rest.splice(Math.min(REQUEUE_AT, rest.length), 0, requeue)
      if (!rest.length) bumpStreak()
      return rest
    })
    if (requeue) setTotal((t) => t + 1)
    setDone((d) => d + 1)
  }

  const remaining = queue.length
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 rounded-pill bg-bg-soft overflow-hidden">
          <div className="h-full bg-mint rounded-pill transition-all duration-500" style={{ width: `${(done / Math.max(total, 1)) * 100}%` }} />
        </div>
        <span className="text-sm font-extrabold text-ink-muted">{remaining} lagi</span>
      </div>

      <div key={cur.id} className="slide-up">
        {cur.kind === 'new' && (
          <NewWord
            w={cur.w}
            onNext={() => {
              setStats((s) => ({ ...s, baru: s.baru + 1 }))
              // check recall a few cards later
              advance({ kind: 'card', id: uid++, ref: cur.ref, w: cur.w, fresh: true, tries: 0 })
            }}
          />
        )}
        {cur.kind === 'card' && (
          <RecallCard
            item={cur}
            onRate={(good) => {
              // A word forgotten earlier in this session keeps its "tomorrow" schedule,
              // even if the learner gets it right on the retry.
              if (!(good && cur.tries > 0)) review(cur.ref.level, cur.ref.cat, cur.ref.word, good)
              setStats((s) => ({ ...s, hafal: s.hafal + (good ? 1 : 0), belum: s.belum + (good ? 0 : 1) }))
              // "Belum hafal" → once more in this session (max 2×), FSRS brings it back tomorrow
              advance(!good && cur.tries < 2 ? { ...cur, id: uid++, tries: cur.tries + 1 } : undefined)
            }}
          />
        )}
        {cur.kind === 'grammar' && (
          <GrammarTask
            item={cur}
            onDone={(ok) => {
              setStats((s) => ({ ...s, grammar: s.grammar + 1, grammarOk: s.grammarOk + (ok ? 1 : 0) }))
              advance()
            }}
          />
        )}
      </div>
    </div>
  )
}

/* ── item views ──────────────────────────────────────── */

function Label({ Icon, text }: { Icon: typeof Sprout; text: string }) {
  return (
    <p className="text-sm font-extrabold text-ink-muted flex items-center gap-1.5 mb-3">
      <Icon size={16} strokeWidth={2.4} />
      {text}
    </p>
  )
}

function NewWord({ w, onNext }: { w: Word; onNext: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <Label Icon={Sprout} text="Kata baru" />
      <div className="paper-card border-2 border-ink-faint rounded-card-lg p-5">
        <Details w={w} />
      </div>
      <button onClick={onNext} className="h-12 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-1.5">
        Mengerti, lanjut <ArrowRight size={18} strokeWidth={2.6} />
      </button>
    </div>
  )
}

function RecallCard({ item, onRate }: { item: Extract<Item, { kind: 'card' }>; onRate: (good: boolean) => void }) {
  const [shown, setShown] = useState(false)
  const { w } = item
  return (
    <div className="flex flex-col gap-4">
      <Label Icon={item.tries ? Repeat : item.fresh ? Sprout : Layers} text={item.tries ? 'Coba lagi' : item.fresh ? 'Masih ingat kata baru tadi?' : 'Ulang kartu'} />
      <div className="paper-card border-2 border-ink-faint rounded-card-lg p-5 min-h-[12rem] flex flex-col items-center justify-center text-center gap-2">
        <p className="text-xs font-bold text-ink-subtle uppercase tracking-wider">Apa bahasa Jermannya?</p>
        <p className="font-display font-extrabold text-3xl">{w.id}</p>
        {w.gender && <p className="text-xs text-ink-muted">Ingat juga artikelnya: der, die, atau das</p>}
      </div>
      {shown ? (
        <>
          <div className="paper-card border-2 border-ink-faint rounded-card-lg p-5 pop-in">
            <Details w={w} />
          </div>
          <p className="text-center text-sm font-bold text-ink-muted">Jawabanmu tadi benar?</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { haptic([25, 30, 25]); onRate(false) }} className="h-12 rounded-btn bg-surface border border-ink-faint text-ink font-medium btn-press flex items-center justify-center gap-1.5">
              <X size={18} strokeWidth={3} />Belum hafal
            </button>
            <button onClick={() => { haptic(15); onRate(true) }} className="h-12 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-1.5">
              <Check size={18} strokeWidth={3} />Hafal
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={() => {
            setShown(true)
            speakDe(spoken(w))
          }}
          className="py-3.5 rounded-btn bg-ink text-white font-extrabold btn-press flex items-center justify-center gap-1.5"
        >
          <Eye size={18} strokeWidth={2.6} />Tunjukkan jawaban
        </button>
      )}
    </div>
  )
}

function GrammarTask({ item, onDone }: { item: Extract<Item, { kind: 'grammar' }>; onDone: (ok: boolean) => void }) {
  const [fb, setFb] = useState<{ ok: boolean; msg: string } | null>(null)
  const sol = solution(item.ex)
  return (
    <div className="flex flex-col gap-3">
      <Label Icon={BookOpen} text={`Ulang grammar · ${item.title}`} />
      <ExerciseBody
        ex={item.ex}
        seed={item.id}
        locked={!!fb}
        onAnswer={(ok, msg = '') => {
          if (fb) return
          setFb({ ok, msg })
          reviewGrammar(item.ref.level, item.ref.topic, item.ref.idx, ok)
          haptic(ok ? 15 : [30, 40, 30])
          if (sol) speakDe(sol)
        }}
      />
      {fb && (
        <BottomSheet ok={fb.ok}>
          <p className={`font-display font-extrabold text-lg flex items-center gap-2 ${fb.ok ? 'text-mint-deep' : 'text-coral-deep'}`}>
            {fb.ok ? <CircleCheck size={22} strokeWidth={2.6} /> : <CircleX size={22} strokeWidth={2.6} />}
            {fb.ok ? 'Benar!' : 'Belum tepat'}
          </p>
          {fb.msg && <p className="text-sm font-bold text-ink">{fb.msg}</p>}
          {sol && (
            <div className="flex items-center gap-2 rounded-card bg-surface/70 px-3 py-2">
              <p className="flex-1 font-bold text-ink">{sol}</p>
              <Speak text={sol} size="sm" withSlow />
            </div>
          )}
          <p className="text-sm text-ink">{item.ex.explain}</p>
          <button onClick={() => onDone(fb.ok)} className={`py-3 rounded-btn text-white font-extrabold btn-press ${fb.ok ? 'bg-mint' : 'bg-coral'}`}>
            <span className="flex items-center justify-center gap-1.5">Lanjut <ArrowRight size={18} strokeWidth={2.6} /></span>
          </button>
        </BottomSheet>
      )}
    </div>
  )
}

/* ── end states ──────────────────────────────────────── */

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-card bg-bg-soft p-3">
      <p className="font-display font-extrabold text-xl">{value}</p>
      <p className="text-xs text-ink-muted font-bold">{label}</p>
    </div>
  )
}

function Finished({ stats }: { stats: { hafal: number; belum: number; baru: number; grammarOk: number; grammar: number } }) {
  return (
    <div className="paper-card border-2 border-ink-faint rounded-card-lg p-6 text-center flex flex-col gap-3 items-center bounce-in">
      <Confetti />
      <IconBadge bg="#FFF7D6" color="#F5B800"><Trophy size={30} /></IconBadge>
      <p className="font-display font-extrabold text-2xl">Tugas hari ini selesai!</p>
      <div className="grid grid-cols-2 gap-2 w-full">
        <Stat label="Kata baru" value={stats.baru} />
        <Stat label="Hafal" value={stats.hafal} />
        <Stat label="Belum hafal" value={stats.belum} />
        <Stat label="Grammar benar" value={`${stats.grammarOk}/${stats.grammar}`} />
      </div>
      <p className="text-sm text-ink-muted">Kata yang <b>belum hafal</b> muncul lagi besok. Yang <b>hafal</b> istirahat dulu beberapa hari.</p>
      <Link href="/de" className="w-full h-12 rounded-btn bg-ink text-white font-medium btn-press">Kembali ke Beranda</Link>
    </div>
  )
}

function AllDone() {
  return (
    <div className="paper-card border-2 border-ink-faint rounded-card-lg p-6 text-center flex flex-col gap-3 items-center">
      <IconBadge><CalendarCheck size={30} /></IconBadge>
      <p className="font-display font-extrabold text-xl">Semua beres untuk hari ini</p>
      <p className="text-sm text-ink-muted">
        Tidak ada kartu yang perlu diulang dan target {DAILY_NEW} kata baru sudah tercapai. Mau lanjut? Baca materi baru atau latih kartu per kategori.
      </p>
      <div className="grid grid-cols-2 gap-2 w-full">
        <Link href="/de/materi" className="h-12 rounded-btn bg-surface border border-ink-faint font-medium flex items-center justify-center gap-1.5"><BookOpen size={17} strokeWidth={2.4} />Materi</Link>
        <Link href="/de/kartu" className="h-12 rounded-btn bg-surface border border-ink-faint font-medium flex items-center justify-center gap-1.5"><Layers size={17} strokeWidth={2.4} />Kartu</Link>
      </div>
    </div>
  )
}
