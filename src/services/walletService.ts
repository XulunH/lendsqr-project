import { randomUUID } from 'node:crypto';
import db from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import * as userRepository from '../repositories/userRepository.js';
import * as walletRepository from '../repositories/walletRepository.js';
import * as transactionRepository from '../repositories/transactionRepository.js';

function assertValidAmount(amount: unknown): asserts amount is number {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    throw new AppError('Amount must be a positive number', 400);
  }
}

export async function getBalance(userId: number) {
  const wallet = await walletRepository.findByUserId(userId);
  if (!wallet) throw new AppError('Wallet not found', 404);
  return wallet;
}

export async function fund(userId: number, amount: number) {
  assertValidAmount(amount);

  return db.transaction(async (trx) => {
    const wallet = await walletRepository.findByUserId(userId, trx);
    if (!wallet) throw new AppError('Wallet not found', 404);

    await walletRepository.incrementBalance(wallet.id, amount, trx);
    await transactionRepository.create(
      { reference: randomUUID(), receiver_wallet_id: wallet.id, amount, type: 'DEPOSIT', status: 'SUCCESS' },
      trx
    );

    return walletRepository.findByUserId(userId, trx);
  });
}

export async function withdraw(userId: number, amount: number) {
  assertValidAmount(amount);

  return db.transaction(async (trx) => {
    const wallet = await walletRepository.findByUserIdForUpdate(userId, trx);
    if (!wallet) throw new AppError('Wallet not found', 404);

    if (Number(wallet.balance) < amount) {
      throw new AppError('Insufficient funds', 400);
    }

    await walletRepository.decrementBalance(wallet.id, amount, trx);
    await transactionRepository.create(
      { reference: randomUUID(), sender_wallet_id: wallet.id, amount, type: 'WITHDRAWAL', status: 'SUCCESS' },
      trx
    );

    return walletRepository.findByUserId(userId, trx);
  });
}

export async function transfer(senderUserId: number, recipientEmail: string, amount: number) {
  assertValidAmount(amount);

  return db.transaction(async (trx) => {
    const recipient = await userRepository.findByEmail(recipientEmail);
    if (!recipient) throw new AppError('Recipient not found', 404);
    if (recipient.id === senderUserId) throw new AppError('You cannot transfer to yourself', 400);

    const wallets = await walletRepository.findForUpdateByUserIds([senderUserId, recipient.id], trx);
    const senderWallet = wallets.find((w) => w.user_id === senderUserId);
    const recipientWallet = wallets.find((w) => w.user_id === recipient.id);

    if (!senderWallet) throw new AppError('Sender wallet not found', 404);
    if (!recipientWallet) throw new AppError('Recipient wallet not found', 404);

    if (Number(senderWallet.balance) < amount) {
      throw new AppError('Insufficient funds', 400);
    }

    await walletRepository.decrementBalance(senderWallet.id, amount, trx);
    await walletRepository.incrementBalance(recipientWallet.id, amount, trx);
    await transactionRepository.create(
      {
        reference: randomUUID(),
        sender_wallet_id: senderWallet.id,
        receiver_wallet_id: recipientWallet.id,
        amount,
        type: 'TRANSFER',
        status: 'SUCCESS',
      },
      trx
    );

    return walletRepository.findByUserId(senderUserId, trx);
  });
}