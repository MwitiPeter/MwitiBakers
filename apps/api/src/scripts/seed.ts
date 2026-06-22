import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is required to seed the database');
}

const client = new MongoClient(uri);

const products = [
  {
    id: 'p1',
    slug: 'rainbow-cake',
    name: 'Rainbow Cake',
    type: 'Physical',
    description: 'A vibrant celebration cake for birthdays and special moments.',
    price: 2500,
    currency: 'KES',
    status: 'in_stock',
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    slug: 'recipe-book',
    name: 'Recipe Book PDF',
    type: 'Digital',
    description: 'Premium bakery recipes with secure post-purchase access.',
    price: 1200,
    currency: 'KES',
    status: 'available',
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p3',
    slug: 'training-videos',
    name: 'Training Videos',
    type: 'Digital',
    description: 'Step-by-step baking lessons for customers and trainees.',
    price: 3500,
    currency: 'KES',
    status: 'available',
    active: true,
    createdAt: new Date().toISOString()
  }
];

async function main() {
  await client.connect();
  const db = client.db('mwitibakers');

  const productsCollection = db.collection('products');
  const ordersCollection = db.collection('orders');
  const cartsCollection = db.collection('carts');
  const usersCollection = db.collection('users');

  await productsCollection.createIndex({ slug: 1 }, { unique: true });
  await productsCollection.createIndex({ name: 'text', description: 'text' });
  await ordersCollection.createIndex({ id: 1 }, { unique: true });
  await ordersCollection.createIndex({ status: 1, createdAt: -1 });
  await cartsCollection.createIndex({ session: 1 }, { unique: true });
  await usersCollection.createIndex({ email: 1 }, { unique: true });

  for (const product of products) {
    await productsCollection.updateOne(
      { id: product.id },
      { $set: product },
      { upsert: true }
    );
  }

  console.log(`Seeded ${products.length} products into mwitibakers.products`);
}

main()
  .then(async () => {
    await client.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Seed failed:', error);
    await client.close();
    process.exit(1);
  });
