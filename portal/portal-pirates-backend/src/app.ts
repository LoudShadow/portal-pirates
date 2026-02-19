import dotenv from "dotenv";
dotenv.config(); // Must be first — before any module reads process.env

import express from "express";
import cors from "cors";
import path from "path";
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';

import { generateHint } from "./ai/ai";
import { router as dbRouter } from "./routes/db.routes";

const PORT = process.env.PORT || 3001;

async function createMigrationPool(): Promise<Pool> {
  const isCloudRun = !!process.env.CLOUD_SQL_INSTANCE;

  if (isCloudRun) {
    const connector = new Connector();
    const clientOpts = await connector.getOptions({
      instanceConnectionName: process.env.CLOUD_SQL_INSTANCE!,
      ipType: IpAddressTypes.PRIVATE,
      authType: 'IAM',
    });
    return new Pool({
      ...clientOpts,
      user: process.env.CLOUD_SQL_IAM_USER,
      database: process.env.DB_NAME || 'portal_pirates',
    });
  }

  return new Pool({ connectionString: process.env.DATABASE_URL });
}

async function main() {
  // ── Run migrations on startup ──────────────────────────────────────────
  console.log('Running database migrations...');
  const pool = await createMigrationPool();
  const db = drizzle(pool);
  await migrate(db, { migrationsFolder: path.join(__dirname, '../drizzle') });
  await pool.end();
  console.log('Migrations complete.');

  // ── Start Express ──────────────────────────────────────────────────────
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.get("/", (_req, res) => {
    res.status(200).send({ health: 'ok' });
  });

  app.post("/hint", async (req, res) => {
    const data = req.body;
    const content = await generateHint(undefined, undefined, data);
    res.status(200).send({ hint: content });
  });

  app.use("/api", dbRouter);

  app.listen(PORT, () => {
    console.log("Server running at PORT:", PORT);
  }).on("error", (error) => {
    throw new Error(error.message);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});