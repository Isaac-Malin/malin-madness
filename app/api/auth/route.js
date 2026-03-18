// app/api/auth/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'malin_session';
const SESSION_VALUE  = 'authorized';
// 7 days in seconds
const MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request) {
  try {
    const { password } = await request.json();
    const correct = process.env.FAMILY_PASSWORD;

    if (!correct) {
      console.error('FAMILY_PASSWORD env var is not set');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (password !== correct) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Set a secure session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, SESSION_VALUE, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   MAX_AGE,
      path:     '/',
    });

    return response;
  } catch (err) {
    console.error('POST /api/auth error:', err);
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}

export async function DELETE() {
  // Logout — clear the cookie
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' });
  return response;
}
