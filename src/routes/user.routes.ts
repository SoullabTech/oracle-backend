// File: /src/routes/user.routes.ts
// Layer: 🔁 API — Returns and promotes ritual tier based on engagement

import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { evaluateUserTier } from '@/utils/tierTracker';

const router = Router();
router.use(authenticate);

router.get('/tier', async (req, res) => {
  try {
    const user = await req.user;
    res.json({ tier: user.tier || 'explorer' });
  } catch (err) {
    console.error('Tier fetch error:', err);
    res.status(500).json({ error: 'Unable to get tier' });
  }
});

router.post('/promote', async (req, res) => {
  try {
    const user = await req.user;
    const newTier = await evaluateUserTier(user._id);
    res.json({ tier: newTier });
  } catch (err) {
    console.error('Promotion error:', err);
    res.status(500).json({ error: 'Failed to evaluate tier' });
  }
});

export default router;
