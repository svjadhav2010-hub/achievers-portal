import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { email, fullName } = await request.json();

    if (!email || !fullName) {
      return NextResponse.json({ error: 'Email and name are required.' }, { status: 400 });
    }

    // Check if email already registered
    const [existing]: any = await pool.query(
      `SELECT id FROM Users WHERE email = ?`, [email]
    );
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ error: 'This email is already registered.' }, { status: 409 });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTPs for this email
    await pool.query(`DELETE FROM OTPVerifications WHERE email = ?`, [email]);

    // Store new OTP
    await pool.query(
      `INSERT INTO OTPVerifications (email, otp, expires_at) VALUES (?, ?, ?)`,
      [email, otp, expiresAt]
    );

    // Send OTP email
    const { error: sendError } = await resend.emails.send({
      from: 'Achievers Club <noreply@auth.acheiversclubofficial.in>',
      to: email,
      subject: `${otp} — Your Achievers Club verification code`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8f7f4;">
          <div style="background: #0d0d0d; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; font-size: 22px; margin: 0 0 6px;">Verify your email</h1>
            <p style="color: rgba(255,255,255,0.5); margin: 0; font-size: 14px;">The Achievers Club · Nashik Branch</p>
          </div>
          <div style="background: white; border-radius: 16px; padding: 32px; text-align: center; border: 1px solid rgba(0,0,0,0.06);">
            <p style="color: #5a5a5a; font-size: 15px; margin: 0 0 24px;">Hi ${fullName.split(' ')[0]}, use this code to verify your email:</p>
            <div style="background: #f8f7f4; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <div style="font-size: 42px; font-weight: 700; letter-spacing: 10px; color: #0d0d0d;">${otp}</div>
            </div>
            <p style="color: #aaa; font-size: 13px; margin: 0;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
          </div>
          <p style="text-align: center; color: #aaa; font-size: 12px; margin-top: 24px;">The Achievers Club · Nashik Branch · Start Young, Retire Young</p>
        </div>
      `,
    });

    if (sendError) {
      console.error('OTP email error:', sendError);
      return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent to your email.' });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}