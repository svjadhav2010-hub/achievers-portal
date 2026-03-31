import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT id, fullName, role FROM Users
       WHERE role IN ('MEMBER', 'MENTOR', 'ADMIN')
       ORDER BY role ASC, fullName ASC`
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Public members error:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}