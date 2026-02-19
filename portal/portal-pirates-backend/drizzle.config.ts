import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/db/schema.ts',       // Source of truth: your schema definitions
  out: './drizzle',                 // Output folder for generated SQL migration files
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
