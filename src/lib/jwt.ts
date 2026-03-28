import { SignJWT, jwtVerify } from 'jose';

// Secret key — must be at least 32 characters
// Pull from env, fallback for local dev only
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'achievers-club-nashik-secret-key-32chars!!'
);

export interface JWTPayload {
  userId: string;
  fullName: string;
  email: string;
  role: string;
}

// Create a signed JWT token
export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

// Verify and decode a JWT token — returns null if invalid/expired
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}