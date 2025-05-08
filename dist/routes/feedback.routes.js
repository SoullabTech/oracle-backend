import { Router } from "express";
import memoryModule from '../utils/memoryModule.ts';
import { storeMemoryItem } from '../services/memoryService.ts';
const router = Router();
/**
 * POST /api/feedback
 * Body: { userId: string; messageId: string; rating: number; comments?: string }
 * Records user feedback and logs it for memory and analytics.
 */
router.post("/", async (req, res) => {
    const { userId, messageId, rating, comments } = req.body;
    const feedbackItem = {
        id: `${userId}-${Date.now()}-feedback`,
        content: comments?.trim() || `Rating: ${rating}`,
        timestamp: Date.now(),
        clientId: userId,
        metadata: {
            role: "feedback",
            originalMessageId: messageId,
            rating,
            comments,
        },
    };
    memoryModule.addEntry(feedbackItem);
    try {
        await storeMemoryItem({
            content: feedbackItem.content,
            element: "feedback",
            sourceAgent: "feedback-endpoint",
            clientId: userId,
            confidence: 1,
            metadata: feedbackItem.metadata,
        });
        return res.json({ success: true });
    }
    catch (error) {
        console.error("❌ /api/feedback error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to record feedback",
        });
    }
});
export default router;
