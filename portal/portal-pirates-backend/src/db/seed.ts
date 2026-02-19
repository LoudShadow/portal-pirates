import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { transactions } from './schema';
import dotenv from 'dotenv';

dotenv.config();

const mockTransactions = [
  { value: '4.50', vendor: 'Pret A Manger', time: new Date('2026-02-10T08:30:00Z') },
  { value: '62.99', vendor: 'Amazon', time: new Date('2026-02-11T14:22:00Z') },
  { value: '12.00', vendor: 'Uber', time: new Date('2026-02-12T18:05:00Z') },
  { value: '8.75', vendor: 'Starbucks', time: new Date('2026-02-13T09:10:00Z') },
  { value: '120.00', vendor: 'British Gas', time: new Date('2026-02-14T10:00:00Z') },
  { value: '24.50', vendor: 'Sainsburys', time: new Date('2026-02-15T17:45:00Z') },
  { value: '9.99', vendor: 'Spotify', time: new Date('2026-02-15T00:00:00Z') },
  { value: '35.00', vendor: 'Zara', time: new Date('2026-02-16T13:30:00Z') },
  { value: '6.80', vendor: 'Greggs', time: new Date('2026-02-17T08:00:00Z') },
  { value: '200.00', vendor: 'HMRC', time: new Date('2026-02-18T09:00:00Z') },
];

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log('Seeding transactions...');
  await db.insert(transactions).values(mockTransactions);
  console.log(`Inserted ${mockTransactions.length} transactions.`);

  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
