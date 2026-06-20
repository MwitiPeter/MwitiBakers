import { Router } from 'express';
import { initiatePayment } from '../services/payments';

const router = Router();

import { ordersStore } from '../lib/store';

router.post('/', async (req, res) => {
  const { items, totalAmount, currency = 'KES', phone } = req.body as any;
  if (!items || !Array.isArray(items)) return res.status(400).json({ error: 'items required' });

  const orderId = `ord_${Date.now()}`;
  const order = {
    id: orderId,
    items,
    totalAmount,
    currency,
    status: 'created',
    createdAt: new Date().toISOString()
  };
  ordersStore[orderId] = order;

  // initiate payment via mock provider for now
  try {
    const payment = await initiatePayment('mock', { amount: totalAmount, currency, reference: orderId, phone });
    order.payment = payment;
    order.status = payment.status === 'paid' ? 'paid' : 'payment_pending';
  } catch (err: any) {
    order.status = 'payment_failed';
    order.error = String(err);
  }

  res.status(201).json(order);
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const order = orders[id];
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
});

export { router as ordersRouter };
