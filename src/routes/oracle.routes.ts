// src/routes/oracle.routes.ts

import { Router } from 'express';
import { oracle } from '../core/agents/MainOracleAgent';
import { notionLogger } from '../services/notionLogger';
import { z } from 'zod';

const router = Router();

const oracleQuerySchema = z.object({
  input: z.string().min(1, 'Input is required'),
  userId: z.string(),
  context: z.record(z.any()).optional(),
});

router.post('/query', async (req, res) => {
  const parseResult = oracleQuerySchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid request',
      details: parseResult.error.flatten(),
    });
  }

  const { input, userId, context } = parseResult.data;

  try {
    const response = await oracle.processQuery({ input, userId, context });
    return res.status(200).json({ success: true, data: response });
  } catch (err: any) {
    notionLogger.error(`❌ Oracle query failed: ${err.message || err}`);
    return res.status(500).json({
      success: false,
      error: 'Oracle processing error',
    });
  }
});

// Optional: Feedback endpoint
router.post('/feedback', async (req, res) => {
  const { userId, messageId, rating, emotion } = req.body;

  try {
    await oracle.handleFeedback({ userId, messageId, rating, emotion });
    return res.status(200).json({ success: true });
  } catch (error: any) {
    notionLogger.error(`❌ Feedback handling failed: ${error.message}`);
    return res.status(500).json({ success: false, error: 'Feedback error' });
  }
});

router.get('/test-log', async (_req, res) => {
  try {
    notionLogger.info('Test Insight: This is a test insight from the Oracle backend.');
    return res.status(200).json({ success: true, message: 'Logged to console' });
  } catch (error: any) {
    notionLogger.error(`❌ Logging failed: ${error.message}`);
    return res.status(500).json({ success: false, error: 'Logging error' });
  }
});

export default router;
