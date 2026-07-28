import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ success: true, user: null });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ success: true, user: null });

    return NextResponse.json({
      success: true,
      user: {
        id: payload.id,
        username: payload.username,
        email: payload.email || null,
        avatarUrl: payload.avatarUrl || null,
        role: payload.role || null,
      },
    });
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
