export default async function handler(req, res) {
    const { text, voiceId } = req.body;
    if (!text || !voiceId)
        return res.status(400).json({ error: 'Missing text or voice ID' });
    const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text,
            voice_settings: { stability: 0.5, similarity_boost: 0.7 },
        }),
    });
    if (!elevenRes.ok)
        return res.status(500).json({ error: 'TTS generation failed' });
    const audioBuffer = await elevenRes.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
}
