import { Router } from 'express';
import { ordersStore } from '../lib/store';
import crypto from 'crypto';

const router = Router();

// Paystack webhook for payment confirmation
router.post('/paystack', (req, res) => {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET || '';
  if (!secret) {
    console.warn('PAYSTACK_WEBHOOK_SECRET not set; skipping webhook validation');
  } else {
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const { event, data } = req.body as any;
  if (event === 'charge.success') {
    // Extract order ID from reference (format: orderId-timestamp)
    const reference = data.reference as string;
    const orderId = reference.split('-')[0];

    // Find and update order status
    const order = ordersStore[orderId];
    if (order) {
      order.status = 'paid';
      order.paymentData = data;
      console.log(`Order ${orderId} marked as paid via Paystack webhook`);
    }
  }

  res.json({ ok: true });
});

export { router as webhooksRouter };
