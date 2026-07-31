import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { flagSchema, uuidSchema } from '@/lib/validation';

// POST /api/notes/[id]/flag — report a note
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

    // Check if user is admin - admins cannot flag notes
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { role: true }
    });
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    if (user.role.toLowerCase() === 'admin') {
      return NextResponse.json({ success: false, message: 'Admins cannot report notes' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = flagSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, message: 'Reason must be between 5 and 200 characters.' }, { status: 400 });

    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) return NextResponse.json({ success: false, message: 'Note not found' }, { status: 404 });

    // Prevent duplicate flags from same reporter
    const existing = await prisma.flag.findFirst({
      where: { reporterId: payload.id, noteId, status: 'PENDING' }
    });
    if (existing) return NextResponse.json({ success: false, message: 'You have already flagged this note.' }, { status: 409 });

    const flag = await prisma.flag.create({
      data: { reporterId: payload.id, noteId, reason: parsed.data.reason }
    });

    return NextResponse.json({
      success: true,
      message: 'Note reported. Our team will review it shortly.',
      flag: { id: flag.id, status: flag.status }
    });
  } catch (error) {
    console.error('Flag note error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
