import { pgTable, uuid, numeric, text, timestamp } from 'drizzle-orm/pg-core';

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  value: numeric('value', { precision: 10, scale: 2 }).notNull(),
  vendor: text('vendor').notNull(),
  time: timestamp('time', { withTimezone: true }).defaultNow().notNull(),
});
