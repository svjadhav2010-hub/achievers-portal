import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'achievers-club-nashik-secret-key-32chars!!'
);

async function getRole(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;
    // Strict allowlist
    if (!['ADMIN', 'MEMBER', 'PENDING', 'REJECTED'].includes(role)) return null;
    return role;
  } catch {
    // Token is invalid, expired, or tampered — reject it
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const role = await getRole(request);

  // Protect /admin — only ADMIN
  if (path.startsWith('/admin')) {
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect /dashboard — MEMBER or ADMIN only
  if (path.startsWith('/dashboard')) {
    if (role !== 'MEMBER' && role !== 'MENTOR' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect /directory — MEMBER or ADMIN only
  if (path.startsWith('/directory')) {
    if (role !== 'MEMBER' && role !== 'MENTOR' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/directory/:path*'],
};