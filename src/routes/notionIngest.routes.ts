// src/routes/notionIngest.routes.ts
import { Router } from 'express'
import logger from '../utils/logger.js'
import { ingestNotion, ingestLocalJson } from '../services/ingestService.js'

const router = Router()

// POST /api/notion/ingest/notion
router.post('/notion', async (_req, res) => {
  try {
    const { pages, results } = await ingestNotion()
    res.json({
      importedPages: pages.length,
      successes: results.filter(r => r.status === 'fulfilled').length,
      failures: results.filter(r => r.status === 'rejected').length,
      details: results
    })
  } catch (err: any) {
    logger.error('Notion ingestion failed', err)
    res.status(500).json({ error: err.message || 'Unknown error' })
  }
})

// POST /api/notion/ingest/local
router.post('/local', async (_req, res) => {
  try {
    const { files, results } = await ingestLocalJson()
    res.json({
      loadedFiles: files.length,
      successes: results.filter(r => r.status === 'fulfilled').length,
      failures: results.filter(r => r.status === 'rejected').length,
      details: results
    })
  } catch (err: any) {
    logger.error('Local JSON ingestion failed', err)
    res.status(500).json({ error: err.message || 'Unknown error' })
  }
})

export default router
