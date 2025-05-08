// File: /pages/api/voice/elevenlabs.ts
// Layer: 🔁 Backend (API route)
const ELEVEN_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const ELEVEN_VOICE_ID = process.env.ELEVEN_LABS_VOICE_ID || 'default';
export default async function handler(req, res) {
    if (req.method !== 'POST')
        return res.status(405).json({ error: 'Method Not Allowed' });
    const { text, tone = 'gentle', emotion = 'neutral' } = req.body;
    if (!text || !ELEVEN_API_KEY)
        return res.status(400).json({ error: 'Missing input or API key.' });
    try {
        const voiceRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`, {
            method: 'POST',
            headers: {
                'xi-api-key': ELEVEN_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg',
            },
            body: JSON.stringify({
                text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: tone,
                    use_speaker_boost: true,
                }
            }),
        });
        const audioBuffer = await voiceRes.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        res.status(200).send(Buffer.from(audioBuffer));
    }
    catch (err) {
        console.error('[TTS ElevenLabs] Error:', err);
        res.status(500).json({ error: 'Failed to generate voice from Eleven Labs' });
    }
}
