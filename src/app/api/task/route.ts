import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

// GET — fetch current user's tasks
export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });

    const [rows] = await pool.query(
      `SELECT id, title, status, due_date, created_at FROM Tasks
       WHERE user_id = ? ORDER BY created_at DESC`,
      [user.userId]
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks.' }, { status: 500 });
  }
}

// POST — create a new task
export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });

    const { title, due_date } = await request.json();
    if (!title?.trim()) return NextResponse.json({ error: 'Title is required.' }, { status: 400 });

    const id = crypto.randomUUID();
    await pool.query(
      `INSERT INTO Tasks (id, user_id, title, status, due_date) VALUES (?, ?, ?, 'pending', ?)`,
      [id, user.userId, title.trim(), due_date || null]
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task.' }, { status: 500 });
  }
}

// PATCH — update task status
export async function PATCH(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });

    const { id, status } = await request.json();
    if (!['pending', 'in_progress', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    // Only allow updating own tasks (unless admin)
    const whereClause = user.role === 'ADMIN' ? 'id = ?' : 'id = ? AND user_id = ?';
    const params = user.role === 'ADMIN' ? [status, id] : [status, id, user.userId];
    await pool.query(`UPDATE Tasks SET status = ? WHERE ${whereClause}`, params);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task.' }, { status: 500 });
  }
}

// DELETE — remove a task
export async function DELETE(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });

    const { id } = await request.json();
    const whereClause = user.role === 'ADMIN' ? 'id = ?' : 'id = ? AND user_id = ?';
    const params = user.role === 'ADMIN' ? [id] : [id, user.userId];
    await pool.query(`DELETE FROM Tasks WHERE ${whereClause}`, params);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task.' }, { status: 500 });
  }
}