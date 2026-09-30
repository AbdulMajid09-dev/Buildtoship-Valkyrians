import dotenv from 'dotenv';
dotenv.config();

import { validateEnv } from './schemas/env.js';
import { getDb } from './db/connection.js';
import { createApp } from './app.js';

async function bootstrap() {
  try {
    console.log('[Server] Validating environment variables...');
    const env = validateEnv();

    console.log('[Server] Initializing database connection...');
    await getDb();

    const app = createApp();
    const port = env.PORT || 5000;

    const server = app.listen(port, () => {
      console.log(`[Server] Agriculture Advisory Backend running on port ${port} (${env.NODE_ENV})`);
      console.log(`[Server] Health check available at http://localhost:${port}/api/health`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        try {
          const db = await getDb();
          await db.close();
          console.log('[Server] Database connections closed.');
          process.exit(0);
        } catch (err) {
          console.error('[Server] Error during shutdown:', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
