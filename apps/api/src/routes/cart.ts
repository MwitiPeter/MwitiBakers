import { Router } from 'express';

const router = Router();

// Simple in-memory carts keyed by session (dev only)
const carts = new Map<string, { items: Array<{ productId: string; qty: number }> }>();
import { saveCart, getCart as dbGetCart } from '../lib/db';

router.post('/add', (req, res) => {
  const { session = 'anon', productId, qty = 1 } = req.body as any;
  if (!productId) return res.status(400).json({ error: 'productId required' });
  const cart = carts.get(session) || { items: [] };
  const existing = cart.items.find((i) => i.productId === productId);
  if (existing) existing.qty += qty;
  else cart.items.push({ productId, qty });
  // persist cart if DB available
  await saveCart(session, cart);
  res.json(cart);
});

router.get('/:session', (req, res) => {
  const session = req.params.session;
  // return DB cart if present
  dbGetCart(session)
    .then((c) => res.json(c || { items: [] }))
    .catch(() => res.json(carts.get(session) || { items: [] }));
});

export { router as cartRouter };
