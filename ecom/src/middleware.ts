// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const protectedPaths = ['/admin', '/profile', '/checkout', '/orders'];

// Paths that require admin role
const adminPaths = ['/admin'];

// Public paths that should redirect logged-in users
const authPaths = ['/auth/login', '/auth/signup', '/auth/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the token from localStorage (client-side storage persisted as cookie in Next.js)
  const token = request.cookies.get('token')?.value;
  
  // Get the user from cookies (if exists)
  const userCookie = request.cookies.get('user')?.value;
  let user = null;
  
  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch (error) {
      console.error('Error parsing user cookie:', error);
    }
  }
  
  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  // Check if the path requires admin privileges
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
  
  // Check if the path is a public auth path
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));
  
  // If it's an auth path and the user is logged in, redirect to home
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If it's a protected path and no token exists, redirect to login
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    // Add the current URL as a callback parameter for redirect after login
    loginUrl.searchParams.set('callback', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If it's an admin path and the user is not an admin, redirect to home
  if (isAdminPath && (!user || user.role !== 'Admin')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Allow the request to proceed
  return NextResponse.next();
}

// Define which paths the middleware should be executed on
export const config = {
  matcher: [
    // Protect these paths
    '/admin/:path*',
    '/profile/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    // Public auth paths
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
  ],
};