import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
    }

    // Find OTP record
    const [rows]: any = await pool.query(
      `SELECT * FROM OTPVerifications WHERE email = ? ORDER BY created_at DESC LIMIT 1`,
      [email]
    );

    const record = (rows as any[])[0];

    if (!record) {
      return NextResponse.json({ error: 'No OTP found. Please request a new one.' }, { status: 400 });
    }

    // Check expiry
    if (new Date(record.expires_at) < new Date()) {
      await pool.query(`DELETE FROM OTPVerifications WHERE email = ?`, [email]);
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    // Check OTP match
    if (record.otp !== otp.trim()) {
      return NextResponse.json({ error: 'Incorrect OTP. Please try again.' }, { status: 400 });
    }

    // OTP valid — delete it
    await pool.query(`DELETE FROM OTPVerifications WHERE email = ?`, [email]);

    return NextResponse.json({ success: true, message: 'Email verified successfully.' });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}