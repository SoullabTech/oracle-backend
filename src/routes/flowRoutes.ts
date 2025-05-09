// src/routes/flowRoutes.ts

import { Router } from "express";
import { authenticateToken } from '../middleware/authenticate.ts';
import { LearningFlow } from '../flows/learningFlow.ts';
import type { AuthenticatedRequest } from '../types/index.ts';

const router = Router();
const flow = new LearningFlow();

/**
 * POST /api/flow/start
 * Body: { userId: string; params?: Record<string, any> }
 * Starts a new learning flow session for the authenticated user.
 */
router.post(
  "/start",
  authenticateToken,
  async (req: AuthenticatedRequest, res) => {
    const { userId } = req;
    const params = req.body.params ?? {};
    try {
      const session = await flow.startSession(userId, params);
      return res.status(200).json({ success: true, session });
    } catch (err: any) {
      console.error("❌ /api/flow/start", err);
      return res
        .status(500)
        .json({ success: false, error: "Failed to start learning flow" });
    }
  }
);

/**
 * POST /api/flow/respond
 * Body: { userId: string; sessionId: string; answer: any }
 * Sends the user's answer into the ongoing flow and returns the next prompt.
 */
router.post(
  "/respond",
  authenticateToken,
  async (req: AuthenticatedRequest, res) => {
    const { userId } = req;
    const { sessionId, answer } = req.body as {
      sessionId: string;
      answer: unknown;
    };
    try {
      const nextStep = await flow.handleResponse(userId, sessionId, answer);
      return res.status(200).json({ success: true, nextStep });
    } catch (err: any) {
      console.error("❌ /api/flow/respond", err);
      return res
        .status(500)
        .json({ success: false, error: "Failed to process learning flow response" });
    }
  }
);

export default router;
