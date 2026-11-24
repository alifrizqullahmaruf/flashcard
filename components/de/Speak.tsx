'use client'
import { useEffect, useSyncExternalStore } from 'react'
import { Snail, Volume2, type LucideIcon } from 'lucide-react'
import MANIFEST from '@/lib/de/audio-manifest.json'
import { audioKey } from '@/lib/de/speech-texts'

/**
 * German audio, in order of preference:
 *  1. Native-speaker recording (Wiktionary / Wikimedia Commons) for single words
 *  2. Pre-recorded Piper "Thorsten" voice (natural German male voice, CC0 dataset)
 *  3. Device speech synthesis as a last resort (best German voice available)
 */

type Entry = { tts: string; native?: { src: string; author: string; license: string; word: string; page?: string } }
const AUDIO = MANIFEST as Record<string, Entry>

export function audioFor(text: string): Entry | undefined {
  return AUDIO[audioKey(text)]
}

const noopSubscribe = () => () => {}

let player: HTMLAudioElement | null = null

function playFile(src: string, slow: boolean) {
  window.speechSynthesis?.cancel()
  if (!player) player = new Audio()
  player.pause()
  player.src = src
  player.preservesPitch = true // slow down without the "chipmunk" effect
  player.playbackRate = slow ? 0.7 : 1
  return player.play()
}

/* ── fallback: device voices ───────────────────────── */

// Neural/"natural" voices sound far less robotic than the old desktop ones.
const VOICE_RANK: [RegExp, number][] = [
  [/natural|neural|online/i, 50], // Edge: "Microsoft Katja Online (Natural)"
  [/premium|enhanced|siri/i, 40], // iOS/macOS downloaded voices
  [/google/i, 30], // Chrome/Android "Google Deutsch"
  [/anna|helena|petra|markus|yannick|viktor/i, 15],
  [/desktop|hedda|stefan|compact|espeak/i, -20], // old SAPI / eSpeak = robotic
]

function pickGermanVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('de'))
  const score = (v: SpeechSynthesisVoice) =>
    VOICE_RANK.reduce((s, [re, pts]) => (re.test(v.name) ? s + pts : s), 0) + (v.lang === 'de-DE' ? 5 : 0) + (v.localService ? 0 : 3)
  return voices.sort((a, b) => score(b) - score(a))[0]
}

function speakSynth(text: string, rate: number) {
  if (!('speechSynthesis' in window)) return false
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'de-DE'
  u.rate = rate
  const voice = pickGermanVoice()
  if (voice) u.voice = voice
  synth.speak(u)
  return true
}

/** Play German text. rate < 0.8 = slow mode. */
export function speakDe(text: string, rate = 0.9) {
  if (typeof window === 'undefined') return false
  const slow = rate < 0.8
  const e = audioFor(text)
  if (e) {
    const src = e.native?.src ?? e.tts
    playFile(src, slow).catch(() => {
      // native file failed? try the TTS file, then the device voice
      if (src !== e.tts) playFile(e.tts, slow).catch(() => speakSynth(text, rate))
      else speakSynth(text, rate)
    })
    return true
  }
  return speakSynth(text, rate)
}

export default function Speak({ text, size = 'md', withSlow = false }: { text: string; size?: 'sm' | 'md'; withSlow?: boolean }) {
  // server: assume supported; client: real check (no setState-in-effect)
  const supported = useSyncExternalStore(
    noopSubscribe,
    () => 'speechSynthesis' in window,
    () => true,
  )
  const hasFile = !!audioFor(text)

  useEffect(() => {
    if (hasFile || !('speechSynthesis' in window)) return
    // Voices load asynchronously on some browsers (Chrome/Android)
    window.speechSynthesis.getVoices()
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
  }, [hasFile])

  if (!supported && !hasFile) return null

  const cls = size === 'sm' ? 'w-8 h-8 text-sm' : 'w-11 h-11 text-lg'

  const btn = (label: string, Icon: LucideIcon, rate: number) => (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        speakDe(text, rate)
      }}
      className={`${cls} rounded-pill bg-sky-soft text-sky-dark font-extrabold flex items-center justify-center shrink-0 active:scale-90 transition`}
    >
      <Icon size={size === 'sm' ? 16 : 20} strokeWidth={2.4} />
    </button>
  )

  return (
    <span className="inline-flex gap-1.5">
      {btn(`Dengarkan: ${text}`, Volume2, 0.9)}
      {withSlow && btn(`Dengarkan pelan: ${text}`, Snail, 0.55)}
    </span>
  )
}
