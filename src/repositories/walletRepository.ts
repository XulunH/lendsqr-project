import type { Knex } from 'knex';
import db from '../config/database.js';
import type { Wallet } from '../types/models.js';

export interface CreateWalletData {
  user_id: number;
  currency?: string;
}

export async function create(data: CreateWalletData, trx: Knex.Transaction): Promise<number> {
  const [id] = await trx('wallets').insert(data);
  if (id === undefined) {
    throw new Error('Failed to create wallet');
  }
  return id;
}

export async function findByUserId(userId: number, trx?: Knex.Transaction): Promise<Wallet | undefined> {
  return (trx ?? db)<Wallet>('wallets').where({ user_id: userId }).first();
}

// Locks this user's wallet row for the rest of the transaction
export async function lockWalletByUserId(userId: number, trx: Knex.Transaction): Promise<Wallet | undefined> {
  return trx<Wallet>('wallets').where({ user_id: userId }).forUpdate().first();
}

// Locks multiple wallets ordered by id to avoid deadlocks
export async function lockWalletsByUserIds(userIds: number[], trx: Knex.Transaction): Promise<Wallet[]> {
  return trx<Wallet>('wallets').whereIn('user_id', userIds).orderBy('id', 'asc').forUpdate();
}

export async function incrementBalance(walletId: number, amount: number, trx: Knex.Transaction): Promise<void> {
  await trx('wallets').where({ id: walletId }).increment('balance', amount);
}

export async function decrementBalance(walletId: number, amount: number, trx: Knex.Transaction): Promise<void> {
  await trx('wallets').where({ id: walletId }).decrement('balance', amount);
}