'use client';

import { addToCart } from '../lib/api';

export function AddToCartButton({ productId }: { productId: string }) {
  async function handleAdd() {
    try {
      await addToCart('anon', productId, 1);
      alert('Added to cart');
    } catch {
      alert('Failed to add to cart');
    }
  }

  return (
    <button className="primary-button" type="button" onClick={handleAdd}>
      Add to cart
    </button>
  );
}
