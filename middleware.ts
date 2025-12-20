import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
  exp: number;
}

// Define protected routes
const ADMIN_ROUTES = ['/admin'];
const CLIENT_ROUTES = ['/dashboard', '/profile']; // Example client routes, expand as needed

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  const isClientRoute = CLIENT_ROUTES.some(route => pathname.startsWith(route));

  if (isAdminRoute || isClientRoute) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      
      // Role-based access control
      if (isAdminRoute && decoded.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      // Client routes are accessible by both CLIENT and ADMIN
      if (isClientRoute && !['CLIENT', 'ADMIN'].includes(decoded.role)) {
         return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Matcher must include all protected paths
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*'
  ],
};
