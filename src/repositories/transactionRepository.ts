import type { Knex } from 'knex';

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface CreateTransactionData {
  reference: string;
  sender_wallet_id?: number | null;
  receiver_wallet_id?: number | null;
  amount: number;
  type: TransactionType;
  status?: TransactionStatus;
  description?: string | null;
}

export async function create(data: CreateTransactionData, trx: Knex.Transaction): Promise<number> {
  const [id] = await trx('transactions').insert(data);
  if (id === undefined) {
    throw new Error('Failed to record transaction');
  }
  return id;
}