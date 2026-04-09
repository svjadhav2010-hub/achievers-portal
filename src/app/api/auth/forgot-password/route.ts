import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 });

    // Check user exists
    const [rows]: any = await pool.query(
      `SELECT id, fullName FROM Users WHERE email = ? AND role NOT IN ('PENDING', 'REJECTED')`,
      [email]
    );
    const user = (rows as any[])[0];

    // Always return success (don't reveal if email exists)
    if (!user) return NextResponse.json({ success: true });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Clear old OTPs and store new one
    await pool.query(`DELETE FROM OTPVerifications WHERE email = ?`, [email]);
    await pool.query(
      `INSERT INTO OTPVerifications (email, otp, expires_at) VALUES (?, ?, ?)`,
      [email, otp, expiresAt]
    );

    await resend.emails.send({
      from: 'Achievers Club <onboarding@resend.dev>',
      to: email,
      subject: `${otp} — Reset your Achievers Club password`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8f7f4;">
          <div style="background:#0d0d0d;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
            <h1 style="color:white;font-size:22px;margin:0 0 6px;">Password Reset</h1>
            <p style="color:rgba(255,255,255,0.5);margin:0;font-size:14px;">The Achievers Club · Nashik Branch</p>
          </div>
          <div style="background:white;border-radius:16px;padding:32px;text-align:center;border:1px solid rgba(0,0,0,0.06);">
            <p style="color:#5a5a5a;font-size:15px;margin:0 0 24px;">Hi ${user.fullName.split(' ')[0]}, use this code to reset your password:</p>
            <div style="background:#f8f7f4;border-radius:12px;padding:20px;margin-bottom:24px;">
              <div style="font-size:42px;font-weight:700;letter-spacing:10px;color:#0d0d0d;">${otp}</div>
            </div>
            <p style="color:#aaa;font-size:13px;margin:0;">Expires in <strong>10 minutes</strong>. If you didn't request this, ignore this email.</p>
          </div>
          <p style="text-align:center;color:#aaa;font-size:12px;margin-top:24px;">The Achievers Club · Nashik Branch</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}