import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  APP_PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().optional(),
  NODE_ENV: z.string().optional()
});

export const env = envSchema.parse(process.env);
