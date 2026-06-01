import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import * as walletService from '../services/walletService.js';

function getUserId(req: Request): number {
  if (!req.user) throw new AppError('Unauthenticated', 401);
  return req.user.id;
}

export const getBalance = asyncHandler(async (req: Request, res: Response) => {
  const wallet = await walletService.getBalance(getUserId(req));
  res.status(200).json({ status: 'success', data: wallet });
});

export const fund = asyncHandler(async (req: Request, res: Response) => {
  const wallet = await walletService.fund(getUserId(req), req.body?.amount);
  res.status(200).json({ status: 'success', data: wallet });
});

export const withdraw = asyncHandler(async (req: Request, res: Response) => {
  const wallet = await walletService.withdraw(getUserId(req), req.body?.amount);
  res.status(200).json({ status: 'success', data: wallet });
});

export const transfer = asyncHandler(async (req: Request, res: Response) => {
  const { recipientEmail, amount } = req.body ?? {};
  if (!recipientEmail) throw new AppError('recipientEmail is required', 400);
  const wallet = await walletService.transfer(getUserId(req), recipientEmail, amount);
  res.status(200).json({ status: 'success', data: wallet });
});