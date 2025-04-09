// src/routes/memoryRoutes.ts
import express from 'express';
import multer from 'multer';
import { storeMemory, getMemoryInsights } from '../controllers/memoryController';
const router = express.Router();
// Set up multer for file uploads (for audio)
const upload = multer({ dest: 'uploads/' });
// POST /api/memory/upload: handle both text and audio uploads
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (req.file) {
            // Handle audio file upload
            const result = await storeMemory({
                id: `mem-${Date.now()}`,
                content: req.file.path, // In production, you might process the file or store a URL
                type: 'audio',
                timestamp: Date.now(),
                clientId: req.body.clientId || 'unknown'
            });
            res.json({ memory_id: result.id, message: 'Audio uploaded successfully' });
        }
        else if (req.body.content) {
            // Handle text upload
            const result = await storeMemory({
                id: `mem-${Date.now()}`,
                content: req.body.content,
                type: 'text',
                timestamp: Date.now(),
                clientId: req.body.clientId || 'unknown'
            });
            res.json({ memory_id: result.id, message: 'Text uploaded successfully' });
        }
        else {
            res.status(400).json({ error: 'No content provided' });
        }
    }
    catch (error) {
        console.error("Error in /upload:", error);
        res.status(500).json({ error: 'Server error uploading memory' });
    }
});
// GET /api/memory/insights: return memory insights
router.get('/insights', async (req, res) => {
    try {
        const insights = await getMemoryInsights();
        res.json({ insights });
    }
    catch (error) {
        console.error("Error in /insights:", error);
        res.status(500).json({ error: 'Server error retrieving insights' });
    }
});
export default router;
