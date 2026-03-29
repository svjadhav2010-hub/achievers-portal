import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'ADMIN') return null;
  return payload;
}

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorised.' }, { status: 403 });
    }

    const [rows] = await pool.query(
      `SELECT 
        u.id, 
        u.fullName, 
        u.email, 
        u.created_at,
        a.startup_name, 
        a.has_pan_card 
       FROM Users u
       JOIN Applications a ON u.id = a.user_id
       WHERE u.role = 'PENDING'
       ORDER BY u.created_at DESC`
    );

    return NextResponse.json({ success: true, data: rows });

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch pending applications.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorised.' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !['APPROVE', 'APPROVE_AS_MENTOR', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action or missing User ID.' }, { status: 400 });
    }

    if (action === 'APPROVE') {
      await pool.query(`UPDATE Users SET role = 'MEMBER' WHERE id = ?`, [userId]);
      await pool.query(`UPDATE Applications SET status = 'APPROVED' WHERE user_id = ?`, [userId]);
    }

    if (action === 'APPROVE_AS_MENTOR') {
      await pool.query(`UPDATE Users SET role = 'MENTOR' WHERE id = ?`, [userId]);
      await pool.query(`UPDATE Applications SET status = 'APPROVED' WHERE user_id = ?`, [userId]);
    }

    if (action === 'REJECT') {
      await pool.query(`UPDATE Users SET role = 'REJECTED' WHERE id = ?`, [userId]);
      await pool.query(`UPDATE Applications SET status = 'REJECTED' WHERE user_id = ?`, [userId]);
    }

    return NextResponse.json({ success: true, message: `Application ${action.toLowerCase()}d successfully.` });

  } catch (error) {
    console.error('Database Update Error:', error);
    return NextResponse.json({ error: 'Failed to update application status.' }, { status: 500 });
  }
}