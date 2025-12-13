import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
});

export const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('Invalid enviroment variables', _env.error.format());

  throw new Error('Invalid enviroment variables');
}

export const env = _env.data;
