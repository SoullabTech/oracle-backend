// src/routes/ptsd.routes.ts

import { Router } from 'express';
import { PTSDAgent } from '@/agents/ptsdAgent';
import { authenticate } from '@/middleware/authenticate';

const router = Router();

/**
 * POST /api/oracle/ptsd
 * Process a trauma-sensitive oracle query.
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const input = req.body;
    const response = await PTSDAgent.process(input);
    res.json(response);
  } catch (error) {
    console.error('🛑 PTSD route error:', error);
    res.status(500).json({ error: 'PTSD Agent failed to process the request.' });
  }
});

export default router;