import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Note: In a production environment, you would check the user's session token here
    // to ensure the person requesting this data actually has the 'ADMIN' role.

    // Execute SQL: Join the tables to get the full picture of the applicant
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

// Add this right below your existing GET function in app/api/admin/applications/route.ts

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, action } = body; // action will be 'APPROVE' or 'REJECT'

    if (!userId || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action or missing User ID.' }, { status: 400 });
    }

    if (action === 'APPROVE') {
      // 1. Upgrade the user's core role to give them login access
      await pool.query(`UPDATE Users SET role = 'MEMBER' WHERE id = ?`, [userId]);
      // 2. Mark the application as approved
      await pool.query(`UPDATE Applications SET status = 'APPROVED' WHERE user_id = ?`, [userId]);
    } 
    
    if (action === 'REJECT') {
      // 1. Lock the user out permanently
      await pool.query(`UPDATE Users SET role = 'REJECTED' WHERE id = ?`, [userId]);
      // 2. Mark the application as rejected
      await pool.query(`UPDATE Applications SET status = 'REJECTED' WHERE user_id = ?`, [userId]);
    }

    return NextResponse.json({ success: true, message: `Application ${action.toLowerCase()}d successfully.` });

  } catch (error) {
    console.error('Database Update Error:', error);
    return NextResponse.json({ error: 'Failed to update application status.' }, { status: 500 });
  }
}