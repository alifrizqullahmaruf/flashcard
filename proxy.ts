import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const session = request.cookies.get('firebase-session')?.value

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login')

  // German MVP: public, static-data routes (no login needed)
  if (/^\/(de|mulai)(\/|$)/.test(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // static audio files must stay public (no auth redirect)
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon|audio/).*)'],
}
