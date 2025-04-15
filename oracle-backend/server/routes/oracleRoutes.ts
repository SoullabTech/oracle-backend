import { Router } from 'express';
import { getOracleResponse } from '../../src/services/oracleService.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { query, userId } = req.body;

    if (!query || !userId) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    const response = await getOracleResponse(query, userId);
    res.json(response);
  } catch (error) {
    console.error('Error processing oracle query:', error);
    res.status(500).json({
      error: 'Failed to process query',
    });
  }
});

export default router;