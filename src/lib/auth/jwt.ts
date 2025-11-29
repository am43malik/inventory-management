import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface DecodedToken {
  userId: string;
  email: string;
  role: 'admin' | 'cashier';
  iat: number;
  exp: number;
}

export function generateToken(
  userId: string,
  email: string,
  role: 'admin' | 'cashier'
): string {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch (error) {
    return null;
  }
}

export async function getToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('token')?.value || null;
  } catch (error) {
    return null;
  }
}

export async function validateRequest(): Promise<DecodedToken | null> {
  const token = await getToken();
  if (!token) return null;
  return verifyToken(token);
}
