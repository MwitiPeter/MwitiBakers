import type { CatalogItem } from '../lib/catalog';

export function ProductCard({ product }: { product: CatalogItem }) {
  return (
    <article className="product-card">
      <span className="badge">{product.type}</span>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="meta">
        <span>{product.price}</span>
        <span>{product.status}</span>
      </div>
    </article>
  );
}
