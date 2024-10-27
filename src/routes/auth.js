import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = new Hono();

router.post('/register', async (c) => {
  try {
    const { username, password } = await c.req.json();
    const user = new User({ username, password });
    await user.save();
    return c.json({ message: 'User registered successfully' }, 201);
  } catch (error) {
    return c.json({ error: 'Registration failed' }, 400);
  }
});

router.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    return c.json({ token });
  } catch (error) {
    return c.json({ error: 'Login failed' }, 400);
  }
});

export default router;
