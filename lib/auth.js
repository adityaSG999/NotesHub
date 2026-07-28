import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production');
  }
  console.warn('JWT_SECRET is not set. Using fallback development secret. Do not use this in production.');
}

const secret = JWT_SECRET || 'fallback-secret-for-development';

export function signToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}
