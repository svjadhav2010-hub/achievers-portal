import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    // Logic building: Tracing the SQL query
    const [rows] = await pool.query('SELECT * FROM Member ORDER BY joinedAt DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}