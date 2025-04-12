import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import type { AuthenticatedRequest } from '../types';

const router = Router();

router.post('/guide', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { query } = req.body;
    const userId = req.user?.id;

    // TODO: Implement facilitator guidance logic
    const response = {
      guidance: `Facilitator response for: ${query}`,
      userId
    };

    res.json(response);
  } catch (error) {
    console.error('Facilitator processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;