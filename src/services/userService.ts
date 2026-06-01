import db from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { signToken } from '../utils/token.js';
import { isBlacklisted } from './karmaService.js';
import * as userRepository from '../repositories/userRepository.js';
import * as walletRepository from '../repositories/walletRepository.js';


export interface RegisterInput {
  email: string;
  firstName: string;
  lastName: string;
}

export async function register(input: RegisterInput) {
  const { email, firstName, lastName } = input;

  // Reject duplicates
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new AppError('A user with this email already exists', 409);
  }

  // Karma blacklist check
  if (await isBlacklisted(email)) {
    throw new AppError('User is blacklisted and cannot be onboarded', 403);
  }

  // Create user and wallet atomically
  const userId = await db.transaction(async (trx) => {
    const id = await userRepository.create(
      { email, first_name: firstName, last_name: lastName },
      trx
    );
    await walletRepository.create({ user_id: id }, trx);
    return id;
  });

  // Hand back a faux token
  const token = signToken({ userId });

  return {
    user: { id: userId, email, firstName, lastName },
    token,
  };
}