import cors from 'cors';
import express from 'express';
import { healthRouter } from './routes/health';
import { productsRouter } from './routes/products';
import { cartRouter } from './routes/cart';
import { ordersRouter } from './routes/orders';
import { downloadsRouter } from './routes/downloads';
import { authRouter } from './routes/auth';

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
  app.use('/products', productsRouter);
  app.use('/cart', cartRouter);
  app.use('/orders', ordersRouter);
  app.use('/downloads', downloadsRouter);
  // auth
  app.use('/auth', authRouter);

  return app;
}
