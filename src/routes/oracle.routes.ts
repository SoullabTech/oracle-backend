// ✅ File: oracle-backend/src/routes/oracle.routes.ts
import { Router } from 'express';
import { oracleOrchestrator } from '../core/oracleOrchestrator';
import { saveToCrystalMemory } from '../services/crystalMemoryService';

const router = Router();

router.post('/oracle', async (req, res) => {
  try {
    const {
      input,
      element = 'Fire',
      phase = 1,
      emotion = 'neutral',
      persona = 'mystic',
      source = 'oracle',
      storeToMemory = true,
    } = req.body;

    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Input text is required' });
    }

    const response = await oracleOrchestrator({
      input,
      element,
      phase,
      emotion,
      persona,
      symbol: null,
      source,
    });

    if (storeToMemory) {
      const memoryItem = {
        ...response,
        timestamp: new Date().toISOString(),
        source,
        type: 'oracle',
      };
      await saveToCrystalMemory(memoryItem);
    }

    res.status(200).json(response);
  } catch (err) {
    console.error('❌ Unhandled OracleRouter Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
