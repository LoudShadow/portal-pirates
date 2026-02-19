import { Router } from 'express';
import { getDb } from '../db/client';
import { transactions } from '../db/schema';

export const router = Router();

// GET /api/transactions - return all transactions
router.get('/transactions', async (_req, res) => {
  const db = await getDb();
  const all = await db.select().from(transactions).limit(10);
  res.json(all);
});
