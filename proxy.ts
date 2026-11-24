import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const session = request.cookies.get('firebase-session')?.value

  const pathname = request.nextUrl.pathname
  const isAuthRoute = pathname.startsWith('/login')

  // Klar is the main app: the root goes straight to the language picker
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/mulai', request.url))
  }

  // Klar login page: already signed in → straight into the app
  if (pathname === '/masuk') {
    return session ? NextResponse.redirect(new URL('/de', request.url)) : NextResponse.next()
  }

  // Klar requires an account (Google). The offline fallback page stays public.
  if (/^\/(de|mulai)(\/|$)/.test(pathname)) {
    if (session || pathname === '/de/offline') return NextResponse.next()
    const url = new URL('/masuk', request.url)
    url.searchParams.set('next', pathname + request.nextUrl.search)
    return NextResponse.redirect(url)
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
