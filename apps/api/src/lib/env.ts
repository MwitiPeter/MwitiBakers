import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z
  .object({
    APP_PORT: z.coerce.number().int().positive().default(4000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    CORS_ORIGIN: z.string().optional(),
    MONGODB_URI: z.string().optional(),
    JWT_SECRET: z.string().optional(),
    PAYSTACK_SECRET_KEY: z.string().optional(),
    PAYSTACK_CALLBACK_URL: z.string().url().optional(),
    SENTRY_DSN: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV !== 'production') return;

    if (!data.MONGODB_URI) {
      ctx.addIssue({ code: 'custom', message: 'MONGODB_URI is required in production', path: ['MONGODB_URI'] });
    }
    if (!data.JWT_SECRET || data.JWT_SECRET.length < 32) {
      ctx.addIssue({ code: 'custom', message: 'JWT_SECRET must be at least 32 characters in production', path: ['JWT_SECRET'] });
    }
    if (!data.PAYSTACK_SECRET_KEY) {
      ctx.addIssue({ code: 'custom', message: 'PAYSTACK_SECRET_KEY is required in production', path: ['PAYSTACK_SECRET_KEY'] });
    }
    if (!data.PAYSTACK_CALLBACK_URL) {
      ctx.addIssue({ code: 'custom', message: 'PAYSTACK_CALLBACK_URL is required in production', path: ['PAYSTACK_CALLBACK_URL'] });
    }
    if (!data.CORS_ORIGIN) {
      ctx.addIssue({ code: 'custom', message: 'CORS_ORIGIN is required in production', path: ['CORS_ORIGIN'] });
    }
  });

export const env = envSchema.parse(process.env);
