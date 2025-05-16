// src/routes/storyGenerator.routes.ts

import { Router } from 'express';
import { elementalOracle } from '../services/elementalOracleService.js';
import { logOracleInsight } from '../utils/oracleLogger.js';

import { authenticate } from '../middleware/authenticate.js';
import { getUserProfile } from '../services/profileService.js';
import { getRelevantMemories, storeMemoryItem } from '../services/memoryService.js';

const router = Router();

// 🔒 All story-generation routes require authentication
router.use(authenticate);

/**
 * POST /api/oracle/story-generator
 * Generates a symbolic story based on user profile, memories, and request
 */
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      elementalTheme,
      archetype,
      focusArea = 'personal growth',
      depthLevel = 3,
    } = req.body;

    // 1) Validate & fetch profile
    if (!userId || !elementalTheme || !archetype) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const profile = await getUserProfile(userId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    // 2) Gather memories
    const memories = await getRelevantMemories(userId, elementalTheme, 5);

    // 3) Build context
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
      phase: 'story',
    };

    // 4) Generate story
    const story = await elementalOracle.generateStory(
      { elementalTheme, archetype, focusArea, depthLevel },
      context
    );

    // 5) Format output
    const content = [
      story.narrative.trim(),
      '\nReflections:',
      ...story.reflections.map(r => `- ${r}`),
      '\nSymbols:',
      ...story.symbols.map(s => `- ${s}`)
    ].join('\n');

    const response = {
      content,
      provider: 'elemental-oracle',
      model: 'gpt-4',
      confidence: 0.9,
      metadata: {
        archetype,
        focusArea,
        depthLevel,
        reflections: story.reflections,
        symbols: story.symbols,
        element: elementalTheme,
        phase: 'story',
      },
    };

    // 6) Persist memory
    await storeMemoryItem({
      content,
      element: elementalTheme,
      sourceAgent: 'elemental-oracle',
      clientId: userId,
      confidence: 0.9,
      metadata: response.metadata,
    });

    // 7) Log insight
    await oracleLogger.logInsight({
      userId,
      insightType: 'story_generation',
      content,
      metadata: response.metadata,
    });

    // ✅ Return response
    return res.json({ success: true, response });
  } catch (err: any) {
    console.error('❌ Error in story-generator:', err.message || err);
    return res.status(500).json({ error: 'Failed to generate story.' });
  }
});

export default router;
