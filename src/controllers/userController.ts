import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import * as userService from '../services/userService.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, firstName, lastName } = req.body ?? {};

  if (!email || !firstName || !lastName) {
    throw new AppError('email,firstName and lastName are required', 400);
  }

  const result = await userService.register({ email, firstName, lastName });
  res.status(201).json({ status: 'success', data: result });
});