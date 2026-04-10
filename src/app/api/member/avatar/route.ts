import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

// GET — fetch current user's avatar
export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });

    const [rows]: any = await pool.query(
      `SELECT avatar_url FROM Users WHERE id = ?`, [user.userId]
    );
    const avatar = (rows as any[])[0]?.avatar_url || null;
    return NextResponse.json({ avatar_url: avatar });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch avatar.' }, { status: 500 });
  }
}

// POST — upload new avatar (base64)
export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) return NextResponse.json({ error: 'No file provided.' }, { status: 400 });

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, or WebP images allowed.' }, { status: 400 });
    }

    // Validate size — max 2MB
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 2MB.' }, { status: 400 });
    }

    // Convert to base64 data URL
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Save to DB
    await pool.query(
      `UPDATE Users SET avatar_url = ? WHERE id = ?`,
      [dataUrl, user.userId]
    );

    return NextResponse.json({ success: true, avatar_url: dataUrl });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}

// DELETE — remove avatar
export async function DELETE() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });

    await pool.query(`UPDATE Users SET avatar_url = NULL WHERE id = ?`, [user.userId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove avatar.' }, { status: 500 });
  }
}