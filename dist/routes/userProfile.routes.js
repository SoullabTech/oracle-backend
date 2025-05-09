// src/routes/userProfile.routes.ts
import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { updateUserProfile, } from "../services/profileService";
const router = Router();
// All routes in this file require authentication
router.use(authenticate);
/**
 * POST /update-profile
 * Body: {
 *   userId: string,
 *   fire: number (0–100),
 *   water: number (0–100),
 *   earth: number (0–100),
 *   air: number (0–100),
 *   aether: number (0–100),
 *   crystal_focus: {
 *     type?: string,
 *     challenges?: string,
 *     aspirations?: string
 *   }
 * }
 */
router.post("/update-profile", async (req, res) => {
    try {
        const { userId, fire, water, earth, air, aether, crystal_focus, } = req.body;
        // Validate input
        const values = [fire, water, earth, air, aether];
        if (typeof userId !== "string" ||
            values.some((n) => typeof n !== "number" || n < 0 || n > 100)) {
            return res.status(400).json({ message: "Profile validation failed" });
        }
        const updated = await updateUserProfile(userId, {
            fire,
            water,
            earth,
            air,
            aether,
            crystal_focus,
        });
        return res.status(200).json(updated);
    }
    catch (err) {
        console.error("❌ Error updating user profile:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});
export default router;
