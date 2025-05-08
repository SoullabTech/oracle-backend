// src/routes/notionRoutes.ts
import { Router } from "express";
import { ingestNotion, ingestLocalKb } from '../services/ingestionService.ts';
import logger from '../utils/logger.ts';
const router = Router();
// POST /api/ingest/notion
router.post("/ingest/notion", async (_req, res) => {
    try {
        const results = await ingestNotion();
        const failed = results.filter(r => r.status === "rejected");
        logger.info("✅ Notion ingest finished", {
            total: results.length,
            failed: failed.length,
        });
        res.json({
            ok: true,
            total: results.length,
            failed: failed.length,
            details: results,
        });
    }
    catch (err) {
        logger.error("❌ Error in /ingest/notion", err);
        res.status(500).json({ ok: false, error: err?.message || "Ingest failed" });
    }
});
// POST /api/ingest/local
router.post("/ingest/local", async (_req, res) => {
    try {
        const results = await ingestLocalKb();
        const failed = results.filter(r => r.status === "rejected");
        logger.info("✅ Local KB ingest finished", {
            total: results.length,
            failed: failed.length,
        });
        res.json({
            ok: true,
            total: results.length,
            failed: failed.length,
            details: results,
        });
    }
    catch (err) {
        logger.error("❌ Error in /ingest/local", err);
        res.status(500).json({ ok: false, error: err?.message || "Ingest failed" });
    }
});
export default router;
