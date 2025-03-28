// middleware/authMiddleware.ts
import { NextRequest, NextResponse } from 'next/server';


export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export async function authMiddleware(request: NextRequest) {
  // Get token from cookies or authorization header
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // try {
  //   // Verify and decode token
  //   const user = await verifyToken(token);
  //   return user;
  // } catch (error) {
  //   // Token is invalid or expired
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
}

export async function adminMiddleware(request: NextRequest) {
  try {
    const user = await authMiddleware(request);

    // Check if user is an admin
    // if (user?.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/unauthorized', request.url));
    // }

    return user;
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}