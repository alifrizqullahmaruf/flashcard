'use client'
import { useEffect, useRef, useState } from 'react'
import { Check, Mic, Pause, Play, RotateCcw, Square, Volume2, X } from 'lucide-react'
import EXAM_AUDIO from '@/lib/de/exam-audio.json'
import { audioId, HOEREN, LESEN, SCHREIBEN, SPRECHEN, VORSTELLEN } from '@/lib/de/pruefung'
import { analyzeMessage, fieldCorrect, nachrichtPoints, type PointRating } from '@/lib/de/pruefung/score'
import type { Line, ModuleId } from '@/lib/de/pruefung/types'

const AUDIO = EXAM_AUDIO as Record<string, string>

export type Mode = 'latihan' | 'simulasi'
export interface PartResult {
  raw: number
  max: number
}
export interface PartProps {
  set: string
  teil: number
  mode: Mode
  /** latihan: called when the learner checks; simulasi: called on "Lanjut" (no feedback shown) */
  onDone: (r: PartResult) => void
  /** simulasi: the module timer ran out → submit what is there */
  timeUp?: boolean
}

/* ── small building blocks ─────────────────────────── */

const card = 'bg-surface border border-ink-faint rounded-card-lg p-4'

function choiceClass(selected: boolean, reveal: boolean, correct: boolean) {
  if (reveal && correct) return 'border-mint bg-mint-soft text-ink'
  if (reveal && selected && !correct) return 'border-coral bg-coral-soft text-ink'
  return selected ? 'border-ink bg-ink text-white' : 'border-ink-faint bg-surface'
}

function Choice({ label, selected, reveal, correct, onClick }: { label: string; selected: boolean; reveal: boolean; correct: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={reveal}
      onClick={onClick}
      className={`w-full text-left px-3.5 py-3 rounded-btn border-2 font-medium text-[15px] btn-press transition flex items-center gap-2 ${choiceClass(selected, reveal, correct)}`}
    >
      <span className="flex-1">{label}</span>
      {reveal && correct && <Check size={18} className="text-mint-deep" />}
      {reveal && selected && !correct && <X size={18} className="text-coral-deep" />}
    </button>
  )
}

function RichtigFalsch({ value, reveal, answer, onChange }: { value: boolean | undefined; reveal: boolean; answer: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[true, false].map((v) => (
        <Choice key={String(v)} label={v ? 'Richtig' : 'Falsch'} selected={value === v} reveal={reveal} correct={answer === v} onClick={() => onChange(v)} />
      ))}
    </div>
  )
}

function Explain({ ok, text }: { ok: boolean; text: string }) {
  return (
    <p className={`text-sm rounded-btn px-3 py-2 ${ok ? 'bg-mint-soft' : 'bg-coral-soft'}`}>
      <b>{ok ? 'Benar.' : 'Kurang tepat.'}</b> {text}
    </p>
  )
}

function Submit({ mode, reveal, disabled, onCheck, onRestart }: { mode: Mode; reveal: boolean; disabled?: boolean; onCheck: () => void; onRestart?: () => void }) {
  if (reveal && onRestart)
    return (
      <button onClick={onRestart} className="h-12 rounded-btn bg-surface border border-ink-faint font-medium btn-press flex items-center justify-center gap-1.5">
        <RotateCcw size={16} />Ulangi
      </button>
    )
  if (reveal) return null
  return (
    <button onClick={onCheck} disabled={disabled} className="h-12 rounded-btn bg-ink text-white font-extrabold btn-press disabled:opacity-40">
      {mode === 'latihan' ? 'Periksa jawaban' : 'Lanjut'}
    </button>
  )
}

function ScoreLine({ raw, max }: PartResult) {
  const pct = max ? Math.round((raw / max) * 100) : 0
  return (
    <div className={`${card} flex items-center justify-between`}>
      <span className="font-medium">Skor bagian ini</span>
      <span className="text-xl font-semibold">
        {raw}/{max} <span className="text-sm text-ink-muted">({pct}%)</span>
      </span>
    </div>
  )
}

/** Plays a pre-built exam clip, at most `maxPlays` times (unlimited once reviewed). */
export function ExamAudio({ id, maxPlays, unlimited }: { id: string; maxPlays: number; unlimited?: boolean }) {
  const src = AUDIO[audioId(id)] ?? AUDIO[id]
  const ref = useRef<HTMLAudioElement | null>(null)
  const [plays, setPlays] = useState(0)
  const [playing, setPlaying] = useState(false)
  const left = unlimited ? Infinity : maxPlays - plays
  useEffect(() => () => ref.current?.pause(), [])
  if (!src) return <p className="text-sm text-coral-deep">Audio belum tersedia.</p>

  function toggle() {
    if (!ref.current) {
      ref.current = new Audio(src)
      ref.current.onended = () => setPlaying(false)
    }
    if (playing) {
      ref.current.pause()
      setPlaying(false)
      return
    }
    if (left <= 0) return
    ref.current.currentTime = 0
    void ref.current.play()
    setPlaying(true)
    setPlays((p) => p + 1)
  }
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!playing && left <= 0}
      className="h-11 px-4 rounded-btn bg-ink text-white font-medium btn-press disabled:opacity-40 flex items-center gap-2 w-fit"
    >
      {playing ? <Pause size={16} /> : <Play size={16} />}
      {playing ? 'Berhenti' : left <= 0 ? 'Sudah diputar' : unlimited ? 'Putar' : `Putar (sisa ${left}×)`}
    </button>
  )
}

function Transcript({ lines }: { lines: Line[] }) {
  return (
    <div className="text-sm bg-bg-soft rounded-btn px-3 py-2 flex flex-col gap-1">
      {lines.map((l, i) => (
        <p key={i}>
          {lines.length > 1 && <b className="text-ink-muted">{l.who === 'f' ? 'Frau' : 'Mann'}: </b>}
          {l.text}
        </p>
      ))}
    </div>
  )
}

/* ── Lesen ─────────────────────────────────────────── */

function LesenPart({ set, teil, mode, onDone, timeUp }: PartProps) {
  const s = LESEN.find((x) => x.id === set)!
  const [ans, setAns] = useState<Record<string, boolean | 'a' | 'b'>>({})
  const [reveal, setReveal] = useState(false)
  const keys =
    teil === 1 ? s.teil1.flatMap((t) => t.items.map((_, i) => `${t.id}-${i}`)) : teil === 2 ? s.teil2.map((x) => x.id) : s.teil3.map((x) => x.id)
  const correct = (k: string) => {
    if (teil === 1) {
      const t = s.teil1.find((x) => k.startsWith(x.id))!
      return ans[k] === t.items[Number(k.slice(t.id.length + 1))].answer
    }
    if (teil === 2) return ans[k] === s.teil2.find((x) => x.id === k)!.answer
    return ans[k] === s.teil3.find((x) => x.id === k)!.answer
  }
  const result = () => ({ raw: keys.filter(correct).length, max: keys.length })
  const check = () => {
    if (mode === 'latihan') setReveal(true)
    onDone(result())
  }
  useTimeUp(timeUp, check)
  const set1 = (k: string, v: boolean | 'a' | 'b') => setAns((a) => ({ ...a, [k]: v }))
  const show = reveal && mode === 'latihan'

  return (
    <div className="flex flex-col gap-4">
      {teil === 1 &&
        s.teil1.map((t) => (
          <div key={t.id} className="flex flex-col gap-3">
            <div className={`${card} whitespace-pre-line text-[15px] leading-relaxed`}>
              <p className="de-label mb-2">{t.kind === 'email' ? `E-Mail · ${t.from}${t.subject ? ` · ${t.subject}` : ''}` : t.kind === 'sms' ? `SMS · ${t.from}` : `Notiz · ${t.from}`}</p>
              {t.text}
            </div>
            {t.items.map((it, i) => {
              const k = `${t.id}-${i}`
              return (
                <div key={k} className="flex flex-col gap-2">
                  <p className="font-medium">{it.statement}</p>
                  <RichtigFalsch value={ans[k] as boolean | undefined} reveal={show} answer={it.answer} onChange={(v) => set1(k, v)} />
                  {show && <Explain ok={correct(k)} text={it.explain} />}
                </div>
              )
            })}
          </div>
        ))}
      {teil === 2 &&
        s.teil2.map((t) => (
          <div key={t.id} className="flex flex-col gap-2">
            <p className="font-medium">{t.situation}</p>
            {(['a', 'b'] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                disabled={show}
                onClick={() => set1(t.id, opt)}
                className={`text-left rounded-card-lg border-2 p-3 btn-press transition ${choiceClass(ans[t.id] === opt, show, t.answer === opt)}`}
              >
                <p className="text-xs font-extrabold opacity-70">{opt}</p>
                <p className="font-semibold">{t[opt].title}</p>
                <p className="text-sm whitespace-pre-line opacity-90">{t[opt].text}</p>
              </button>
            ))}
            {show && <Explain ok={correct(t.id)} text={t.explain} />}
          </div>
        ))}
      {teil === 3 &&
        s.teil3.map((t) => (
          <div key={t.id} className="flex flex-col gap-2">
            <p className="text-xs text-ink-muted">{t.place}</p>
            <div className="rounded-card-lg border-2 border-ink bg-sun-soft px-4 py-3 font-semibold whitespace-pre-line text-center">{t.sign}</div>
            <p className="font-medium">{t.statement}</p>
            <RichtigFalsch value={ans[t.id] as boolean | undefined} reveal={show} answer={t.answer} onChange={(v) => set1(t.id, v)} />
            {show && <Explain ok={correct(t.id)} text={t.explain} />}
          </div>
        ))}
      {show && <ScoreLine {...result()} />}
      <Submit mode={mode} reveal={show} disabled={mode === 'latihan' && keys.some((k) => ans[k] === undefined)} onCheck={check} onRestart={() => (setAns({}), setReveal(false))} />
    </div>
  )
}

/* ── Hören ─────────────────────────────────────────── */

function HoerenPart({ set, teil, mode, onDone, timeUp }: PartProps) {
  const s = HOEREN.find((x) => x.id === set)!
  const [ans, setAns] = useState<Record<string, number | boolean>>({})
  const [reveal, setReveal] = useState(false)
  const [round, setRound] = useState(0) // remounts the players on "Ulangi"
  const items = teil === 1 ? s.teil1 : teil === 2 ? s.teil2 : s.teil3
  const plays = teil === 2 ? 1 : 2
  const correct = (id: string) => ans[id] === items.find((x) => x.id === id)!.answer
  const result = () => ({ raw: items.filter((x) => correct(x.id)).length, max: items.length })
  const check = () => {
    if (mode === 'latihan') setReveal(true)
    onDone(result())
  }
  useTimeUp(timeUp, check)
  const show = reveal && mode === 'latihan'

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-muted">
        {plays === 1 ? 'Setiap pengumuman hanya bisa diputar 1×, seperti di ujian.' : 'Setiap audio bisa diputar 2×, seperti di ujian.'} Baca soal dulu sebelum memutar.
      </p>
      {items.map((it, n) => (
        <div key={`${it.id}-${round}`} className={`${card} flex flex-col gap-3`}>
          <p className="de-label">Nomor {n + 1}</p>
          <p className="font-medium">{'q' in it ? it.q : it.statement}</p>
          <ExamAudio id={it.id} maxPlays={plays} unlimited={show} />
          {'options' in it ? (
            <div className="flex flex-col gap-2">
              {it.options.map((o, i) => (
                <Choice key={o} label={`${'abc'[i]}  ${o}`} selected={ans[it.id] === i} reveal={show} correct={it.answer === i} onClick={() => setAns((a) => ({ ...a, [it.id]: i }))} />
              ))}
            </div>
          ) : (
            <RichtigFalsch value={ans[it.id] as boolean | undefined} reveal={show} answer={it.answer} onChange={(v) => setAns((a) => ({ ...a, [it.id]: v }))} />
          )}
          {show && (
            <>
              <Explain ok={correct(it.id)} text={it.explain} />
              <Transcript lines={it.lines} />
            </>
          )}
        </div>
      ))}
      {show && <ScoreLine {...result()} />}
      <Submit
        mode={mode}
        reveal={show}
        disabled={mode === 'latihan' && items.some((x) => ans[x.id] === undefined)}
        onCheck={check}
        onRestart={() => (setAns({}), setReveal(false), setRound((r) => r + 1))}
      />
    </div>
  )
}

/* ── Schreiben ─────────────────────────────────────── */

const RATING_LABEL: Record<PointRating, string> = { full: 'Lengkap', half: 'Sebagian', none: 'Tidak ada' }

function SchreibenPart({ set, teil, mode, onDone, timeUp }: PartProps) {
  const s = SCHREIBEN.find((x) => x.id === set)!
  const [fields, setFields] = useState<string[]>(['', '', '', '', ''])
  const [text, setText] = useState('')
  const [stage, setStage] = useState<'write' | 'rate' | 'done'>('write')
  const [ratings, setRatings] = useState<(PointRating | null)[]>([null, null, null])
  const f = s.teil1
  const n = s.teil2
  const a = analyzeMessage(text, n)

  const finishForm = () => {
    const raw = f.fields.filter((x, i) => fieldCorrect(x, fields[i])).length
    if (mode === 'latihan') setStage('done')
    onDone({ raw, max: f.fields.length })
  }
  const finishMessage = (r: (PointRating | null)[]) => {
    const raw = nachrichtPoints(r.map((x) => x ?? 'none'), a.hasGreeting, a.hasClosing)
    setStage('done')
    onDone({ raw, max: 10 })
  }
  useTimeUp(timeUp, () => (teil === 1 ? finishForm() : stage === 'write' ? setStage('rate') : finishMessage(ratings)))

  if (teil === 1) {
    const show = stage === 'done' && mode === 'latihan'
    return (
      <div className="flex flex-col gap-4">
        <div className={`${card} text-[15px] leading-relaxed`}>
          <p className="de-label mb-2">Situasi</p>
          {f.situation}
        </div>
        <div className={`${card} flex flex-col gap-3`}>
          <p className="font-semibold">{f.title}</p>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-ink-muted">{f.example.label} (contoh)</span>
            <input value={f.example.value} disabled className="px-3 py-2.5 rounded-btn border border-ink-faint bg-bg-soft" />
          </label>
          {f.fields.map((fl, i) => {
            const ok = fieldCorrect(fl, fields[i])
            return (
              <label key={fl.label} className="flex flex-col gap-1">
                <span className="text-xs font-bold text-ink-muted">{fl.label}</span>
                <input
                  value={fields[i]}
                  disabled={show}
                  autoComplete="off"
                  onChange={(e) => setFields((v) => v.map((x, j) => (j === i ? e.target.value : x)))}
                  className={`px-3 py-2.5 rounded-btn border bg-surface outline-none focus:border-ink ${show ? (ok ? 'border-mint bg-mint-soft' : 'border-coral bg-coral-soft') : 'border-ink-faint'}`}
                />
                {show && !ok && <span className="text-xs text-coral-deep">Jawaban: {fl.accept[0]}</span>}
              </label>
            )
          })}
        </div>
        {show && <ScoreLine raw={f.fields.filter((x, i) => fieldCorrect(x, fields[i])).length} max={5} />}
        <Submit mode={mode} reveal={show} onCheck={finishForm} onRestart={() => (setFields(['', '', '', '', '']), setStage('write'))} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className={`${card} text-[15px] leading-relaxed flex flex-col gap-2`}>
        <p className="de-label">Situasi · pakai „{n.register}“</p>
        <p>{n.situation}</p>
        <ul className="list-disc pl-5 text-sm">
          {n.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p className="text-xs text-ink-muted">Tulis sekitar 30 kata. Jangan lupa sapaan dan salam penutup.</p>
      </div>
      <textarea
        value={text}
        disabled={stage !== 'write'}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        spellCheck={false}
        placeholder={n.register === 'du' ? 'Lieber …,' : 'Sehr geehrte Damen und Herren,'}
        className="w-full px-4 py-3 rounded-card-lg border border-ink-faint bg-surface outline-none focus:border-ink text-[15px] leading-relaxed"
      />
      <div className="flex flex-wrap gap-2 text-xs font-bold">
        <span className={`px-2.5 py-1 rounded-pill ${a.words >= 25 ? 'bg-mint-soft' : 'bg-bg-soft text-ink-muted'}`}>{a.words} kata</span>
        <span className={`px-2.5 py-1 rounded-pill ${a.hasGreeting ? 'bg-mint-soft' : 'bg-bg-soft text-ink-muted'}`}>Sapaan {a.hasGreeting ? '✓' : '–'}</span>
        <span className={`px-2.5 py-1 rounded-pill ${a.hasClosing ? 'bg-mint-soft' : 'bg-bg-soft text-ink-muted'}`}>Salam penutup {a.hasClosing ? '✓' : '–'}</span>
      </div>

      {stage === 'write' && (
        <button onClick={() => setStage('rate')} disabled={!text.trim()} className="h-12 rounded-btn bg-ink text-white font-extrabold btn-press disabled:opacity-40">
          Selesai menulis
        </button>
      )}

      {stage !== 'write' && (
        <div className={`${card} flex flex-col gap-3`}>
          <p className="font-semibold">Nilai sendiri: apakah tiap poin ada di pesanmu?</p>
          <p className="text-xs text-ink-muted">Penguji memberi 3 poin jika lengkap & bisa dipahami, 1,5 jika sebagian, 0 jika tidak ada. Tanda ✓ hanya petunjuk dari kata kunci.</p>
          {n.points.map((p, i) => (
            <div key={p} className="flex flex-col gap-1.5">
              <p className="text-sm font-medium">
                {i + 1}. {p} {a.cueHits[i] && <span className="text-mint-deep">✓</span>}
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {(['full', 'half', 'none'] as PointRating[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    disabled={stage === 'done'}
                    onClick={() => setRatings((v) => v.map((x, j) => (j === i ? r : x)))}
                    className={`py-2 rounded-btn border-2 text-sm font-bold btn-press ${ratings[i] === r ? 'border-ink bg-ink text-white' : 'border-ink-faint bg-surface'}`}
                  >
                    {RATING_LABEL[r]}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {stage === 'done' ? (
            <>
              <ScoreLine raw={nachrichtPoints(ratings.map((x) => x ?? 'none'), a.hasGreeting, a.hasClosing)} max={10} />
              <div className="text-sm bg-bg-soft rounded-btn px-3 py-2 whitespace-pre-line">
                <p className="de-label mb-1">Contoh jawaban</p>
                {n.model}
              </div>
              {mode === 'latihan' && (
                <button onClick={() => (setText(''), setRatings([null, null, null]), setStage('write'))} className="h-12 rounded-btn bg-surface border border-ink-faint font-medium btn-press flex items-center justify-center gap-1.5">
                  <RotateCcw size={16} />Tulis lagi
                </button>
              )}
            </>
          ) : (
            <button onClick={() => finishMessage(ratings)} disabled={ratings.some((r) => !r)} className="h-12 rounded-btn bg-ink text-white font-extrabold btn-press disabled:opacity-40">
              {mode === 'latihan' ? 'Lihat skor' : 'Lanjut'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Sprechen ──────────────────────────────────────── */

function useRecorder() {
  const [url, setUrl] = useState<string | null>(null)
  const [rec, setRec] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mr = useRef<MediaRecorder | null>(null)
  useEffect(() => () => mr.current?.stream.getTracks().forEach((t) => t.stop()), [])
  async function start() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const chunks: Blob[] = []
      const r = new MediaRecorder(stream)
      r.ondataavailable = (e) => chunks.push(e.data)
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        setUrl((old) => {
          if (old) URL.revokeObjectURL(old)
          return URL.createObjectURL(new Blob(chunks, { type: r.mimeType }))
        })
      }
      r.start()
      mr.current = r
      setRec(true)
    } catch {
      setError('Mikrofon tidak bisa dipakai. Izinkan akses mikrofon, atau latihan dengan berbicara keras saja.')
    }
  }
  function stop() {
    mr.current?.stop()
    setRec(false)
  }
  return { url, rec, error, start, stop }
}

interface SpeakTask {
  key: string
  title: string
  prompt: React.ReactNode
  modelId: string
  model: string
  weight: number
}

function SpeakCard({ task, rating, onRate, locked }: { task: SpeakTask; rating: PointRating | null; onRate: (r: PointRating) => void; locked: boolean }) {
  const r = useRecorder()
  const [showModel, setShowModel] = useState(false)
  return (
    <div className={`${card} flex flex-col gap-3`}>
      <p className="de-label">{task.title}</p>
      <div className="font-medium">{task.prompt}</div>
      <div className="flex flex-wrap gap-2">
        {r.rec ? (
          <button onClick={r.stop} className="h-11 px-4 rounded-btn bg-coral text-white font-medium btn-press flex items-center gap-2">
            <Square size={16} />Berhenti
          </button>
        ) : (
          <button onClick={r.start} className="h-11 px-4 rounded-btn bg-ink text-white font-medium btn-press flex items-center gap-2">
            <Mic size={16} />
            {r.url ? 'Rekam ulang' : 'Rekam jawaban'}
          </button>
        )}
        <button onClick={() => setShowModel((v) => !v)} className="h-11 px-4 rounded-btn bg-surface border border-ink-faint font-medium btn-press flex items-center gap-2">
          <Volume2 size={16} />
          {showModel ? 'Tutup contoh' : 'Lihat contoh'}
        </button>
      </div>
      {r.error && <p className="text-sm text-coral-deep">{r.error}</p>}
      {r.url && <audio controls src={r.url} className="w-full h-10" />}
      {showModel && (
        <div className="flex flex-col gap-2 bg-bg-soft rounded-btn px-3 py-2">
          <p className="text-sm">{task.model}</p>
          <ExamAudio id={task.modelId} maxPlays={Infinity} unlimited />
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-ink-muted">Bandingkan rekamanmu dengan contoh, lalu nilai sendiri:</p>
        <div className="grid grid-cols-3 gap-1.5">
          {(['full', 'half', 'none'] as PointRating[]).map((x) => (
            <button
              key={x}
              type="button"
              disabled={locked}
              onClick={() => onRate(x)}
              className={`py-2 rounded-btn border-2 text-sm font-bold btn-press ${rating === x ? 'border-ink bg-ink text-white' : 'border-ink-faint bg-surface'}`}
            >
              {x === 'full' ? 'Lancar' : x === 'half' ? 'Sebagian' : 'Belum bisa'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function sprechenTasks(set: string, teil: number, mode: Mode): SpeakTask[] {
  const s = SPRECHEN.find((x) => x.id === set)!
  if (teil === 1)
    return [
      { key: 'intro', title: 'Perkenalkan diri', prompt: <span className="flex flex-wrap gap-1.5">{VORSTELLEN.prompts.map((p) => <span key={p} className="px-2 py-0.5 rounded-pill bg-bg-soft text-sm">{p}</span>)}</span>, modelId: 'exam-vorstellen', model: VORSTELLEN.model, weight: 1 },
      { key: 'spell', title: 'Mengeja', prompt: VORSTELLEN.spell.q, modelId: 'exam-spell', model: VORSTELLEN.spell.model, weight: 1 },
      { key: 'number', title: 'Menyebut angka', prompt: VORSTELLEN.number.q, modelId: 'exam-number', model: VORSTELLEN.number.model, weight: 1 },
    ]
  if (teil === 2) {
    const topics = mode === 'simulasi' ? s.teil2.slice(0, 1) : s.teil2
    return topics.flatMap((t, i) =>
      t.cards.map((c, j) => ({
        key: `${i}-${j}`,
        title: `Thema: ${t.title}`,
        prompt: (
          <span>
            Buat pertanyaan dengan kata <b className="px-2 py-0.5 rounded-btn border-2 border-ink">{c.word}</b>, lalu jawab pertanyaan itu sendiri.
          </span>
        ),
        modelId: `exam-${s.id}-sp2-${i}-${j}`,
        model: `${c.question} – ${c.answer}`,
        weight: 2,
      })),
    )
  }
  const cards = mode === 'simulasi' ? s.teil3.slice(0, 3) : s.teil3
  return cards.map((c, i) => ({
    key: String(i),
    title: 'Bitte',
    prompt: (
      <span>
        {c.situation} Minta dengan sopan: <b className="px-2 py-0.5 rounded-btn border-2 border-ink">{c.word}</b>
      </span>
    ),
    modelId: `exam-${s.id}-sp3-${i}`,
    model: `${c.request} – ${c.reply}`,
    weight: 2,
  }))
}

function SprechenPart({ set, teil, mode, onDone, timeUp }: PartProps) {
  const tasks = sprechenTasks(set, teil, mode)
  const [ratings, setRatings] = useState<Record<string, PointRating>>({})
  const [done, setDone] = useState(false)
  const value: Record<PointRating, number> = { full: 1, half: 0.5, none: 0 }
  const result = () => ({ raw: tasks.reduce((n, t) => n + t.weight * value[ratings[t.key] ?? 'none'], 0), max: tasks.reduce((n, t) => n + t.weight, 0) })
  const check = () => {
    if (mode === 'latihan') setDone(true)
    onDone(result())
  }
  useTimeUp(timeUp, check)
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-muted">Di ujian kamu berbicara dengan peserta lain dan penguji. Di sini: rekam jawabanmu, dengarkan, bandingkan dengan contoh, lalu nilai dengan jujur.</p>
      {tasks.map((t) => (
        <SpeakCard key={t.key} task={t} rating={ratings[t.key] ?? null} locked={done} onRate={(r) => setRatings((v) => ({ ...v, [t.key]: r }))} />
      ))}
      {done && <ScoreLine {...result()} />}
      <Submit mode={mode} reveal={done} disabled={tasks.some((t) => !ratings[t.key])} onCheck={check} onRestart={() => (setRatings({}), setDone(false))} />
    </div>
  )
}

/* ── shared ────────────────────────────────────────── */

function useTimeUp(timeUp: boolean | undefined, submit: () => void) {
  const fired = useRef(false)
  const fn = useRef(submit)
  useEffect(() => {
    fn.current = submit
  })
  useEffect(() => {
    if (timeUp && !fired.current) {
      fired.current = true
      fn.current()
    }
  }, [timeUp])
}

export function ExamPart({ module, ...props }: PartProps & { module: ModuleId }) {
  if (module === 'lesen') return <LesenPart {...props} />
  if (module === 'hoeren') return <HoerenPart {...props} />
  if (module === 'schreiben') return <SchreibenPart {...props} />
  return <SprechenPart {...props} />
}
