import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { updateNoteSchema, uuidSchema } from '@/lib/validation';

export async function PUT(request, { params }) {
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

    const body = await request.json();
    const parsed = updateNoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid note data', errors: parsed.error.errors }, { status: 400 });
    }

    // Find the note
    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) return NextResponse.json({ success: false, message: 'Note not found' }, { status: 404 });

    // Authorization: Must be the author OR an Admin
    if (note.authorId !== payload.id && payload.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Forbidden. You do not have permission to edit this note.' }, { status: 403 });
    }

    const { title, content, category } = parsed.data;

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: { title, content, category },
      include: {
        author: {
          select: { id: true, username: true, avatarUrl: true }
        }
      }
    });

    return NextResponse.json({ success: true, note: updatedNote });
  } catch (error) {
    console.error('Update note error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
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

    // Find the note
    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) return NextResponse.json({ success: false, message: 'Note not found' }, { status: 404 });

    // Authorization Verification: Must be the author OR an Admin
    if (note.authorId !== payload.id && payload.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Forbidden. You do not have permission to delete this note.' }, { status: 403 });
    }

    // Delete the note (Prisma handles cascading deletes for Likes/Bookmarks/Flags)
    await prisma.note.delete({ where: { id: noteId } });

    return NextResponse.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
