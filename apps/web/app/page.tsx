import { BrandHeader } from '../components/brand-header';
import { ProductCard } from '../components/product-card';
import { catalog } from '../lib/catalog';

export default function HomePage() {
  return (
    <main className="page-shell">
      <BrandHeader />

      <section className="hero-card">
        <div>
          <p className="eyebrow">Home of Sweetness</p>
          <h1>Premium bakery shopping, built for Kenya.</h1>
          <p className="hero-copy">
            Browse cakes, pastries, and premium digital products from one secure platform.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#catalog">Shop now</a>
            <a className="secondary-button" href="#about">Learn more</a>
          </div>
        </div>
        <div className="hero-panel">
          <p className="panel-label">Brand promise</p>
          <strong>Fresh products, secure payments, protected downloads.</strong>
          <ul>
            <li>M-Pesa checkout ready</li>
            <li>Digital product access controls</li>
            <li>Admin-friendly operations</li>
          </ul>
        </div>
      </section>

      <section id="catalog" className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Featured catalog</p>
          <h2>Start with the products customers already love.</h2>
        </div>
        <div className="grid">
          {catalog.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>

      <section id="about" className="section-block info-strip">
        <div>
          <p className="eyebrow">Phase 5 setup</p>
          <h2>Workspace scaffolded for storefront, API, and shared types.</h2>
        </div>
        <p>
          This starter keeps the brand visible while giving the team a clean place to build checkout,
          payments, inventory, and digital delivery.
        </p>
      </section>
    </main>
  );
}
