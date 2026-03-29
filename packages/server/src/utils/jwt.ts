import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { TokenPayload } from '@vera/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const ACCESS_TOKEN_EXPIRY = '15m';

export function generateAccessToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

export function getRefreshTokenExpiry(): Date {
  const now = new Date();
  now.setDate(now.getDate() + 7); // 7 days
  return now;
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
