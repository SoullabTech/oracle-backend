// src/routes/memory.routes.ts

import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import memoryService from "../services/memoryService";

const router = Router();

// 🔒 All memory routes require authentication
router.use(authenticate);

/**
 * POST /api/oracle/memory
 * Body: { content, element, sourceAgent, confidence, metadata }
 */
router.post("/", async (req, res) => {
  try {
    const memory = await memoryService.storeMemory({
      clientId: req.user.id,
      content: req.body.content,
      element: req.body.element,
      sourceAgent: req.body.sourceAgent,
      confidence: req.body.confidence,
      metadata: req.body.metadata,
    });
    res.json({ success: true, memory });
  } catch (err: any) {
    console.error("❌ Error storing memory:", err);
    res.status(500).json({ success: false, error: "Failed to store memory." });
  }
});

/**
 * GET /api/oracle/memory
 * Returns all memories for the current user
 */
router.get("/", async (req, res) => {
  try {
    const memories = await memoryService.retrieveMemories(req.user.id);
    res.json({ success: true, memories });
  } catch (err: any) {
    console.error("❌ Error fetching memories:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch memories." });
  }
});

/**
 * PUT /api/oracle/memory/:id
 * Body: { content }
 */
router.put("/:id", async (req, res) => {
  try {
    const updated = await memoryService.updateMemory(
      req.params.id,
      req.body.content,
      req.user.id,
    );
    res.json({ success: true, memory: updated });
  } catch (err: any) {
    console.error("❌ Error updating memory:", err);
    res.status(500).json({ success: false, error: "Failed to update memory." });
  }
});

/**
 * DELETE /api/oracle/memory/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    await memoryService.deleteMemory(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (err: any) {
    console.error("❌ Error deleting memory:", err);
    res.status(500).json({ success: false, error: "Failed to delete memory." });
  }
});

/**
 * GET /api/oracle/memory/insights
 * Returns simple generated insights
 */
router.get("/insights", async (req, res) => {
  try {
    const insights = await memoryService.getMemoryInsights(req.user.id);
    res.json({ success: true, insights });
  } catch (err: any) {
    console.error("❌ Error generating memory insights:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to generate insights." });
  }
});

export default router;
