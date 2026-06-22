import { Router } from 'express';
import { MongoClient } from 'mongodb';

const router = Router();

const sampleProducts = [
  {
    id: 'p1',
    slug: 'rainbow-cake',
    name: 'Rainbow Cake',
    type: 'Physical',
    description: 'A vibrant celebration cake for birthdays and special moments.',
    price: 2500,
    currency: 'KES',
    status: 'in_stock'
  },
  {
    id: 'p2',
    slug: 'recipe-book',
    name: 'Recipe Book PDF',
    type: 'Digital',
    description: 'Premium bakery recipes with secure post-purchase access.',
    price: 1200,
    currency: 'KES',
    status: 'available'
  }
];

async function getMongoProducts() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return sampleProducts;

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('mwitibakers');
    const docs = await db.collection('products').find({ active: true }).toArray();
    return docs.length > 0 ? docs : sampleProducts;
  } catch {
    return sampleProducts;
  } finally {
    await client.close().catch(() => undefined);
  }
}

router.get('/', async (_req, res) => {
  res.json(await getMongoProducts());
});

router.get('/:slug', async (req, res) => {
  const products = await getMongoProducts();
  const p = products.find((x) => x.slug === req.params.slug);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

export { router as productsRouter };
