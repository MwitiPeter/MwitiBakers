'use client';
import { useState } from 'react';
import { createOrder } from '../../lib/api';

export default function CheckoutPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCheckout(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      const order = await createOrder({ items: [{ productId: 'p2', qty: 1 }], totalAmount: 1200, currency: 'KES', phone });
      if (order?.payment?.authorizationUrl) {
        window.location.href = order.payment.authorizationUrl;
        return;
      }
      alert('Order created: ' + order.id + ' status: ' + order.status);
    } catch (err: any) {
      alert('Checkout failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <h1>Checkout</h1>
      <form onSubmit={handleCheckout}>
        <label>
          Phone or email for Paystack:
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <div style={{ marginTop: 12 }}>
          <button className="primary-button" type="submit" disabled={loading}>Pay KES 1,200</button>
        </div>
      </form>
    </main>
  );
}
