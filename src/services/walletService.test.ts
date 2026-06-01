import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Wallet } from '../types/models.js';

vi.mock('../repositories/walletRepository.js');
vi.mock('../repositories/transactionRepository.js');
vi.mock('../repositories/userRepository.js');
vi.mock('../config/database.js', () => ({
  default: { transaction: vi.fn(async (cb: (trx: unknown) => unknown) => cb({})) },
}));

import * as walletRepository from '../repositories/walletRepository.js';
import * as transactionRepository from '../repositories/transactionRepository.js';
import * as userRepository from '../repositories/userRepository.js';
import { fund, withdraw, transfer } from './walletService.js';

const wallet = (over: Partial<Wallet>): Wallet => ({
  id: 1, user_id: 10, balance: '0.0000', currency: 'USD',
  created_at: new Date(), updated_at: new Date(), ...over,
});

describe('walletService', () => {
  beforeEach(() => vi.resetAllMocks());

  it('fund: increments balance and records a DEPOSIT', async () => {
    vi.mocked(walletRepository.findByUserId).mockResolvedValue(wallet({ id: 1, user_id: 10 }));
    await fund(10, 100);
    expect(walletRepository.incrementBalance).toHaveBeenCalledWith(1, 100, expect.anything());
    expect(transactionRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'DEPOSIT', amount: 100 }), expect.anything()
    );
  });

  it('fund: rejects a non-positive amount', async () => {
    await expect(fund(10, -5)).rejects.toThrow('positive');
  });

  it('withdraw: rejects when balance is insufficient', async () => {
    vi.mocked(walletRepository.findByUserIdForUpdate).mockResolvedValue(wallet({ balance: '50.0000' }));
    await expect(withdraw(10, 100)).rejects.toThrow('Insufficient funds');
  });

  it('withdraw: succeeds when funds are sufficient', async () => {
    vi.mocked(walletRepository.findByUserIdForUpdate).mockResolvedValue(wallet({ id: 1, balance: '200.0000' }));
    await withdraw(10, 100);
    expect(walletRepository.decrementBalance).toHaveBeenCalledWith(1, 100, expect.anything());
    expect(transactionRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'WITHDRAWAL' }), expect.anything()
    );
  });

  it('transfer: rejects transferring to yourself', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue({ id: 10 } as never);
    await expect(transfer(10, 'me@example.com', 50)).rejects.toThrow('yourself');
  });

  it('transfer: moves funds between two wallets', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue({ id: 20 } as never);
    vi.mocked(walletRepository.findForUpdateByUserIds).mockResolvedValue([
      wallet({ id: 1, user_id: 10, balance: '500.0000' }),
      wallet({ id: 2, user_id: 20, balance: '0.0000' }),
    ]);
    await transfer(10, 'friend@example.com', 100);
    expect(walletRepository.decrementBalance).toHaveBeenCalledWith(1, 100, expect.anything());
    expect(walletRepository.incrementBalance).toHaveBeenCalledWith(2, 100, expect.anything());
    expect(transactionRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'TRANSFER' }), expect.anything()
    );
  });
});