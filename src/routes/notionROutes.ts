// src/routes/notionRoutes.ts
import { Router } from 'express'
import { ingestNotion, ingestLocalKb } from '../services/ingestionService'
import logger from '../utils/logger'

const router = Router()

// Trigger a Notion‑only ingest
router.post('/ingest/notion', async (req, res) => {
  try {
    const results = await ingestNotion()
    const failed = results.filter(r => r.status === 'rejected')
    logger.info('Notion ingest finished', { total: results.length, failed: failed.length })
    res.json({ ok: true, total: results.length, failed: failed.length, details: results })
  } catch (err: any) {
    logger.error('Error in /ingest/notion', err)
    res.status(500).json({ ok: false, error: err.message })
  }
})

// Trigger a local‑KB ingest
router.post('/ingest/local', async (req, res) => {
  try {
    const results = await ingestLocalKb()
    const failed = results.filter(r => r.status === 'rejected')
    logger.info('Local KB ingest finished', { total: results.length, failed: failed.length })
    res.json({ ok: true, total: results.length, failed: failed.length, details: results })
  } catch (err: any) {
    logger.error('Error in /ingest/local', err)
    res.status(500).json({ ok: false, error: err.message })
  }
})

export default router
