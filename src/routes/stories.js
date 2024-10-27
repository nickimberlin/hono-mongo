import { Hono } from 'hono';
import { auth } from '../middleware/auth.js';
import Story from '../models/Story.js';

const router = new Hono();

router.use('*', auth);

router.post('/', async (c) => {
  try {
    const { title, description } = await c.req.json();
    const story = new Story({
      title,
      description,
      user: c.get('userId'),
    });
    await story.save();
    return c.json(story, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create story' }, 400);
  }
});

router.get('/', async (c) => {
  try {
    const stories = await Story.find({ user: c.get('userId') });
    return c.json(stories);
  } catch (error) {
    return c.json({ error: 'Failed to fetch stories' }, 400);
  }
});

router.get('/:id', async (c) => {
  try {
    const story = await Story.findOne({ _id: c.req.param('id'), user: c.get('userId') });
    if (!story) {
      return c.json({ error: 'Story not found' }, 404);
    }
    return c.json(story);
  } catch (error) {
    return c.json({ error: 'Failed to fetch story' }, 400);
  }
});

router.put('/:id', async (c) => {
  try {
    const updates = await c.req.json();
    const story = await Story.findOneAndUpdate(
      { _id: c.req.param('id'), user: c.get('userId') },
      updates,
      { new: true }
    );
    if (!story) {
      return c.json({ error: 'Story not found' }, 404);
    }
    return c.json(story);
  } catch (error) {
    return c.json({ error: 'Failed to update story' }, 400);
  }
});

router.delete('/:id', async (c) => {
  try {
    const story = await Story.findOneAndDelete({ _id: c.req.param('id'), user: c.get('userId') });
    if (!story) {
      return c.json({ error: 'Story not found' }, 404);
    }
    return c.json({ message: 'Story deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete story' }, 400);
  }
});

export default router;
