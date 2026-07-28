import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

function normalizeNoteForCard(note, currentUserId) {
  const hasLiked = note.likes.some((like) => like.userId === currentUserId);
  const hasBookmarked = note.bookmarks.some((bookmark) => bookmark.userId === currentUserId);
  const userFlagStatus = note.flags.find((flag) => flag.reporterId === currentUserId)?.status || null;

  const { likes, bookmarks, flags, ...rest } = note;

  return {
    ...rest,
    hasLiked,
    hasBookmarked,
    userFlagStatus,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    const token = request.cookies.get('token')?.value;
    const payload = token ? verifyToken(token) : null;
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: payload.id },
      take: limit + 1,
      skip,
      orderBy: { createdAt: 'desc' },
      include: {
        note: {
          include: {
            author: { select: { id: true, username: true, avatarUrl: true } },
            likes: {
              where: { userId: payload.id },
              select: { userId: true }
            },
            bookmarks: {
              where: { userId: payload.id },
              select: { userId: true }
            },
            flags: {
              where: { reporterId: payload.id },
              select: { reporterId: true, status: true }
            }
          }
        }
      }
    });

    const hasMore = bookmarks.length > limit;
    if (hasMore) bookmarks.pop();

    return NextResponse.json({
      success: true,
      bookmarks: bookmarks.map(({ note }) => normalizeNoteForCard(note, payload.id)),
      hasMore,
    });
  } catch (error) {
    console.error('Bookmark API error:', error);
    return NextResponse.json({ success: false, message: 'Could not load bookmarks.' }, { status: 500 });
  }
}
