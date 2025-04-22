// src/routes/oracle.routes.ts

import { Router } from "express";
import { oracle } from "../core/agents/MainOracleAgent";
import { logInsightToNotion } from "@/services/notionLogger";
import { z } from "zod";

const router = Router();

// 🧠 Schema for validating incoming Oracle queries
const oracleQuerySchema = z.object({
  input: z.string().min(1, "Input is required"),
  userId: z.string(),
  context: z.record(z.any()).optional(),
});

/**
 * POST /query
 * Handles incoming Oracle queries with optional context and userId
 */
router.post("/query", async (req, res) => {
  const parseResult = oracleQuerySchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid request",
      details: parseResult.error.flatten(),
    });
  }

  const { input, userId, context } = parseResult.data;

  try {
    const response = await oracle.processQuery({ input, userId, context });
    return res.status(200).json({ success: true, data: response });
  } catch (err: any) {
    console.error("❌ Oracle query failed:", err.message || err);
    return res.status(500).json({
      success: false,
      error: "Oracle processing error",
    });
  }
});

/**
 * GET /test-log
 * Simple route to test Notion integration
 */
router.get("/test-log", async (_req, res) => {
  try {
    const result = await logInsightToNotion({
      title: "Test Insight",
      content: "This is a test insight from the Oracle backend.",
    });
    return res.status(200).json({ success: true, id: result.id });
  } catch (error: any) {
    console.error("❌ Notion logging failed:", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to log test insight to Notion",
    });
  }
});

export default router;
