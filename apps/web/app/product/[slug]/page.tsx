import { getProduct } from '../../../lib/api';
import { AddToCartButton } from '../../../components/add-to-cart-button';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  return (
    <main className="page-shell">
      <section className="product-card">
        <span className="badge">{product.type}</span>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <div className="meta">
          <span>{product.currency} {product.price}</span>
          <AddToCartButton productId={product.id} />
        </div>
      </section>
    </main>
  );
}
