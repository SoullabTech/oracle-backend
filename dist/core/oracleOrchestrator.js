// ✅ File: /src/core/oracleOrchestrator.ts
// Layer: 🔁 Backend – Spiralogic Orchestration & Logging
import OpenAI from 'openai';
import { extractSymbol } from '@/utils/symbolicTagUtil';
import { AgentPersonaRegistry } from '@/core/AgentPersonaRegistry';
import memoryModule from '@/utils/memoryModule';
import { getRitualBySymbolPhase, logRitualEvent } from '@/services/ritualService';
import { postToBBS } from '@/utils/bbsPoster';
import { logToSanctum } from '@/utils/sanctumLogger';
import { trackEvent, evaluateUserTier } from '@/utils/tierTracker';
import { PTSDAgent } from '@/agents/ptsdAgent';
// 🔑 OpenAI client (v4+)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export async function oracleOrchestrator({ input, element, phase, emotion, persona, symbol, source, storeToMemory = false, accessLevel = 'private', userId, agentLabel, }) {
    // PTSD Agent override based on language
    if (/\btrauma\b|\bptsd\b|\btriggered\b|\bflashback\b/i.test(input)) {
        const ptsdResponse = await PTSDAgent.process({ userId: userId || '', message: input, emotionalTone: emotion || 'neutral' });
        return {
            insight: ptsdResponse.response,
            ritual: '',
            nextPhase: 'Integration',
            symbol: symbol || extractSymbol(input).symbol,
            element: 'Water',
            agent: 'PTSD Agent',
            access: accessLevel,
        };
    }
    // 1. 🔍 Extract symbol if not given
    const sym = symbol || extractSymbol(input).symbol;
    // 2. 🧠 Prompt construction
    const systemPrompt = `
You are a symbolic oracle of the Spiralogic system.
When given user input, respond in exactly this format:

INSIGHT: <a concise reflection>
RITUAL: <a ritual suggestion>
NEXT_PHASE: <the next phase name>
`;
    const userPrompt = `
Input: ${input}
Symbol: ${sym}
Phase: ${phase || ''}
Element: ${element || ''}
Persona: ${persona || ''}
Emotion: ${emotion || ''}
Source: ${source || ''}
`;
    // 3. 🔮 Call OpenAI
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.7,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
    });
    const text = completion.choices[0].message.content ?? '';
    // 4. ✨ Extract structured data
    const parsed = {
        insight: extractField(text, 'INSIGHT'),
        ritual: extractField(text, 'RITUAL') || getRitualBySymbolPhase(sym, phase),
        nextPhase: extractField(text, 'NEXT_PHASE'),
        symbol: sym,
        element,
        agent: AgentPersonaRegistry[element ?? 'Fire']?.name ?? 'Oracle Agent',
        access: accessLevel,
    };
    // 5. 📝 Log core ritual event (always logs to Supabase)
    await logRitualEvent({
        input,
        reply: parsed.insight,
        element: element || 'Unknown',
        phase: Number(phase) || 0,
        persona: persona || 'oracle',
        source: source || 'oracleOrchestrator',
        userId,
    });
    // 6. 🧠 Save memory, sanctum, and evaluate engagement
    if (storeToMemory && userId) {
        await memoryModule.store({ input, ...parsed, access: accessLevel, agentLabel });
        await logToSanctum({ input, ...parsed, access: accessLevel, agentLabel });
        await trackEvent(userId, 'oracle_invoked');
        await evaluateUserTier(userId);
    }
    // 7. 📡 Broadcast if phase shifted & public
    if (parsed.nextPhase &&
        parsed.nextPhase !== phase &&
        parsed.insight &&
        accessLevel === 'public') {
        await postToBBS({
            topic: `Phase Shift: ${sym} → ${parsed.nextPhase}`,
            summary: parsed.insight,
            tag: sym,
            phase: parsed.nextPhase,
            ritual: parsed.ritual,
            access: accessLevel,
        });
    }
    return parsed;
}
// 🛠️ Utility: Extracts labeled responses
function extractField(text, label) {
    const regex = new RegExp(`${label}:\\s*(.*?)\\s*(?:\\n|$)`, 'i');
    const match = regex.exec(text + '\n');
    return match?.[1]?.trim() ?? '';
}
