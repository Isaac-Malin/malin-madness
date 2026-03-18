// middleware.js  (lives at the project root)
import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'malin_session';
const SESSION_VALUE  = 'authorized';

// Routes that don't need auth
const PUBLIC_PATHS = ['/login', '/api/auth'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public paths and static assets through
  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p))
    || pathname.startsWith('/_next')
    || pathname.startsWith('/favicon');

  if (isPublic) return NextResponse.next();

  const session = request.cookies.get(SESSION_COOKIE);
  const authed  = session?.value === SESSION_VALUE;

  if (!authed) {
    // Redirect to login, preserving the original destination
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
