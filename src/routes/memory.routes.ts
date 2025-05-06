// src/routes/memory.routes.ts

import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.ts';
import memoryService from '../services/memoryService.ts';

const router = Router();

// 🔒 All memory routes require authentication
router.use(authenticate);

router.post('/', async (req, res) => {
  try {
    const { content, element, sourceAgent, confidence, metadata } = req.body;
    const clientId = (req as any).user.id;

    const memory = await memoryService.storeMemory({
      clientId,
      content,
      element,
      sourceAgent,
      confidence,
      metadata,
    });

    res.json({ success: true, memory });
  } catch (err: any) {
    console.error('❌ Error storing memory:', err);
    res.status(500).json({ success: false, error: 'Failed to store memory.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const clientId = (req as any).user.id;
    const memories = await memoryService.retrieveMemories(clientId);
    res.json({ success: true, memories });
  } catch (err: any) {
    console.error('❌ Error fetching memories:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch memories.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const clientId = (req as any).user.id;
    const memory = await memoryService.updateMemory(
      req.params.id,
      req.body.content,
      clientId,
    );
    res.json({ success: true, memory });
  } catch (err: any) {
    console.error('❌ Error updating memory:', err);
    res.status(500).json({ success: false, error: 'Failed to update memory.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const clientId = (req as any).user.id;
    await memoryService.deleteMemory(req.params.id, clientId);
    res.json({ success: true });
  } catch (err: any) {
    console.error('❌ Error deleting memory:', err);
    res.status(500).json({ success: false, error: 'Failed to delete memory.' });
  }
});

router.get('/insights', async (req, res) => {
  try {
    const clientId = (req as any).user.id;
    const insights = await memoryService.getMemoryInsights(clientId);
    res.json({ success: true, insights });
  } catch (err: any) {
    console.error('❌ Error generating memory insights:', err);
    res
      .status(500)
      .json({ success: false, error: 'Failed to generate insights.' });
  }
});

export default router;
