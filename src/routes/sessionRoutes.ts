import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { SessionService } from '../services/sessionService.js';
import { createSessionSchema, updateSessionSchema, getSessionStatsSchema } from '../schemas/session.js';
import type { AuthenticatedRequest } from '../types/index.js';
import logger from '../utils/logger.js';

const router = Router();
const sessionService = new SessionService();

router.post(
  '/start',
  authenticateToken,
  validate(createSessionSchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { metadata } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
      }

      const session = await sessionService.createSession(userId, metadata);
      res.json(session);
    } catch (error) {
      logger.error('Failed to start session', { error });
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to start session' 
      });
    }
  }
);

router.post(
  '/end/:id',
  authenticateToken,
  validate(updateSessionSchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
      }

      const success = await sessionService.endSession(id, userId);
      if (success) {
        res.json({ message: 'Session ended successfully' });
      } else {
        res.status(404).json({ error: 'Session not found' });
      }
    } catch (error) {
      logger.error('Failed to end session', { error });
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to end session' 
      });
    }
  }
);

router.get(
  '/stats',
  authenticateToken,
  validate(getSessionStatsSchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.id;
      const { startDate, endDate } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
      }

      const stats = await sessionService.getSessionStats(
        userId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      
      res.json(stats);
    } catch (error) {
      logger.error('Failed to get session stats', { error });
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to get session stats' 
      });
    }
  }
);

export default router;