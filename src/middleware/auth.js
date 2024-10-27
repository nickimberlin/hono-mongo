import jwt from 'jsonwebtoken';
import { Context } from 'hono';

export const auth = async (c, next) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    c.set('userId', decoded.userId);
    await next();
  } catch (error) {
    return c.json({ error: 'Authentication failed' }, 401);
  }
};
