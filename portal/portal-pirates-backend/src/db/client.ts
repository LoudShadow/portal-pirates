import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { AuthTypes, Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export async function getDb() {
  if (!_db) {
    const pool = await createPool();
    _db = drizzle(pool, { schema });
  }
  return _db;
}

async function createPool(): Promise<Pool> {
  const isCloudRun = !!process.env.CLOUD_SQL_INSTANCE;

  if (isCloudRun) {
    // ── Cloud Run: IAM auth via the Cloud SQL Connector (no password) ──────
    const connector = new Connector();
    const clientOpts = await connector.getOptions({
      instanceConnectionName: process.env.CLOUD_SQL_INSTANCE!,
      ipType: IpAddressTypes.PUBLIC,
      authType: AuthTypes.IAM,
    });
    return new Pool({
      ...clientOpts,
      user: process.env.CLOUD_SQL_IAM_USER,  // e.g. service-account@project.iam
      database: process.env.DB_NAME || 'portal_pirates',
      max: 5,
    });
  }

  // ── Local dev: password via DATABASE_URL (proxied by Cloud SQL Auth Proxy)
  return new Pool({ connectionString: process.env.DATABASE_URL });
}
