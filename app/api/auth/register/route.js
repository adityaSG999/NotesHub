import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { signToken } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid input data', errors: parsed.error.errors }, { status: 400 });
    }

    const { username, email, password } = parsed.data;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User with that email or username already exists' }, { status: 409 });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      }
    });

    // Generate JWT
    const token = signToken({
      id: user.id,
      username: user.username,
      role: user.role,
      avatarUrl: user.avatarUrl || null,
    });

    const response = NextResponse.json({ 
      success: true, 
      user: { id: user.id, username: user.username, role: user.role } 
    }, { status: 201 });

    // Set HttpOnly cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
