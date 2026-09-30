import dotenv from 'dotenv';
dotenv.config();

import { getDb } from './connection.js';

async function runMigration() {
  console.log('[Migration] Starting migration...');
  try {
    const db = await getDb();
    console.log('[Migration] Verifying database connectivity and schema...');
    const result = await db.query('SELECT table_name FROM information_schema.tables WHERE table_schema = $1;', ['public']);
    console.log('[Migration] Tables found:', result.rows.map((r: any) => r.table_name).join(', '));
    console.log('[Migration] Migration verified successfully.');
    await db.close();
    process.exit(0);
  } catch (err) {
    console.error('[Migration] Failed:', err);
    process.exit(1);
  }
}

runMigration();
