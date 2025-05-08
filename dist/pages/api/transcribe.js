// ✅ BACKEND - /src/pages/api/transcribe.ts
import formidable from 'formidable';
import fs from 'fs';
// Ensure Next.js doesn’t parse body
export const config = {
    api: {
        bodyParser: false,
    },
};
// Save incoming file and pass to transcription service
export default async function handler(req, res) {
    if (req.method !== 'POST')
        return res.status(405).json({ error: 'Method not allowed' });
    const form = new formidable.IncomingForm({ multiples: false, uploadDir: '/tmp', keepExtensions: true });
    form.parse(req, async (err, fields, files) => {
        if (err)
            return res.status(500).json({ error: 'File parsing failed' });
        const file = files.audio;
        if (!file)
            return res.status(400).json({ error: 'No audio file provided' });
        try {
            // 🔧 Replace this with OpenAI Whisper, Deepgram, AssemblyAI, etc.
            const fakeTranscript = `This is a placeholder transcription of ${file.originalFilename}`;
            // Cleanup if needed
            fs.unlinkSync(file.filepath);
            res.status(200).json({ transcript: fakeTranscript });
        }
        catch (e) {
            console.error('❌ Transcription error:', e);
            res.status(500).json({ error: 'Transcription failed' });
        }
    });
}
