import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Strict allowlist — only these exact strings are valid roles
const VALID_ROLES = new Set(['ADMIN', 'MEMBER', 'PENDING', 'REJECTED']);

export function middleware(request: NextRequest) {
  const rawRole = request.cookies.get('userRole')?.value;
  const path = request.nextUrl.pathname;

  // Reject tampered or missing cookies immediately
  const userRole = rawRole && VALID_ROLES.has(rawRole) ? rawRole : null;

  // Protect /admin — only ADMIN role allowed
  if (path.startsWith('/admin')) {
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect /dashboard — only approved MEMBER or ADMIN allowed
  // PENDING and REJECTED are explicitly blocked even if cookie exists
  if (path.startsWith('/dashboard')) {
    if (userRole !== 'MEMBER' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect /directory — same as dashboard
  if (path.startsWith('/directory')) {
    if (userRole !== 'MEMBER' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/directory/:path*'],
};