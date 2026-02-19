import dotenv from "dotenv";
dotenv.config(); // Must be first — before any module reads process.env
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import express from "express";
import cors from "cors";
import path from "path";
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { AuthTypes, Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';

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
      authType: AuthTypes.IAM,
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

  // Generate public/private key pair for JWT
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });

  const PASSWORD_HASH = "$2b$10$TTddOGbAYpVhSx1Us8RD8enaa/qhlR0aGs9QIT2hiLNP15wQjZ7.e";
  const USERNAME = "user-1";

  // Middleware to verify JWT
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  app.get("/", (_req, res) => {
    res.status(200).send({ health: 'ok' });
  });

  app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (
      username === USERNAME &&
      (await bcrypt.compare(password, PASSWORD_HASH))
    ) {
      const token = jwt.sign({ username }, privateKey, {
        algorithm: "RS256",
        expiresIn: "24h",
      });
      res.json({ token });
    } else {
      res.status(401).send("Invalid credentials");
    }
  });

  app.post("/hint", authenticateToken, async (req, res) => {
    const data = req.body;
    const content = await generateHint(undefined, undefined, data);
    res.status(200).send({ hint: content });
  });

  app.use("/api", dbRouter);

  app.listen(PORT, () => {
    console.log("Server running at PORT:", PORT);
  }).on("error", (error: any) => {
    throw new Error(error.message);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});