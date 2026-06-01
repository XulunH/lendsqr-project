import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
const EXPRESS_IN = '1d'

export interface TokenPayload{
    userId: number;
}

export function signToken(payload: TokenPayload): string {
    return jwt.sign(payload,JWT_SECRET, {expiresIn: EXPRESS_IN});
}

export function verifyToken(token: string): TokenPayload{
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
