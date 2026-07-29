import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { createNoteSchema } from '@/lib/validation';

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

// GET /api/notes - Fetch notes feed with cursor pagination
export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const payload = token ? verifyToken(token) : null;
    const currentUserId = payload?.id || null;

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const category = searchParams.get('category');
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "20", 10),
      100
    );

    const where = { status: 'PUBLISHED' };
    if (category) {
      where.category = category;
    }

    const notes = await prisma.note.findMany({
      where,
      take: limit + 1, // Fetch one extra to determine if there's a next page
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, username: true, avatarUrl: true }
        },
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

    let nextCursor = null;
    if (notes.length > limit) {
      const nextItem = notes.pop();
      nextCursor = nextItem.id;
    }

    return NextResponse.json({
      success: true,
      notes: notes.map((note) => normalizeNoteForCard(note, currentUserId)),
      nextCursor,
    });
  } catch (error) {
    console.error('Fetch notes error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// POST /api/notes - Create a new note
export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });

    const body = await request.json();
    const parsed = createNoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid note data', errors: parsed.error.errors }, { status: 400 });
    }

    const { title, content, category } = parsed.data;

    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        category,
        authorId: payload.id,
      },
      include: {
        author: {
          select: { id: true, username: true, avatarUrl: true }
        }
      }
    });

    return NextResponse.json({ success: true, note: newNote }, { status: 201 });
  } catch (error) {
    console.error('Create note error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
