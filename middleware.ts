import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
  exp: number;
}

// Define protected routes
const ADMIN_ROUTES = ['/admin'];
const CLIENT_ROUTES = ['/dashboard', '/templates', '/profile']; // Client can access templates

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle home page redirect based on user role
  if (pathname === '/') {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      // No token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      
      // Redirect based on role
      if (decoded.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (decoded.role === 'CLIENT') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } else {
        // Unknown role, redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

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
    '/',
    '/admin/:path*',
    '/dashboard/:path*',
    '/templates/:path*',
    '/profile/:path*'
  ],
};
