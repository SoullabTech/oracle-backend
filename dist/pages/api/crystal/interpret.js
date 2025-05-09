// File: /pages/api/crystal/interpret.ts
import { extractSymbol } from '@/utils/symbolicTagUtil';
import { oracleOrchestrator } from '@/core/oracleOrchestrator';
import { memoryModule } from '@/utils/memoryModule';
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    try {
        const { input, phase, element, emotion, persona, source = 'oracle', storeToMemory = false } = req.body;
        if (!input || !element || !phase) {
            return res.status(400).json({ error: 'Missing required fields: input, element, or phase.' });
        }
        const symbol = extractSymbol(input);
        const payload = {
            input,
            symbol,
            element,
            phase,
            emotion,
            persona,
            source
        };
        const result = await oracleOrchestrator(payload);
        if (storeToMemory) {
            await memoryModule.store({ ...payload, response: result });
        }
        res.status(200).json(result);
    }
    catch (err) {
        console.error('Crystal API Error:', err);
        res.status(500).json({ error: 'Internal Crystal Interpretation Failure' });
    }
}
