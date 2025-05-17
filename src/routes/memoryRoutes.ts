// src/routes/memoryRoutes.ts

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { memoryService } from '../services/memoryService';
import type { AuthenticatedRequest } from '../types';
import logger from '../utils/logger';

const router = Router();

// POST /api/oracle/memory
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { content, metadata } = req.body;
    const clientId = req.user?.id;

    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required.' });
    }

    const memory = memoryService.store(clientId, content);
    res.json(memory);
  } catch (error) {
    logger.error('Failed to store memory', { error });
    res.status(500).json({ error: 'Failed to store memory' });
  }
});

// GET /api/oracle/memory
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const clientId = req.user?.id;

    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required.' });
    }

    const memories = memoryService.recall(clientId);
    res.json(memories);
  } catch (error) {
    logger.error('Failed to retrieve memories', { error });
    res.status(500).json({ error: 'Failed to retrieve memories' });
  }
});

// GET /api/oracle/memory/by-symbol?symbol=fire&userId=abc123
router.get('/by-symbol', async (req, res) => {
  const symbol = req.query.symbol as string;
  const userId = req.query.userId as string;

  if (!symbol || !userId) {
    return res.status(400).json({ error: 'Missing symbol or userId in query.' });
  }

  try {
    // Stubbed logic for filtering by symbol
    const results = memoryService
      .recall(userId)
      .filter(m => m.content.includes(symbol));
    res.status(200).json({ memories: results });
  } catch (error) {
    logger.error('Failed to fetch memories by symbol', { error });
    res.status(500).json({ error: 'Server error retrieving symbolic memories.' });
  }
});

export default router;
