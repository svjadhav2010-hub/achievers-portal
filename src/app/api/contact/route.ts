import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required.' },
        { status: 400 }
      );
    }

    // Send notification email to the client
    const { error: sendError } = await resend.emails.send({
      from: 'Achievers Club <onboarding@resend.dev>', // change to your verified domain later
      to: process.env.CONTACT_TO_EMAIL || 'hello@achieversnashik.in',
      replyTo: email,
      subject: `[Contact Form] ${subject} — from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8f7f4;">
          <div style="background: #0d0d0d; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
            <h1 style="color: white; font-size: 24px; margin: 0 0 4px;">New Contact Form Submission</h1>
            <p style="color: #00aac8; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">The Achievers Club · Nashik</p>
          </div>

          <div style="background: white; border-radius: 16px; padding: 32px; border: 1px solid rgba(0,0,0,0.06);">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; width: 120px;">Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #0d0d0d; font-size: 15px; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #00aac8; font-size: 15px;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Phone</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #0d0d0d; font-size: 15px;">${phone || '—'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Subject</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #0d0d0d; font-size: 15px;">${subject}</td>
              </tr>
            </table>

            <div style="margin-top: 24px;">
              <p style="color: #888; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">Message</p>
              <div style="background: #f8f7f4; border-radius: 12px; padding: 20px; color: #3a3a3a; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</div>
            </div>

            <div style="margin-top: 28px; padding-top: 24px; border-top: 1px solid #f0f0f0;">
              <a href="mailto:${email}" style="display: inline-block; background: #f5821f; color: white; padding: 12px 28px; border-radius: 100px; text-decoration: none; font-weight: 600; font-size: 14px;">Reply to ${name} →</a>
            </div>
          </div>

          <p style="text-align: center; color: #aaa; font-size: 12px; margin-top: 24px;">This email was sent from the contact form at achieversnashik.in</p>
        </div>
      `,
    });

    if (sendError) {
      console.error('Resend error:', sendError);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 }
      );
    }

    // Send auto-reply to the person who submitted
    await resend.emails.send({
      from: 'Achievers Club <onboarding@resend.dev>',
      to: email,
      subject: `We got your message, ${name.split(' ')[0]}! 👋`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8f7f4;">
          <div style="background: #0d0d0d; border-radius: 16px; padding: 40px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; font-size: 28px; margin: 0 0 8px;">Thanks for reaching out!</h1>
            <p style="color: rgba(255,255,255,0.5); margin: 0; font-size: 15px;">We'll get back to you within 24 hours.</p>
          </div>

          <div style="background: white; border-radius: 16px; padding: 32px; border: 1px solid rgba(0,0,0,0.06); margin-bottom: 24px;">
            <p style="color: #3a3a3a; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">Hi ${name.split(' ')[0]},</p>
            <p style="color: #3a3a3a; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">We've received your message about <strong>${subject}</strong> and our team will get back to you shortly.</p>
            <p style="color: #3a3a3a; font-size: 15px; line-height: 1.7; margin: 0;">In the meantime, feel free to explore our community or join us on WhatsApp for a faster response.</p>
          </div>

          <div style="text-align: center;">
            <a href="https://achieversnashik.in/register" style="display: inline-block; background: #f5821f; color: white; padding: 14px 32px; border-radius: 100px; text-decoration: none; font-weight: 600; font-size: 15px;">Join the Community →</a>
          </div>

          <p style="text-align: center; color: #aaa; font-size: 12px; margin-top: 24px;">The Achievers Club · Nashik Branch · Start Young, Retire Young</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}