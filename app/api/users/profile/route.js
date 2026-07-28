import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { updateProfileSchema } from '@/lib/validation';

export async function PUT(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid profile data', errors: parsed.error.errors }, { status: 400 });
    }

    const { username, bio, avatarUrl } = parsed.data;

    // Check if username is being changed and if it's already taken
    if (username && username !== payload.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username }
      });
      if (existingUser) {
        return NextResponse.json({ success: false, message: 'Username already taken' }, { status: 409 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.id },
      data: {
        ...(username && { username }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl: avatarUrl || null }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        role: true,
      }
    });

    // Refresh the session token when profile identity data changes so the client keeps the latest avatar/username.
    const shouldRefreshToken = username !== undefined || avatarUrl !== undefined;
    if (shouldRefreshToken) {
      const { signToken } = await import('@/lib/auth');
      const newToken = signToken({
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl || null,
      });
      const response = NextResponse.json({ success: true, user: updatedUser });
      response.cookies.set('token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });
      return response;
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
