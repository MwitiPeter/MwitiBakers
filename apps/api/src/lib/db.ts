import { MongoClient } from 'mongodb';
import { ordersStore, cartsStore } from './store';

const uri = process.env.MONGODB_URI || '';
let client: MongoClient | null = null;

async function getClient() {
  if (!uri) return null;
  if (client) return client;
  client = new MongoClient(uri);
  await client.connect();
  return client;
}

export async function saveOrder(order: any) {
  const c = await getClient();
  if (!c) {
    ordersStore[order.id] = order;
    return order;
  }
  const db = c.db('mwitibakers');
  const col = db.collection('orders');
  await col.updateOne({ id: order.id }, { $set: order }, { upsert: true });
  return order;
}

export async function getOrder(id: string) {
  const c = await getClient();
  if (!c) return ordersStore[id];
  const db = c.db('mwitibakers');
  const col = db.collection('orders');
  return col.findOne({ id });
}

export async function saveCart(session: string, cart: any) {
  const c = await getClient();
  if (!c) {
    cartsStore[session] = cart;
    return cart;
  }
  const db = c.db('mwitibakers');
  const col = db.collection('carts');
  await col.updateOne({ session }, { $set: { session, cart } }, { upsert: true });
  return cart;
}

export async function getCart(session: string) {
  const c = await getClient();
  if (!c) return cartsStore[session] || { items: [] };
  const db = c.db('mwitibakers');
  const col = db.collection('carts');
  const doc = await col.findOne({ session });
  return doc ? doc.cart : { items: [] };
}
