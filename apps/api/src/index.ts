import { createApp } from './app';
import { env } from './lib/env';
// register payment providers/adapters
import './services/paystack';
// optional Sentry initialization
if (process.env.SENTRY_DSN) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Sentry = require('@sentry/node');
    Sentry.init({ dsn: process.env.SENTRY_DSN });
    console.log('Sentry initialized');
  } catch (e) {
    console.warn('Failed to initialize Sentry', e);
  }
}

const app = createApp();

app.listen(env.APP_PORT, () => {
  console.log(`Mwiti Bakers API listening on port ${env.APP_PORT}`);
});
