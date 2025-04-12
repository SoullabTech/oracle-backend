import { Router } from 'express';
import { authenticateToken } from '../middleware';
import { SessionService } from '../services/sessionService';
import type { AuthenticatedRequest } from '../types';

const router = Router();
const sessionService = new SessionService();

router.post('/start', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const clientId = req.user?.id;
    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required.' });
    }

    const session = await sessionService.createSession(clientId);
    res.json(session);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to start session' 
    });
  }
});

router.post('/end/:sessionId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { sessionId } = req.params;
    const success = await sessionService.endSession(sessionId);

    if (!success) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    res.json({ message: 'Session ended successfully' });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to end session' 
    });
  }
});

router.get('/stats', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const clientId = req.user?.id;
    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required.' });
    }

    const stats = await sessionService.getSessionStats(clientId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to get session stats' 
    });
  }
});

export default router;