// src/routes/storyGenerator.routes.ts

import { Router } from "express";
import { elementalOracle } from '../services/elementalOracleService.ts';
import oracleLogger from '../utils/oracleLogger.ts';
import { authenticate } from '../middleware/authenticate.ts';
import { getUserProfile } from '../services/profileService.ts';
import {
  getRelevantMemories,
  storeMemoryItem,
} from '../services/memoryService.ts';

const router = Router();

router.use(authenticate);

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      elementalTheme,
      archetype,
      focusArea = "personal growth",
      depthLevel = 3,
    } = req.body;

    if (!userId || !elementalTheme || !archetype) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const profile = await getUserProfile(userId);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found." });
    }

    const memories = await getRelevantMemories(userId, elementalTheme, 5);

    const context = {
      userId,
      elementalProfile: {
        fire: profile.fire,
        water: profile.water,
        earth: profile.earth,
        air: profile.air,
        aether: profile.aether,
      },
      crystalFocus: profile.crystal_focus ?? {},
      memories,
      phase: "story",
    };

    const story = await elementalOracle.generateStory(
      { elementalTheme, archetype, focusArea, depthLevel },
      context
    );

    const content = [
      story.narrative.trim(),
      "\nReflections:",
      ...story.reflections.map((r) => `- ${r}`),
      "\nSymbols:",
      ...story.symbols.map((s) => `- ${s}`),
    ].join("\n");

    const metadata = {
      archetype,
      focusArea,
      depthLevel,
      reflections: story.reflections,
      symbols: story.symbols,
      element: elementalTheme,
      phase: "story",
    };

    const response = {
      content,
      provider: "elemental-oracle",
      model: "gpt-4",
      confidence: 0.9,
      metadata,
    };

    await storeMemoryItem({
      content,
      element: elementalTheme,
      sourceAgent: "elemental-oracle",
      clientId: userId,
      confidence: 0.9,
      metadata,
    });

    await oracleLogger.logInsight({
      userId,
      insightType: "story_generation",
      content,
      metadata,
    });

    return res.json({ success: true, response });
  } catch (err) {
    console.error("❌ Error in story-generator:", err?.message || err);
    return res.status(500).json({ error: "Failed to generate story." });
  }
});

export default router;
