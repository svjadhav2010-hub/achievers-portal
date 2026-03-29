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
    if (!admin) return NextResponse.json({ error: 'Unauthorised.' }, { status: 403 });

    const [[{ total }]]: any = await pool.query(`SELECT COUNT(*) as total FROM Users WHERE role IN ('MEMBER','MENTOR')`);
    const [[{ pending }]]: any = await pool.query(`SELECT COUNT(*) as pending FROM Users WHERE role = 'PENDING'`);
    const [[{ rejected }]]: any = await pool.query(`SELECT COUNT(*) as rejected FROM Users WHERE role = 'REJECTED'`);
    const [[{ tasks_done }]]: any = await pool.query(`SELECT COUNT(*) as tasks_done FROM Tasks WHERE status = 'completed'`);
    const [[{ tasks_total }]]: any = await pool.query(`SELECT COUNT(*) as tasks_total FROM Tasks`);

    const [members]: any = await pool.query(
      `SELECT id, fullName, email, role, referred_by, created_at FROM Users WHERE role IN ('MEMBER','MENTOR','ADMIN') ORDER BY created_at ASC`
    );

    const [tasks]: any = await pool.query(
      `SELECT t.id, t.title, t.status, t.due_date, t.created_at, u.fullName, u.email
       FROM Tasks t JOIN Users u ON t.user_id = u.id
       ORDER BY t.created_at DESC LIMIT 50`
    );

    const [applications]: any = await pool.query(
      `SELECT u.id, u.fullName, u.email, u.created_at, a.startup_name, a.has_pan_card
       FROM Users u JOIN Applications a ON u.id = a.user_id
       WHERE u.role = 'PENDING' ORDER BY u.created_at DESC`
    );

    return NextResponse.json({
      stats: { total, pending, rejected, tasks_done, tasks_total },
      members,
      tasks,
      applications,
    });

  } catch (error) {
    console.error('Admin overview error:', error);
    return NextResponse.json({ error: 'Failed to load overview.' }, { status: 500 });
  }
}