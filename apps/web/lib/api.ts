export async function getProducts() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/products');
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProduct(slug: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/products/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function addToCart(session: string, productId: string, qty = 1) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session, productId, qty })
  });
  if (!res.ok) throw new Error('Failed to add to cart');
  return res.json();
}

export async function getCart(session: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/cart/${session}`);
  if (!res.ok) throw new Error('Failed to fetch cart');
  return res.json();
}

export async function createOrder(payload: any) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error('Order creation failed: ' + txt);
  }
  return res.json();
}
