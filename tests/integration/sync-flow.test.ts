// @vitest-environment jsdom
/**
 * Integration: progress.ts (local data) + sync.ts (merge, push/pull, uid switch)
 * against an in-memory stand-in for the server actions.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

// in-memory "Firestore" per user: users/{uid}/de_state/{key} = v
const server = new Map<string, Map<string, string>>()
let sessionUid: string | null = null
const store = () => {
  if (!sessionUid) throw new Error('no session')
  if (!server.has(sessionUid)) server.set(sessionUid, new Map())
  return server.get(sessionUid)!
}

vi.mock('@/lib/actions/klar-sync.actions', () => ({
  pullKlarState: async () => (sessionUid ? { ok: true, data: [...store()].map(([key, v]) => ({ key, v })) } : { ok: false, error: 'unauthenticated' }),
  pushKlarState: async (entries: { key: string; v: string | null }[]) => {
    if (!sessionUid) return { ok: false, error: 'unauthenticated' }
    for (const e of entries) {
      if (e.v === null) store().delete(e.key)
      else store().set(e.key, e.v)
    }
    return { ok: true, data: entries.length }
  },
  deleteKlarState: async () => {
    if (!sessionUid) return { ok: false, error: 'unauthenticated' }
    store().clear()
    return { ok: true, data: 0 }
  },
}))
vi.mock('@/lib/actions/auth.actions', () => ({ createSession: async () => ({ success: true }) }))
vi.mock('@/lib/firebase/client', () => ({
  auth: { currentUser: null },
  hasFirebaseConfig: () => true,
}))
vi.mock('firebase/auth', () => ({ onAuthStateChanged: () => () => {} }))

const user = (uid: string) => ({ uid, displayName: uid, email: `${uid}@test`, photoURL: null }) as never

async function freshModules() {
  vi.resetModules()
  const progress = await import('@/lib/de/progress')
  const sync = await import('@/lib/de/sync')
  return { progress, sync }
}

beforeEach(() => {
  localStorage.clear()
  server.clear()
  sessionUid = null
})

describe('sync flow', () => {
  it('first login uploads progress made before having an account', async () => {
    const { progress, sync } = await freshModules()
    progress.review('a1', 'familie', 'Vater', 'hafal')
    progress.saveProfile({ goal: 'kerja', targetLevel: 'b1', dailyNew: 20 })
    sessionUid = 'anna'
    await sync.initialSync(user('anna'))
    const remote = server.get('anna')!
    expect(remote.has('de:srs:a1:familie')).toBe(true)
    expect(JSON.parse(remote.get('de:profile')!).dailyNew).toBe(20)
    expect(progress.dirtyKeys()).toEqual([])
  })

  it('a second device receives the account progress', async () => {
    server.set('anna', new Map([['de:profile', JSON.stringify({ goal: 'kuliah', targetLevel: 'c1', dailyNew: 5, onboarded: true, updatedAt: 1 })]]))
    const { progress, sync } = await freshModules()
    sessionUid = 'anna'
    await sync.initialSync(user('anna'))
    expect(progress.getProfile()?.targetLevel).toBe('c1')
    expect(progress.dailyNewTarget()).toBe(5)
  })

  it('merges two devices: the most recent review of a word wins', async () => {
    const older = { due: '2026-11-25T00:00:00.000Z', last_review: '2026-11-20T00:00:00.000Z', reps: 1, scheduled_days: 1 }
    const newer = { due: '2026-11-30T00:00:00.000Z', last_review: '2026-11-24T00:00:00.000Z', reps: 4, scheduled_days: 6 }
    server.set('anna', new Map([['de:srs:a1:familie', JSON.stringify({ Vater: newer, Kind: older })]]))
    localStorage.setItem('de:srs:a1:familie', JSON.stringify({ Vater: older, Mutter: newer }))
    localStorage.setItem('de:uid', 'anna')
    const { sync } = await freshModules()
    sessionUid = 'anna'
    await sync.initialSync(user('anna'))
    const local = JSON.parse(localStorage.getItem('de:srs:a1:familie')!)
    expect(local.Vater.reps).toBe(4) // remote newer
    expect(local.Mutter.reps).toBe(4) // local only
    expect(local.Kind.reps).toBe(1) // remote only
    expect(JSON.parse(server.get('anna')!.get('de:srs:a1:familie')!)).toEqual(local) // pushed back
  })

  it('switching accounts on one device does not leak progress', async () => {
    localStorage.setItem('de:uid', 'anna')
    localStorage.setItem('de:streak', JSON.stringify({ last: '2026-11-24', count: 9 }))
    const { progress, sync } = await freshModules()
    sessionUid = 'budi'
    await sync.initialSync(user('budi'))
    expect(progress.getStreak().count).toBe(0)
    expect(server.get('budi')?.has('de:streak') ?? false).toBe(false)
  })

  it('exam practice and simulation results are uploaded with the account', async () => {
    const { sync } = await freshModules()
    const store = await import('@/lib/de/pruefung/store')
    store.recordPractice('lesen', 's1', 2, 80)
    store.recordSimulation('s1', { hoeren: 20, lesen: 22.5, schreiben: 18, sprechen: 19 })
    sessionUid = 'anna'
    await sync.initialSync(user('anna'))
    const remote = JSON.parse(server.get('anna')!.get('de:exam:a1')!)
    expect(remote.practice['lesen:s1:2'].best).toBe(80)
    expect(remote.sims[0].total).toBe(79.5)
  })

  it('deleting Klar data clears the account and the device', async () => {
    const { progress, sync } = await freshModules()
    progress.review('a1', 'familie', 'Vater', 'hafal')
    sessionUid = 'anna'
    await sync.initialSync(user('anna'))
    await sync.deleteKlarData()
    expect(server.get('anna')!.size).toBe(0)
    expect(localStorage.getItem('de:srs:a1:familie')).toBeNull()
  })
})
