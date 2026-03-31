import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
  try {
    // Verify the requester is logged in
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });

    // Fetch all approved members and mentors from Users table
    const [rows] = await pool.query(
      `SELECT id, fullName, email, role, created_at
       FROM Users
       WHERE role IN ('MEMBER', 'MENTOR', 'ADMIN')
       ORDER BY role ASC, fullName ASC`
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}