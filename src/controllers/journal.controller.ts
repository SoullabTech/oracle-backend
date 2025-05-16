// src/controllers/journal.controller.ts
import { NextApiRequest, NextApiResponse } from "next";
import { logAdjusterInsight, logJournalEntry } from "@/lib/logger";

export default async function journalHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, content, phase } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Log journal content
    await logJournalEntry({ userId, content });

    // AdjusterAgent activation logic: simple keyword check
    const keywords = ["rupture", "fragmented", "betrayed", "confused", "grief"];
    const triggerDetected = keywords.some((word) => content.toLowerCase().includes(word));

    if (triggerDetected) {
      const adjusterReflection = `A resonance shift has been detected. What part of your story feels out of phase right now?`;
      await logAdjusterInsight({ userId, content: adjusterReflection, phase });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[Journal Handler] Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
