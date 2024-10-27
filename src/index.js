import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import storyRoutes from './routes/stories.js';
import taskRoutes from './routes/tasks.js';

dotenv.config();

const app = new Hono();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

app.route('/auth', authRoutes);
app.route('/stories', storyRoutes);
app.route('/tasks', taskRoutes);

const port = process.env.PORT || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
