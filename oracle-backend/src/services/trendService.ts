import axios from 'axios';

const SUPABASE_URL = process.env.SUPABASE_URL; // e.g., "https://your-project.supabase.co"
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY; // Your Supabase API key

/**
 * Posts trend data to the Supabase meta_user_trends endpoint.
 *
 * @param jwt - The JWT token for Authorization
 * @param data - Trend data to be sent to Supabase
 * @returns A promise that resolves with the response data.
 */
export async function postMetaUserTrend(jwt: string, data: {
  anon_id: string;
  primary_element: string;
  journal_count: number;
  avg_emotion_score: number;
  active_phase: string;
}): Promise<any> {
  if (!SUPABASE_URL || !SUPABASE_API_KEY) {
    throw new Error('Supabase URL or API key is not defined in environment variables.');
  }
  
  const endpoint = `${SUPABASE_URL}/rest/v1/meta_user_trends`;

  try {
    const response = await axios.post(endpoint, data, {
      headers: {
        'apikey': SUPABASE_API_KEY,
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error posting meta user trend:", error);
    throw error;
  }
}

