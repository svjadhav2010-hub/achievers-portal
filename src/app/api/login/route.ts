import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers'; // 👈 Add this exact line

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // 1. Query the database for the user using the new 'Users' table
    // We use type 'any' here to easily extract the rows from the mysql2 array
    const [rows]: any = await pool.query(
      `SELECT id, fullName, email, password_hash, role FROM Users WHERE email = ?`,
      [email]
    );

    const users = rows as any[];

    // 2. If the array is empty, the email doesn't exist
    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const user = users[0];

    // 3. Security: Compare the plain-text password to the encrypted hash in TiDB
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      // Always return the exact same generic error message for security
      // so hackers can't guess if an email exists in your system
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // 🔴 NEW: Wait for the cookie store to resolve, THEN set the cookie
    const cookieStore = await cookies();
    
    cookieStore.set('userRole', user.role, {
      httpOnly: true, // Prevents hackers from reading the cookie via JavaScript
      secure: process.env.NODE_ENV === 'production', // Requires HTTPS in production
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // Wristband expires in 1 week
    });

    // 4. Success! Return the user data (excluding the password hash) to the frontend
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role, 
      },
      message: 'Login successful!',
    });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}