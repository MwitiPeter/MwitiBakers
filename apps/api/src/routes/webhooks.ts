import { Router } from 'express';
import crypto from 'crypto';
import { getOrder, saveOrder } from '../lib/db';

const router = Router();

router.post('/paystack', async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY || '';
  if (!secret) {
    console.warn('PAYSTACK_SECRET_KEY not set; skipping webhook validation');
  } else {
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);
    const hash = crypto
      .createHmac('sha512', secret)
      .update(rawBody)
      .digest('hex');
    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const { event, data } = req.body as any;
  if (event === 'charge.success') {
    const reference = data.reference as string;
    const orderId = reference.split('-')[0];

    const order = await getOrder(orderId);
    if (order) {
      order.status = 'paid';
      order.paymentData = data;
      await saveOrder(order);
      console.log(`Order ${orderId} marked as paid via Paystack webhook`);
    } else {
      console.warn(`Order ${orderId} not found for Paystack webhook`);
    }
  }

  res.json({ ok: true });
});

export { router as webhooksRouter };
