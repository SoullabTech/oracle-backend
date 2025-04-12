import { Router } from 'express';
import { authenticateToken } from '../middleware';
import { MemoryService } from '../services/memoryService';
import type { AuthenticatedRequest } from '../types';

const router = Router();
const memoryService = new MemoryService();

router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { content } = req.body;
    const clientId = req.user?.id;

    if (!content || !clientId) {
      return res.status(400).json({ error: 'Content and client ID are required.' });
    }

    const memory = await memoryService.storeMemory({
      id: Math.random().toString(36).substring(7),
      content,
      clientId
    });

    res.json(memory);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to store memory' 
    });
  }
});

router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const clientId = req.user?.id;
    const memories = await memoryService.retrieveMemories(clientId);
    res.json(memories);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to retrieve memories' 
    });
  }
});

router.get('/insights', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const clientId = req.user?.id;
    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required.' });
    }

    const insights = await memoryService.getMemoryInsights(clientId);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to get memory insights' 
    });
  }
});

export default router;