// src/routes/symbolicTrends.routes.ts
import { Router } from "express";
import memoryModule from "../utils/memoryModule";
const router = Router();
/**
 * GET /api/symbolic-trends
 * Optional Query Params:
 *   - symbol (string): Filter by specific symbol
 *   - agent  (string): Filter by sourceAgent
 *   - since  (ISO date string): Filter tags after a certain timestamp
 */
router.get("/", (req, res) => {
    try {
        let tags = memoryModule.getAllSymbolicTags();
        const { symbol, agent, since } = req.query;
        // Apply filters if provided
        if (symbol) {
            tags = tags.filter((t) => t.symbol === symbol);
        }
        if (agent) {
            tags = tags.filter((t) => t.sourceAgent === agent);
        }
        if (since) {
            const cutoff = new Date(since).toISOString();
            tags = tags.filter((t) => (t.timestamp ?? "") >= cutoff);
        }
        // Aggregate counts by day
        const countsByDate = {};
        for (const tag of tags) {
            const day = tag.timestamp?.slice(0, 10);
            if (day) {
                countsByDate[day] = (countsByDate[day] || 0) + 1;
            }
        }
        res.json({
            meta: {
                totalTags: tags.length,
                days: Object.keys(countsByDate).length,
            },
            countsByDate,
            tags,
        });
    }
    catch (err) {
        console.error("❌ /api/symbolic-trends error", err);
        res.status(500).json({ error: "Failed to fetch symbolic trends" });
    }
});
export default router;
