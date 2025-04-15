// src/routes/metaRoutes.ts
import { Router, Request, Response } from 'express';
import { postMetaUserTrend } from '../services/trendService.js';

const router = Router();

router.post('/post-trend', async (req: Request, res: Response) => {
  const { jwt, data } = req.body; // Ensure your client provides a valid JWT and data object

  if (!jwt || !data) {
    return res.status(400).json({ error: 'Missing JWT or trend data.' });
  }

  try {
    const result = await postMetaUserTrend(jwt, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post trend data' });
  }
});

export default router;
