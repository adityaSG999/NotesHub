import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

function requireAdmin(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'ADMIN') return null;
  return payload;
}

// GET /api/admin/users — list all users with note count
export async function GET(request) {
  const session = requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, username: true, email: true, role: true,
      status: true, avatarUrl: true, createdAt: true,
      _count: { select: { notes: true } }
    }
  });

  return NextResponse.json({ success: true, users });
}
