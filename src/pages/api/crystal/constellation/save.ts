import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../lib/supabaseClient';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      user_id,
      journal_input,
      ritual_label,
      spiral_phase,
      blueprint_json
    } = req.body;

    if (!user_id || !journal_input || !spiral_phase || !blueprint_json) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { error } = await supabase.from('user_constellations').insert([
      {
        user_id,
        journal_input,
        ritual_label,
        spiral_phase,
        blueprint_json
      }
    ]);

    if (error) {
      console.error('[Supabase Error]', error.message);
      return res.status(500).json({ error: 'Failed to save constellation' });
    }

    return res.status(200).json({ success: true, message: 'Constellation saved.' });
  } catch (err) {
    console.error('[API Error]', err);
    return res.status(500).json({ error: 'Unexpected server error.' });
  }
}
