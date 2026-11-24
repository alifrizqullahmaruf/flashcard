import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { proxy } from '@/proxy'

const BASE = 'https://klar.test'
function go(path: string, session = false) {
  const req = new NextRequest(new URL(path, BASE), { headers: session ? { cookie: 'firebase-session=abc' } : {} })
  const res = proxy(req)
  const loc = res.headers.get('location')
  return { status: res.status, to: loc ? new URL(loc).pathname + new URL(loc).search : null }
}

describe('route protection (proxy)', () => {
  it('root opens Klar', () => {
    expect(go('/')).toEqual({ status: 307, to: '/mulai' })
  })
  it('Klar pages require login and keep the target page', () => {
    expect(go('/de')).toEqual({ status: 307, to: '/masuk?next=%2Fde' })
    expect(go('/mulai')).toEqual({ status: 307, to: '/masuk?next=%2Fmulai' })
    expect(go('/de/kartu/a1/zeit?x=1').to).toBe('/masuk?next=%2Fde%2Fkartu%2Fa1%2Fzeit%3Fx%3D1')
  })
  it('the offline fallback page is public', () => {
    expect(go('/de/offline').status).toBe(200)
  })
  it('logged-in users get through and skip the login page', () => {
    expect(go('/de', true).status).toBe(200)
    expect(go('/de/akun', true).status).toBe(200)
    expect(go('/masuk', true)).toEqual({ status: 307, to: '/de' })
  })
  it('the login page is public when logged out', () => {
    expect(go('/masuk').status).toBe(200)
  })
  it('old Hafalin app still uses its own login', () => {
    expect(go('/hafalin')).toEqual({ status: 307, to: '/login' })
    expect(go('/login', true)).toEqual({ status: 307, to: '/hafalin' })
  })
})
