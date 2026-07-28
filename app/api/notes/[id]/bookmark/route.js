import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { uuidSchema } from '@/lib/validation';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const parsedId = uuidSchema.safeParse(id);
    if (!parsedId.success) {
      return NextResponse.json({ success: false, message: 'Invalid note ID' }, { status: 400 });
    }
    const noteId = parsedId.data;
    const token = request.cookies.get('token')?.value;

    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });

    const userId = payload.id;

    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) return NextResponse.json({ success: false, message: 'Note not found' }, { status: 404 });

    const existingBookmark = await prisma.bookmark.findUnique({
      where: { userId_noteId: { userId, noteId } }
    });

    if (existingBookmark) {
      // Remove bookmark
      await prisma.$transaction([
        prisma.bookmark.delete({ where: { id: existingBookmark.id } }),
        prisma.note.update({ where: { id: noteId }, data: { bookmarksCount: { decrement: 1 } } })
      ]);
      return NextResponse.json({ success: true, action: 'removed' });
    } else {
      // Add bookmark
      await prisma.$transaction([
        prisma.bookmark.create({ data: { userId, noteId } }),
        prisma.note.update({ where: { id: noteId }, data: { bookmarksCount: { increment: 1 } } })
      ]);
      return NextResponse.json({ success: true, action: 'saved' });
    }
  } catch (error) {
    console.error('Bookmark toggle error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
