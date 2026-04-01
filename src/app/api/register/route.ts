import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Define the exact shape of the database error for strict mode
interface MySQLError {
  code?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, phone, startupName, hasPanCard, referredBy } = body;

    // 1. Logic Gate: Enforce the strict onboarding rules
    if (!hasPanCard) {
      return NextResponse.json(
        { error: 'Verification failed. 18+ age and PAN card are mandatory.' },
        { status: 400 }
      );
    }

    // 2. Security: Hash the password (encrypt it) before it touches the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Generate secure, unique IDs for the relational tables
    const userId = crypto.randomUUID();
    const applicationId = crypto.randomUUID();

    // 4. Execute SQL: Insert the core user credentials first
    await pool.query(
      `INSERT INTO Users (id, fullName, email, password_hash, role, referred_by, phone) 
       VALUES (?, ?, ?, ?, 'PENDING', ?, ?)`,
      [userId, fullName, email, hashedPassword, referredBy || null, phone || null]
    );

    // 5. Execute SQL: Link the user's application data using the Foreign Key (user_id)
    await pool.query(
      `INSERT INTO Applications (id, user_id, startup_name, has_pan_card, status) 
       VALUES (?, ?, ?, ?, 'PENDING')`,
      [applicationId, userId, startupName || null, hasPanCard]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully! Awaiting CEO approval.' 
    });

  } catch (error) {
    console.error('Database Error:', error);
    
    // Safely cast the unknown error to our custom interface
    const dbError = error as MySQLError;
    
    // Catch duplicate emails instantly based on the UNIQUE constraint in TiDB
    if (dbError.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'This email is already registered.' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Failed to submit application.' }, { status: 500 });
  }
}