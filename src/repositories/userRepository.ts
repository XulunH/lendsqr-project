import type { Knex } from 'knex';
import db from '../config/database.js';
import type { User } from '../types/models.js';

export interface CreateUserData {
  email: string;
  first_name: string;
  last_name: string;
}

export async function findByEmail(email: string): Promise<User | undefined> {
  return db<User>('users').where({ email }).first();
}

export async function create(data: CreateUserData, trx: Knex.Transaction): Promise<number> {
  const [id] = await trx('users').insert(data);
  if (id === undefined) {
    throw new Error('Failed to create user');
  }
  return id;
}