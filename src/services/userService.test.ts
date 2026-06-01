import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../repositories/userRepository.js');
vi.mock('../repositories/walletRepository.js');
vi.mock('./karmaService.js');
vi.mock('../config/database.js', () => ({
  default: {
    transaction: vi.fn(async (cb: (trx: unknown) => unknown) => cb({})),
  },
}));

import * as userRepository from '../repositories/userRepository.js';
import * as walletRepository from '../repositories/walletRepository.js';
import { isBlacklisted } from './karmaService.js';
import { register } from './userService.js';

describe('userService.register', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('rejects a blacklisted user', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(undefined);
    vi.mocked(isBlacklisted).mockResolvedValue(true);

    await expect(
      register({ email: 'bad@example.com',  firstName: 'A', lastName: 'B' })
    ).rejects.toThrow('blacklisted');
  });

  it('rejects a duplicate email', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue({ id: 1 } as never);

    await expect(
      register({ email: 'dupe@example.com', firstName: 'A', lastName: 'B' })
    ).rejects.toThrow('already exists');
  });

  it('creates a user and a wallet for a clean signup', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(undefined);
    vi.mocked(isBlacklisted).mockResolvedValue(false);
    vi.mocked(userRepository.create).mockResolvedValue(42);
    vi.mocked(walletRepository.create).mockResolvedValue(1);

    const result = await register({
      email: 'good@example.com', firstName: 'A', lastName: 'B',
    });

    expect(result.user.id).toBe(42);
    expect(result.token).toBeTruthy();
    expect(walletRepository.create).toHaveBeenCalledWith({ user_id: 42 }, expect.anything());
  });
});