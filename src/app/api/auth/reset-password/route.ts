import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    // Verify OTP
    const [rows]: any = await pool.query(
      `SELECT * FROM OTPVerifications WHERE email = ? ORDER BY created_at DESC LIMIT 1`,
      [email]
    );
    const record = (rows as any[])[0];

    if (!record) return NextResponse.json({ error: 'No reset request found. Please start again.' }, { status: 400 });
    if (new Date(record.expires_at) < new Date()) {
      await pool.query(`DELETE FROM OTPVerifications WHERE email = ?`, [email]);
      return NextResponse.json({ error: 'Code has expired. Please request a new one.' }, { status: 400 });
    }
    if (record.otp !== otp.trim()) {
      return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 400 });
    }

    // Update password
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(`UPDATE Users SET password_hash = ? WHERE email = ?`, [hashed, email]);
    await pool.query(`DELETE FROM OTPVerifications WHERE email = ?`, [email]);

    return NextResponse.json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}