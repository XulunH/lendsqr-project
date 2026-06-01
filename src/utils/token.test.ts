import { describe, it, expect } from 'vitest';
import { signToken, verifyToken } from './token.js';

describe('token utility', () => {
  it('signs a token and verifies it back to the same payload', () => {
    const token = signToken({ userId: 42 });
    const payload = verifyToken(token);
    expect(payload.userId).toBe(42);
  });

  it('throws when verifying a tampered/invalid token', () => {
    expect(() => verifyToken('not-a-real-token')).toThrow();
  });
});