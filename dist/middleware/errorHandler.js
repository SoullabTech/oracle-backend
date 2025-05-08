import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { MemoryService } from "../services/memoryService";
import { createMemorySchema, updateMemorySchema, deleteMemorySchema, } from "../schemas/memory";
import logger from "../utils/logger";
const router = Router();
const memoryService = new MemoryService();
router.post("/", authenticateToken, validate(createMemorySchema), async (req, res) => {
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
    }
    catch (error) {
        logger.error("Failed to store memory", { error });
        res.status(500).json({
            error: error instanceof Error ? error.message : "Failed to store memory",
        });
    }
});
router.get("/", authenticateToken, async (req, res) => {
    try {
        const clientId = req.user?.id;
        if (!clientId) {
            return res.status(400).json({ error: "Client ID is required." });
        }
        const memories = await memoryService.retrieveMemories(clientId);
        res.json(memories);
    }
    catch (error) {
        logger.error("Failed to retrieve memories", { error });
        res.status(500).json({
            error: error instanceof Error ? error.message : "Failed to retrieve memories",
        });
    }
});
router.put("/:id", authenticateToken, validate(updateMemorySchema), async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const clientId = req.user?.id;
        if (!clientId) {
            return res.status(400).json({ error: "Client ID is required." });
        }
        const success = await memoryService.updateMemory(id, content, clientId);
        if (success) {
            res.json({ message: "Memory updated successfully" });
        }
        else {
            res.status(404).json({ error: "Memory not found" });
        }
    }
    catch (error) {
        logger.error("Failed to update memory", { error });
        res.status(500).json({
            error: error instanceof Error ? error.message : "Failed to update memory",
        });
    }
});
router.delete("/:id", authenticateToken, validate(deleteMemorySchema), async (req, res) => {
    try {
        const { id } = req.params;
        const clientId = req.user?.id;
        if (!clientId) {
            return res.status(400).json({ error: "Client ID is required." });
        }
        const success = await memoryService.deleteMemory(id, clientId);
        if (success) {
            res.json({ message: "Memory deleted successfully" });
        }
        else {
            res.status(404).json({ error: "Memory not found" });
        }
    }
    catch (error) {
        logger.error("Failed to delete memory", { error });
        res.status(500).json({
            error: error instanceof Error ? error.message : "Failed to delete memory",
        });
    }
});
// GET /api/memory/by-symbol?symbol=fire&userId=abc123
import { getMemoriesBySymbol } from "@/services/memoryService";
router.get("/by-symbol", async (req, res) => {
    const symbol = req.query.symbol;
    const userId = req.query.userId;
    if (!symbol) {
        return res.status(400).json({ error: "Missing symbol in query." });
    }
    try {
        const results = await getMemoriesBySymbol(symbol, userId);
        return res.status(200).json({ memories: results });
    }
    catch (error) {
        console.error("❌ Failed to fetch memories by symbol:", error);
        return res
            .status(500)
            .json({ error: "Server error retrieving symbolic memories." });
    }
});
export default router;
