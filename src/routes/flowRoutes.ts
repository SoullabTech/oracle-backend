import { Router } from 'express';
import { authenticateToken } from '../middleware';
import { LearningFlow } from '../flows/learningFlow';
import type { AuthenticatedRequest } from '../types';

const router = Router();

router.post('/learning/start', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const clientId = req.user?.id;
    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required.' });
    }

    const flow = new LearningFlow(clientId);
    const result = await flow.start();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to start learning flow' 
    });
  }
});

router.post('/learning/interact', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const clientId = req.user?.id;
    const { content, sessionId } = req.body;

    if (!clientId || !content || !sessionId) {
      return res.status(400).json({ error: 'Client ID, content, and session ID are required.' });
    }

    const flow = new LearningFlow(clientId);
    const result = await flow.processInteraction(content);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to process interaction' 
    });
  }
});

router.post('/learning/complete', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const clientId = req.user?.id;
    const { sessionId } = req.body;

    if (!clientId || !sessionId) {
      return res.status(400).json({ error: 'Client ID and session ID are required.' });
    }

    const flow = new LearningFlow(clientId);
    const result = await flow.complete();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to complete learning flow' 
    });
  }
});

export default router;