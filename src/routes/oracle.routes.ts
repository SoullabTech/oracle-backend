// src/routes/oracle.routes.ts

import { Router } from 'express';
import { oracle } from '../core/agents/mainOracleAgent.ts';
import { logInsightToNotion } from '../services/notionLogger.ts';
import { z } from 'zod';

const router = Router();

// 🧠 Validate Oracle query payload
const oracleQuerySchema = z.object({
  input: z.string().min(1, 'Input is required'),
  userId: z.string(),
  context: z.record(z.any()).optional(),
});

// POST /api/oracle/query
router.post('/query', async (req, res) => {
  const parsed = oracleQuerySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request',
      details: parsed.error.flatten(),
    });
  }

  const { input, userId, context } = parsed.data;

  try {
    const response = await oracle.processQuery({ input, userId, context });
    return res.status(200).json({ success: true, data: response });
  } catch (err) {
    console.error('❌ Oracle query failed:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'Oracle processing error',
    });
  }
});

// GET /api/oracle/test-log
router.get('/test-log', async (_req, res) => {
  try {
    const result = await logInsightToNotion({
      title: 'Test Insight',
      content: 'This is a test insight from the Oracle backend.',
    });
    return res.status(200).json({ success: true, id: result.id });
  } catch (err) {
    console.error('❌ Notion logging failed:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'Failed to log test insight to Notion',
    });
  }
});

export default router;
