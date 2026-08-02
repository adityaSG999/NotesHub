import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

const publicRoutes = ['/login', '/register', '/search'];
const adminRoutes = ['/admin'];

type Session = {
  role?: string;
  [key: string]: unknown;
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  let session: Session | null = null;

  try {
    session = token ? (verifyToken(token) as Session) : null;
  } catch (err) {
    // If token verification fails, treat as no session
    session = null;
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect authenticated users away from login/register pages
  if (
    session &&
    (pathname.startsWith('/login') || pathname.startsWith('/register'))
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check if route is admin route
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Admin route protection
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check admin role
    if (session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect private routes
  const isPrivateRoute =
    pathname.startsWith('/profile') ||
    pathname.startsWith('/bookmarks');

  if (isPrivateRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};