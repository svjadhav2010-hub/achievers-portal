import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    const userName = cookieStore.get('userName')?.value;
    const userRole = cookieStore.get('userRole')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    // Fetch user details from DB
    const [rows]: any = await pool.query(
      `SELECT id, fullName, email, role, created_at FROM Users WHERE id = ?`,
      [userId]
    );

    const user = rows[0];
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Fetch total approved member count for community stats
    const [countRows]: any = await pool.query(
      `SELECT COUNT(*) as total FROM Users WHERE role = 'MEMBER'`
    );
    const totalMembers = countRows[0]?.total || 0;

    return NextResponse.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        joinedAt: user.created_at,
      },
      stats: {
        totalMembers,
      },
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard.' }, { status: 500 });
  }
}