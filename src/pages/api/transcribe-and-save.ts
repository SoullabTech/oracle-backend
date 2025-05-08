// ✅ BACKEND - /pages/api/transcribe-and-save.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';
import { supabase } from '../lib/supabaseClient';


export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm({ multiples: false, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('❌ Form parse error:', err);
      return res.status(500).json({ error: 'Form parse failed' });
    }

    const file = files.audio as formidable.File;
    const userId = fields.user_id as string;
    const journalId = fields.journal_id as string | undefined;
    const constellationId = fields.constellation_id as string | undefined;

    if (!file || !userId) {
      return res.status(400).json({ error: 'Missing audio or user ID' });
    }

    try {
      const audioStream = fs.createReadStream(file.filepath);
      const whisperRes = await openai.createTranscription(audioStream as any, 'whisper-1');
      const transcript = whisperRes.data.text;

      const { error } = await supabase.from('user_transcripts').insert([
        {
          user_id: userId,
          transcript,
          journal_id: journalId || null,
          constellation_id: constellationId || null,
        },
      ]);

      if (error) {
        console.error('❌ Supabase insert error:', error);
        return res.status(500).json({ error: 'Failed to save transcript' });
      }

      try {
        fs.unlinkSync(file.filepath);
      } catch (unlinkErr) {
        console.warn('⚠️ Temp file delete failed:', unlinkErr);
      }

      res.status(200).json({ transcript });
    } catch (e) {
      console.error('❌ Transcription failed:', e);
      res.status(500).json({ error: 'Transcription or save failed' });
    }
  });
}
