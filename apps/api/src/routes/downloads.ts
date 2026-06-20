import { Router } from 'express';

const router = Router();

// For demo: in-memory order store (importing would be better; small app)
const orders: Record<string, any> = {};

// Endpoint to register an order in-memory (used by orders route in this simple scaffold)
router.post('/_register', (req, res) => {
  const { order } = req.body as any;
  if (!order || !order.id) return res.status(400).json({ error: 'order required' });
  orders[order.id] = order;
  res.json({ ok: true });
});

// Secure download endpoint (dev): checks order and returns a dummy link
router.get('/file/:orderId/:productId', (req, res) => {
  const { orderId, productId } = req.params;
  const order = orders[orderId];
  if (!order) return res.status(404).json({ error: 'Order not found' });

  // simple entitlement check: order contains productId
  const has = order.items && order.items.find((i: any) => i.productId === productId);
  if (!has) return res.status(403).json({ error: 'Not entitled' });

  // Normally we'd generate a signed URL to S3; for dev return a small text payload
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${productId}.txt"`);
  res.send(`This is a protected demo file for order ${orderId} product ${productId}`);
});

export { router as downloadsRouter };
