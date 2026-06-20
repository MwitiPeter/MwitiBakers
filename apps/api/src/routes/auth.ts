import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { saveUser, getUserByEmail } from '../lib/db';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body as any;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const existing = await getUserByEmail(email);
  if (existing) return res.status(409).json({ error: 'User exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: `u_${Date.now()}`, email, name: name || '', password: hashed, roles: ['customer'], createdAt: new Date().toISOString() };
  await saveUser(user);
  const token = jwt.sign({ sub: user.id, email: user.email, roles: user.roles }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body as any;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const user = await getUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: user.id, email: user.email, roles: user.roles }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

export { router as authRouter };
