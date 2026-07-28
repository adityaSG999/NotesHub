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

    // Verify note exists
    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) return NextResponse.json({ success: false, message: 'Note not found' }, { status: 404 });

    // Check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_noteId: { userId, noteId }
      }
    });

    if (existingLike) {
      // Unlike: Remove like and decrement count
      await prisma.$transaction([
        prisma.like.delete({ where: { id: existingLike.id } }),
        prisma.note.update({
          where: { id: noteId },
          data: { likesCount: { decrement: 1 } }
        })
      ]);
      return NextResponse.json({ success: true, action: 'unliked' });
    } else {
      // Like: Add like and increment count
      await prisma.$transaction([
        prisma.like.create({ data: { userId, noteId } }),
        prisma.note.update({
          where: { id: noteId },
          data: { likesCount: { increment: 1 } }
        })
      ]);
      return NextResponse.json({ success: true, action: 'liked' });
    }
  } catch (error) {
    console.error('Like toggle error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
