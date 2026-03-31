import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    // Verify admin token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorised.' }, { status: 403 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorised.' }, { status: 403 });
    }

    const { userId, title, due_date } = await request.json();

    if (!userId || !title?.trim()) {
      return NextResponse.json({ error: 'Member and title are required.' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    await pool.query(
      `INSERT INTO Tasks (id, user_id, title, status, due_date) VALUES (?, ?, ?, 'pending', ?)`,
      [id, userId, title.trim(), due_date || null]
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Admin task assign error:', error);
    return NextResponse.json({ error: 'Failed to assign task.' }, { status: 500 });
  }
}