import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const session = request.cookies.get('firebase-session')?.value

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login')

  // Klar is the main app: the root goes straight to the language picker
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/mulai', request.url))
  }

  // Klar (German): public, static-data routes (no login needed)
  if (/^\/(de|mulai)(\/|$)/.test(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // old Hafalin app: after login go to its own home
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/hafalin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // static audio, PWA icons, service worker and manifest must stay public
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon|audio/|icons/|sw.js|manifest.webmanifest).*)'],
}
