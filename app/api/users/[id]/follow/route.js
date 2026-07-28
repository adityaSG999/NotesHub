import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { uuidSchema } from '@/lib/validation';

// POST /api/users/[id]/follow — toggle follow/unfollow
export async function POST(request, { params }) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });

    const { id: followingId } = params;
    const parsedId = uuidSchema.safeParse(followingId);
    if (!parsedId.success) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }
    const followerId = payload.id;
    const validFollowingId = parsedId.data;

    if (followerId === validFollowingId) {
      return NextResponse.json({ success: false, message: 'You cannot follow yourself.' }, { status: 400 });
    }

    // Verify target user exists
    const targetUser = await prisma.user.findUnique({ where: { id: validFollowingId } });
    if (!targetUser) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    const existingFollow = await prisma.follower.findUnique({
      where: { followerId_followingId: { followerId, followingId: validFollowingId } }
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follower.delete({ where: { id: existingFollow.id } });
      return NextResponse.json({ success: true, action: 'unfollowed', following: false });
    } else {
      // Follow
      await prisma.follower.create({ data: { followerId, followingId: validFollowingId } });
      return NextResponse.json({ success: true, action: 'followed', following: true });
    }
  } catch (error) {
    console.error('Follow toggle error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// GET /api/users/[id]/follow — check if current user follows this user
export async function GET(request, { params }) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ following: false });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ following: false });

    const { id: followingId } = params;
    const parsedId = uuidSchema.safeParse(followingId);
    if (!parsedId.success) {
      return NextResponse.json({ following: false });
    }
    const validFollowingId = parsedId.data;
    const followRecord = await prisma.follower.findUnique({
      where: {
        followerId_followingId: { followerId: payload.id, followingId: validFollowingId }
      }
    });

    return NextResponse.json({ following: !!followRecord });
  } catch (error) {
    return NextResponse.json({ following: false });
  }
}
