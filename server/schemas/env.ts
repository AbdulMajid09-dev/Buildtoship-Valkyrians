import { z } from 'zod';

export const EnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  SESSION_SECRET: z.string().min(16, 'SESSION_SECRET must be at least 16 characters long').default('production-grade-agri-advisory-secret-key-32-chars'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000), // 15 mins
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
});

export type ValidatedEnvironment = z.infer<typeof EnvironmentSchema>;

export function validateEnv(): ValidatedEnvironment {
  const parsed = EnvironmentSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ Invalid environment variables configuration:', parsed.error.format());
    throw new Error('Environment variable validation failed');
  }
  return parsed.data;
}
