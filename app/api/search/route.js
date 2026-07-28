import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { querySchema } from '@/lib/validation';

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
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';

  const parsedQuery = querySchema.safeParse(q);
  if (!parsedQuery.success) {
    return NextResponse.json({ success: false, notes: [], message: 'Search query must be between 2 and 100 characters.' }, { status: 400 });
  }

  try {
    const token = request.cookies.get('token')?.value;
    const payload = token ? verifyToken(token) : null;
    const currentUserId = payload?.id || null;

    const notes = await prisma.note.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { content: { contains: q, mode: 'insensitive' } },
          { title: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } },
          { author: { username: { contains: q, mode: 'insensitive' } } },
        ]
      },
      take: 30,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        likes: {
          where: currentUserId ? { userId: currentUserId } : undefined,
          select: { userId: true }
        },
        bookmarks: {
          where: currentUserId ? { userId: currentUserId } : undefined,
          select: { userId: true }
        },
        flags: {
          where: currentUserId ? { reporterId: currentUserId } : undefined,
          select: { reporterId: true, status: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      notes: notes.map((note) => normalizeNoteForCard(note, currentUserId)),
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ success: false, notes: [] }, { status: 500 });
  }
}
