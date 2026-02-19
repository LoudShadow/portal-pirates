import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { AuthTypes, Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!_db) {
    const pool = createPool();
    _db = drizzle(pool, { schema });
  }
  return _db;
}

function createPool(): Pool {
  const isCloudRun = !!process.env.CLOUD_SQL_INSTANCE;

  if (isCloudRun) {
    // ── Cloud Run: IAM auth via the Cloud SQL Connector (no password) ──────
    const connector = new Connector();
    const clientOpts = connector.getOptions({
      instanceConnectionName: process.env.CLOUD_SQL_INSTANCE!,
      ipType: IpAddressTypes.PRIVATE,
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

// Proxy so that routes always get the initialised db (after dotenv has loaded)
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});
