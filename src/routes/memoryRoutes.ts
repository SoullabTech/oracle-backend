// src/routes/memory.routes.ts

import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { MemoryService } from "../services/memoryService";
import {
  createMemorySchema,
  updateMemorySchema,
  deleteMemorySchema,
} from "../schemas/memory";
import type { AuthenticatedRequest } from "../types";
import logger from "../utils/logger";

const router = Router();
const memoryService = new MemoryService();

router.post(
  "/",
  authenticateToken,
  validate(createMemorySchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { content, metadata } = req.body;
      const clientId = req.user?.id;
      if (!clientId) {
        return res.status(400).json({ error: "Client ID is required." });
      }

      const memory = await memoryService.storeMemory({
        content,
        clientId,
        metadata,
      });

      res.json(memory);
    } catch (error) {
      logger.error("Failed to store memory", { error });
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to store memory",
      });
    }
  },
);

router.get(
  "/",
  authenticateToken,
  async (req: AuthenticatedRequest, res) => {
    try {
      const clientId = req.user?.id;
      if (!clientId) {
        return res.status(400).json({ error: "Client ID is required." });
      }

      const memories = await memoryService.retrieveMemories(clientId);
      res.json(memories);
    } catch (error) {
      logger.error("Failed to retrieve memories", { error });
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve memories",
      });
    }
  },
);

router.put(
  "/:id",
  authenticateToken,
  validate(updateMemorySchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const clientId = req.user?.id;
      if (!clientId) {
        return res.status(400).json({ error: "Client ID is required." });
      }

      const success = await memoryService.updateMemory(id, content, clientId);
      if (success) {
        return res.json({ message: "Memory updated successfully" });
      }
      return res.status(404).json({ error: "Memory not found" });
    } catch (error) {
      logger.error("Failed to update memory", { error });
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update memory",
      });
    }
  },
);

router.delete(
  "/:id",
  authenticateToken,
  validate(deleteMemorySchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const clientId = req.user?.id;
      if (!clientId) {
        return res.status(400).json({ error: "Client ID is required." });
      }

      const success = await memoryService.deleteMemory(id, clientId);
      if (success) {
        return res.json({ message: "Memory deleted successfully" });
      }
      return res.status(404).json({ error: "Memory not found" });
    } catch (error) {
      logger.error("Failed to delete memory", { error });
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete memory",
      });
    }
  },
);

export default router;
