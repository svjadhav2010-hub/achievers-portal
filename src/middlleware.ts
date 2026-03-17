import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Look for the VIP Wristband we issued during login
  const userRole = request.cookies.get('userRole')?.value;
  const path = request.nextUrl.pathname;

  // 2. Protect the CEO Dashboard (/admin)
  if (path.startsWith('/admin')) {
    if (userRole !== 'ADMIN') {
      // If they aren't the CEO, kick them back to the login page
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 3. Protect the Mentorship Portal (/dashboard)
  if (path.startsWith('/dashboard')) {
    // Both Admins and approved Members can view the training
    if (userRole !== 'MEMBER' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If they have the right wristband, let them through!
  return NextResponse.next();
}

// 4. Tell the Bouncer exactly which doors to guard
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};