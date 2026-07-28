import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const userStatusSchema = z.enum(['ACTIVE', 'BLOCKED']);
const uuidSchema = z.string().uuid();

function requireAdmin(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'ADMIN') return null;
  return payload;
}

// PATCH /api/admin/users/[id] — block or unblock a user
export async function PATCH(request, { params }) {
  const session = requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const parsedId = uuidSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });
  }
  const userId = parsedId.data;
  const body = await request.json();
  const parsed = userStatusSchema.safeParse(body.status);
  if (!parsed.success) return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });

  const user = await prisma.user.update({
    where: { id: userId },
    data: { status: parsed.data }
  });

  return NextResponse.json({ success: true, user: { id: user.id, status: user.status } });
}
