// src/services/ingestService.ts
import fs from 'fs'
import path from 'path'
import logger from '../utils/logger.js'
import {
  fetchNotionPages,
  transformToKnowledgeEntry,
  updateNotionStatus,
} from './notionService.js'
import { storeKnowledge } from './knowledgeBaseService.js'
import { env } from '../lib/config.js'

export async function ingestNotion() {
  logger.info('⏳ Starting Notion ingestion')
  const pages = await fetchNotionPages(env.NOTION_DATABASE_ID)

  const results = await Promise.allSettled(
    pages.map(async (page) => {
      try {
        const entry = transformToKnowledgeEntry(page)
        const id = await storeKnowledge(entry)
        await updateNotionStatus(page.id, 'Imported')
        return { source: 'notion', id, notionId: page.id }
      } catch (err) {
        await updateNotionStatus(page.id, 'Import Failed')
        throw err
      }
    })
  )

  return { pages, results }
}

export async function ingestLocalJson() {
  logger.info('⏳ Starting local‑JSON ingestion')
  const kbDir = path.resolve(process.cwd(), 'spiralogic_kb')
  const files = fs.readdirSync(kbDir).filter((f) => f.endsWith('.json'))

  const results = await Promise.allSettled(
    files.map(async (fname) => {
      const fullPath = path.join(kbDir, fname)
      try {
        const raw = fs.readFileSync(fullPath, 'utf-8')
        const doc = JSON.parse(raw)
        const id = await storeKnowledge({
          id: fname.replace('.json', ''),
          title: doc.title || fname.replace('.json', ''),
          content: doc,
          category: 'local',
          source: 'local',
          metadata: { filename: fname },
        })
        return { source: 'local', file: fname, id }
      } catch (err) {
        throw { file: fname, error: err }
      }
    })
  )

  return { files, results }
}
