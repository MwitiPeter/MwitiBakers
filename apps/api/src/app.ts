import cors from 'cors';
import express from 'express';
import { healthRouter } from './routes/health';

export function createApp() {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json());
  app.get('/', (_request, response) => {
    response.json({
      name: 'Mwiti Bakers API',
      status: 'ok'
    });
  });
  app.use('/health', healthRouter);

  return app;
}
