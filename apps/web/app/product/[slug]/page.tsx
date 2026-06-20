import { getProduct, addToCart } from '../../../lib/api';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  async function handleAdd() {
    try {
      // Call API to add to cart (session 'anon')
      await addToCart('anon', product.id, 1);
      alert('Added to cart');
    } catch (err) {
      alert('Failed to add to cart');
    }
  }

  return (
    <main className="page-shell">
      <section className="product-card">
        <span className="badge">{product.type}</span>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <div className="meta">
          <span>{product.currency} {product.price}</span>
          <button className="primary-button" onClick={handleAdd}>Add to cart</button>
        </div>
      </section>
    </main>
  );
}
