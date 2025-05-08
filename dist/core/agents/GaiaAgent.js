// src/agents/gaiaAgent.ts
import { suggestNatureRitual, logOracleInsight } from '@/utils/oracleLogger';
/**
 * GaiaAgent — Earth Elemental
 * Archetypes: Earth Steward, Somatic Healer, Herbalist
 */
export class GaiaAgent {
    static async process(input) {
        const { userId, message } = input;
        const ritual = suggestNatureRitual(message);
        await logOracleInsight(userId, 'Gaia Agent', message, 'Nature Ritual', ritual);
        return {
            agent: 'Gaia Agent',
            response: `🌿 Your nervous system may be asking for an Earth ritual. Here is a suggestion: ${ritual}`,
            tone: 'Grounded',
            emotion: 'Soothing',
        };
    }
}
