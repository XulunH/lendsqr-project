import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import * as userService from '../services/userService.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body ?? {};

  if (!email || !password || !firstName || !lastName) {
    throw new AppError('email, password, firstName and lastName are required', 400);
  }

  const result = await userService.register({ email, password, firstName, lastName });
  res.status(201).json({ status: 'success', data: result });
});