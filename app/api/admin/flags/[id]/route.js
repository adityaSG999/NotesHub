import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { updateSchema, uuidSchema } from '@/lib/validation';

function requireAdmin(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'ADMIN') return null;
  return payload;
}

// PATCH /api/admin/flags/[id] — resolve or dismiss a flag
export async function PATCH(request, { params }) {
  const session = requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const parsedId = uuidSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });
  }
  const flagId = parsedId.data;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });

  const flag = await prisma.flag.update({
    where: { id: flagId },
    data: { status: parsed.data.action }
  });

  return NextResponse.json({ success: true, flag });
}
