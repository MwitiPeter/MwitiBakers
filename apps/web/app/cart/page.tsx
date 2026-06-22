'use client';

import { useEffect, useState } from 'react';
import { getCart } from '../../lib/api';

export default function CartPage() {
  const [cart, setCart] = useState<any>({ items: [] });
  const session = 'anon';

  useEffect(() => {
    getCart(session)
      .then(setCart)
      .catch((e) => console.error(e));
  }, []);

  return (
    <main className="page-shell">
      <h1>Your cart</h1>
      <section>
        {cart.items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.items.map((it: any) => (
              <li key={it.productId}>{it.productId} × {it.qty}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
