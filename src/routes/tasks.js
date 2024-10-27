import { Hono } from 'hono';
import { auth } from '../middleware/auth.js';
import Task from '../models/Task.js';

const router = new Hono();

router.use('*', auth);

router.post('/', async (c) => {
  try {
    const { title, description, story } = await c.req.json();
    const task = new Task({
      title,
      description,
      story,
      user: c.get('userId'),
    });
    await task.save();
    return c.json(task, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create task' }, 400);
  }
});

router.get('/', async (c) => {
  try {
    const tasks = await Task.find({ user: c.get('userId') });
    return c.json(tasks);
  } catch (error) {
    return c.json({ error: 'Failed to fetch tasks' }, 400);
  }
});

router.get('/:id', async (c) => {
  try {
    const task = await Task.findOne({ _id: c.req.param('id'), user: c.get('userId') });
    if (!task) {
      return c.json({ error: 'Task not found' }, 404);
    }
    return c.json(task);
  } catch (error) {
    return c.json({ error: 'Failed to fetch task' }, 400);
  }
});

router.put('/:id', async (c) => {
  try {
    const updates = await c.req.json();
    const task = await Task.findOneAndUpdate(
      { _id: c.req.param('id'), user: c.get('userId') },
      updates,
      { new: true }
    );
    if (!task) {
      return c.json({ error: 'Task not found' }, 404);
    }
    return c.json(task);
  } catch (error) {
    return c.json({ error: 'Failed to update task' }, 400);
  }
});

router.delete('/:id', async (c) => {
  try {
    const task = await Task.findOneAndDelete({ _id: c.req.param('id'), user: c.get('userId') });
    if (!task) {
      return c.json({ error: 'Task not found' }, 404);
    }
    return c.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete task' }, 400);
  }
});

export default router;
