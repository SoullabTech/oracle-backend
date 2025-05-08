// File: /pages/api/feedback.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

// shape of the expected POST body
type FeedbackBody = {
  magical?: string;
  confusing?: string;
  blockers?: string;
  comments?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // initialize a server‑side Supabase client
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { magical, confusing, blockers, comments } = req.body as FeedbackBody;

    const { error } = await supabase
      .from('feedback')
      .insert([{
        user_id: user.id,
        magical,
        confusing,
        blockers,
        comments,
      }]);

    if (error) {
      console.error('Feedback insert error:', error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ message: 'Feedback saved' });
  }

  // only POST supported
  res.setHeader('Allow', 'POST');
  return res.status(405).end();
}
