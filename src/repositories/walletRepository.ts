import type { Knex } from 'knex';

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