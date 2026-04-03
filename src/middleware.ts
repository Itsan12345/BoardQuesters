
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value;
  const { pathname } = request.nextUrl;

  // Define public routes that don't require authentication
  const isPublicRoute = 
    pathname === '/login' || 
    pathname === '/signup' || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.');

  // If no user session and trying to access a protected route
  if (!userId && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is already logged in, don't let them go back to login/signup
  if (userId && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
