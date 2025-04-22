// src/services/ingestionService.ts
import fs from "fs";
import path from "path";
import logger from "../utils/logger";
import {
  fetchNotionPages,
  transformToKnowledgeEntry,
  updateNotionStatus,
} from "../services/notionService";
import { storeKnowledge } from "../services/knowledgeBaseService";
import { env } from "../lib/config";

interface Result<T> {
  source: string;
  id?: string;
  notionId?: string;
  file?: string;
  status: "fulfilled" | "rejected";
  reason?: any;
}

export async function ingestFromNotion(): Promise<{
  processed: number;
  results: Result<any>[];
}> {
  logger.info("⏳ Starting Notion ingestion");
  const pages = await fetchNotionPages(env.NOTION_DATABASE_ID);

  const settled = await Promise.allSettled(
    pages.map(async (page) => {
      const entry = transformToKnowledgeEntry(page);
      const id = await storeKnowledge(entry);
      await updateNotionStatus(page.id, "Imported");
      return { source: "notion", id, notionId: page.id };
    }),
  );

  const results: Result<any>[] = settled.map((r) => ({
    source: "notion",
    ...(r.status === "fulfilled" ? { ...r.value } : { reason: r.reason }),
    status: r.status,
  }));

  return { processed: pages.length, results };
}

export async function ingestFromLocal(): Promise<{
  processed: number;
  results: Result<any>[];
}> {
  logger.info("⏳ Starting local‑JSON ingestion");
  const kbDir = path.resolve(__dirname, "../spiralogic_kb");
  const files = fs.readdirSync(kbDir).filter((f) => f.endsWith(".json"));

  const settled = await Promise.allSettled(
    files.map(async (fname) => {
      const raw = fs.readFileSync(path.join(kbDir, fname), "utf-8");
      const doc = JSON.parse(raw);
      const id = await storeKnowledge({
        id: fname.replace(".json", ""),
        content: doc,
        metadata: { source: fname },
        title: (doc.title as string) || fname,
        category: (doc.category as string) || "general",
        source: "local",
      });
      return { source: "local", file: fname, id };
    }),
  );

  const results: Result<any>[] = settled.map((r) => ({
    source: "local",
    ...(r.status === "fulfilled" ? { ...r.value } : { reason: r.reason }),
    status: r.status,
  }));

  return { processed: files.length, results };
}

// src/routes/notionIngest.routes.ts
import { Router } from "express";
import {
  ingestFromNotion,
  ingestFromLocal,
} from "../services/ingestionService";
import logger from "../utils/logger";

const router = Router();

router.post("/notion", async (req, res) => {
  try {
    const { processed, results } = await ingestFromNotion();
    res.json({ ok: true, processed, results });
  } catch (err) {
    logger.error("Notion ingestion failed", err);
    res.status(500).json({ ok: false, error: err.message || err });
  }
});

router.post("/local", async (req, res) => {
  try {
    const { processed, results } = await ingestFromLocal();
    res.json({ ok: true, processed, results });
  } catch (err) {
    logger.error("Local ingestion failed", err);
    res.status(500).json({ ok: false, error: err.message || err });
  }
});

export default router;
