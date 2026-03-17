import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // 1. Await the cookie store (Next.js 15+ requirement)
    const cookieStore = await cookies();
    
    // 2. Shred the VIP wristband
    cookieStore.delete('userRole');

    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }
}