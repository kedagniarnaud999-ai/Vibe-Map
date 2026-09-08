import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export const createPool = () => {
  if (!process.env.SQL_HOST) {
    return null;
  }
  if (!global._postgresPool) {
    try {
      global._postgresPool = new Pool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DB_NAME,
        max: 5,
        connectionTimeoutMillis: 3000,
      });

      global._postgresPool.on('error', (err) => {
        console.warn('Postgres pool warning:', err?.message || err);
      });
    } catch (e) {
      console.warn('Failed to initialize postgres pool:', e);
      return null;
    }
  }
  return global._postgresPool;
};

const pool = createPool();
export const db = pool ? drizzle(pool, { schema }) : (new Proxy({}, {
  get: (_target, prop) => {
    if (prop === 'query') {
      return new Proxy({}, {
        get: () => ({ findFirst: async () => null, findMany: async () => [] })
      });
    }
    return () => ({
      values: () => ({ onConflictDoUpdate: () => Promise.resolve(), returning: () => Promise.resolve([]) }),
      set: () => ({ where: () => Promise.resolve() }),
      where: () => Promise.resolve([])
    });
  }
}) as any);
