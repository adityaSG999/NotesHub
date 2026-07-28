import { NextResponse } from 'next/server';

export async function POST(request) {
  const response = NextResponse.redirect(new URL('/login', request.url));

  // Clear the token cookie
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });

  return response;
}
