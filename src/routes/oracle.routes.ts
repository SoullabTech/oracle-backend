// src/routes/oracle.routes.ts

import { Router } from 'express';
import { oracle } from '../core/agents/MainOracleAgent';
import { z } from 'zod';

const router = Router();

// 🧠 Schema for validating incoming Oracle queries
const oracleQuerySchema = z.object({
  input: z.string().min(1, 'Input is required'),
  userId: z.string(),
  context: z.record(z.any()).optional()
});

/**
 * POST /api/oracle/query
 * Handles incoming Oracle queries with optional context and userId
 */
router.post('/query', async (req, res) => {
  const parseResult = oracleQuerySchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid request',
      details: parseResult.error.flatten()
    });
  }

  const { input, userId, context } = parseResult.data;

  try {
    const response = await oracle.processQuery({ input, userId, context });
    return res.status(200).json({ success: true, data: response });
  } catch (err: any) {
    console.error('❌ Oracle query failed:', err.message || err);
    return res.status(500).json({
      success: false,
      error: 'Oracle processing error'
    });
  }
});

export default router;
