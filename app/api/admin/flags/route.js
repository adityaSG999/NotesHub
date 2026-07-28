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

// GET /api/admin/flags?status=PENDING
export async function GET(request) {
  const session = requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'PENDING';

  const flags = await prisma.flag.findMany({
    where: { status },
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: {
      reporter: { select: { username: true } },
      note: {
        include: {
          author: { select: { username: true } }
        }
      }
    }
  });

  return NextResponse.json({ success: true, flags });
}
