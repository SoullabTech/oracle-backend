// src/routes/symbolicTrends.routes.ts

import { Router } from "express";
import memoryModule from "../utils/memoryModule";

const router = Router();

/**
 * GET /api/symbolic-trends
 * Query Params:
 *   - symbol? (string): filter tags by specific symbol
 *   - agent?  (string): filter tags by specific agent
 *   - since?  (ISO date string): only return tags after this timestamp
 */
router.get("/", (req, res) => {
  try {
    let tags = memoryModule.getAllSymbolicTags();
    const { symbol, agent, since } = req.query as Record<string, string>;

    if (symbol) {
      tags = memoryModule.getEntriesBySymbol(symbol);
    }
    if (agent) {
      tags = memoryModule.getEntriesByAgent(agent);
    }
    if (since) {
      const cutoff = new Date(since).toISOString();
      tags = tags.filter((t) => (t.timestamp ?? "") >= cutoff);
    }

    // Aggregate counts by day
    const countsByDate: Record<string, number> = {};
    tags.forEach((tag) => {
      const day = tag.timestamp!.slice(0, 10); // YYYY-MM-DD
      countsByDate[day] = (countsByDate[day] || 0) + 1;
    });

    res.json({
      meta: { totalTags: tags.length, days: Object.keys(countsByDate).length },
      countsByDate,
      tags,
    });
  } catch (err) {
    console.error("❌ /api/symbolic-trends error", err);
    res.status(500).json({ error: "Failed to fetch symbolic trends" });
  }
});

export default router;
