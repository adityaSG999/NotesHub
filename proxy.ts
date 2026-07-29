import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

const publicRoutes = ['/login', '/register', '/search'];
const adminRoutes = ['/admin'];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  let session = null;
  
  try {
    session = token ? verifyToken(token) : null;
  } catch (err) {
    // If token verification fails, treat as no session
    session = null;
  }

  // Check if route is public (login/register)
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Redirect authenticated users away from auth pages (login/register) but allow other public routes
  if (session && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check if route is admin route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Admin route protection
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Check if user is admin (need to fetch user role from DB or include in token)
    // For now, we'll check the role in the session if it exists
    if (typeof session === 'object' && session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect private routes (profile, bookmarks, etc.)
  const isPrivateRoute = pathname.startsWith('/profile') || pathname.startsWith('/bookmarks');
  
  if (isPrivateRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
