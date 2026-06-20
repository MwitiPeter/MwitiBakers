import { createApp } from './app';
import { env } from './lib/env';
// register payment providers/adapters
import './services/daraja';

const app = createApp();

app.listen(env.APP_PORT, () => {
  console.log(`Mwiti Bakers API listening on port ${env.APP_PORT}`);
});
