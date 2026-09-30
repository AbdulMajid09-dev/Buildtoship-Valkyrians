import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface DbQueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

export interface IDatabase {
  query<T = any>(text: string, params?: any[]): Promise<DbQueryResult<T>>;
  close(): Promise<void>;
  isPGlite: boolean;
}

let dbInstance: IDatabase | null = null;
let dbPromise: Promise<IDatabase> | null = null;

export async function getDb(): Promise<IDatabase> {
  if (dbInstance) {
    return dbInstance;
  }
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = (async () => {
    const databaseUrl = process.env.DATABASE_URL?.trim();

    if (databaseUrl && databaseUrl.length > 0) {
      console.log('[DB] Connecting to PostgreSQL via DATABASE_URL...');
      const pool = new pg.Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'production' && !databaseUrl.includes('localhost')
          ? { rejectUnauthorized: false }
          : false,
      });

      // Test connection
      const client = await pool.connect();
      client.release();
      console.log('[DB] PostgreSQL connected successfully.');

      const db: IDatabase = {
        isPGlite: false,
        async query<T = any>(text: string, params?: any[]): Promise<DbQueryResult<T>> {
          const res = await pool.query(text, params);
          return {
            rows: res.rows as T[],
            rowCount: res.rowCount ?? res.rows.length,
          };
        },
        async close() {
          await pool.end();
          dbInstance = null;
          dbPromise = null;
        },
      };

      await initializeDatabase(db);
      dbInstance = db;
      return db;
    } else {
      console.log('[DB] DATABASE_URL not provided. Initializing embedded PostgreSQL (PGlite)...');
      const { PGlite } = await import('@electric-sql/pglite');
      
      const isTest = process.env.NODE_ENV === 'test';
      const dataDir = isTest
        ? undefined
        : path.resolve(process.cwd(), 'data', 'postgres');

      if (dataDir && !fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      let pglite: any;
      try {
        pglite = dataDir ? new PGlite(dataDir) : new PGlite();
        await pglite.waitReady;
        console.log(`[DB] Embedded PostgreSQL (PGlite) initialized (${isTest ? 'in-memory' : dataDir})`);
      } catch (initErr: any) {
        console.warn(`[DB] Persistent PGlite initialization encountered: ${initErr?.message}. Falling back to memory storage...`);
        pglite = new PGlite();
        await pglite.waitReady;
        console.log('[DB] Embedded PostgreSQL (PGlite) initialized (fallback in-memory)');
      }

      const db: IDatabase = {
        isPGlite: true,
        async query<T = any>(text: string, params?: any[]): Promise<DbQueryResult<T>> {
          const res = await pglite.query<T>(text, params);
          return {
            rows: res.rows,
            rowCount: res.rows.length,
          };
        },
        async close() {
          await pglite.close();
          dbInstance = null;
          dbPromise = null;
        },
      };

      await initializeDatabase(db);
      dbInstance = db;
      return db;
    }
  })();

  return dbPromise;
}

export async function initializeDatabase(db: IDatabase) {
  try {
    // Check if users table exists
    const checkTable = await db.query(
      "SELECT 1 FROM information_schema.tables WHERE table_name = 'users';"
    );

    if (checkTable.rows.length === 0) {
      console.log('[DB] Applying initial database schema...');
      const schemaPath = path.resolve(process.cwd(), 'database.sql');
      if (fs.existsSync(schemaPath)) {
        const rawSql = fs.readFileSync(schemaPath, 'utf-8');
        
        // Remove line comments and block comments
        const cleanSql = rawSql
          .replace(/--.*$/gm, '')
          .replace(/\/\*[\s\S]*?\*\//g, '');

        // Split into distinct statements by semicolon
        const statements = cleanSql
          .split(';')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        for (const statement of statements) {
          try {
            await db.query(statement);
          } catch (stmtErr: any) {
            // Ignore benign already exists errors
            if (
              !stmtErr.message?.includes('already exists') &&
              !stmtErr.message?.includes('extension')
            ) {
              console.warn(`[DB Schema Warning] ${stmtErr.message} on: ${statement.slice(0, 50)}...`);
            }
          }
        }
        console.log('[DB] Schema applied successfully.');
      } else {
        console.error('[DB] database.sql file not found at:', schemaPath);
      }
    } else {
      console.log('[DB] Database tables already present.');
    }
  } catch (error) {
    console.error('[DB] Error during database initialization:', error);
    throw error;
  }
}
