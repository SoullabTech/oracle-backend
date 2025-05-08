// src/routes/insightHistory.routes.ts

import { Router } from "express";
import * as oracleLogger from '../utils/oracleLogger.ts';

import { authenticate } from '../middleware/authenticate.ts';

const router = Router();

// 🔒 All insight-history routes require authentication
router.use(authenticate);

/**
 * GET /api/oracle/insight-history
 * Optional query params: type, limit, offset
 */
router.get("/", async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { type, limit = "50", offset = "0" } = req.query;

    const insights = await oracleLogger.getInsightHistory(userId, {
      type: type as string,
      limit: Number(limit),
      offset: Number(offset),
    });

    return res
      .status(200)
      .json({ success: true, count: insights.length, insights });
  } catch (err: any) {
    console.error("❌ Error retrieving insight history:", err.message || err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to retrieve insight history" });
  }
});

/**
 * GET /api/oracle/insight-history/stats
 * Returns aggregate stats for insights
 */
router.get("/stats", async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const stats = await oracleLogger.getInsightStats(userId);
    return res.status(200).json({ success: true, stats });
  } catch (err: any) {
    console.error(
      "❌ Error retrieving insight statistics:",
      err.message || err,
    );
    return res
      .status(500)
      .json({ success: false, error: "Failed to retrieve insight statistics" });
  }
});

export default router;
