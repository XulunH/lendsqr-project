import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token.js';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ status: 'error', message: 'Missing or malformed Authorization header' });
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId };
    next();
  } catch {
    return res
      .status(401)
      .json({ status: 'error', message: 'Invalid or expired token' });
  }
}