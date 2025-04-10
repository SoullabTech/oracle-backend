import express, { Request, Response } from 'express';
import multer from 'multer';
import { storeMemory, getMemoryInsights } from '../controllers/memoryController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.file) {
      const result = await storeMemory({
        id: `mem-${Date.now()}`,
        content: req.file.path,
        type: 'audio',
        timestamp: Date.now(),
        clientId: req.body.clientId || 'unknown'
      });
      res.json({ memory_id: result.id, message: 'Audio uploaded successfully' });
    } else if (req.body.content) {
      const result = await storeMemory({
        id: `mem-${Date.now()}`,
        content: req.body.content,
        type: 'text',
        timestamp: Date.now(),
        clientId: req.body.clientId || 'unknown'
      });
      res.json({ memory_id: result.id, message: 'Text uploaded successfully' });
    } else {
      res.status(400).json({ error: 'No content provided' });
    }
  } catch (error) {
    console.error("Error in /upload:", error);
    res.status(500).json({ error: 'Server error uploading memory' });
  }
});

router.get('/insights', async (_req: Request, res: Response): Promise<void> => {
  try {
    const insights = await getMemoryInsights();
    res.json({ insights });
  } catch (error) {
    console.error("Error in /insights:", error);
    res.status(500).json({ error: 'Server error retrieving insights' });
  }
});

export default router;