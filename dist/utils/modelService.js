// src/utils/modelService.ts
import { openai } from '../lib/openaiClient';
import logger from './logger';
export class ModelService {
    /**
     * Get a symbolic oracle-style response from an LLM.
     */
    static async queryModel(agentName, input) {
        try {
            logger.info(`🔮 Sending input to ${agentName} model`, { input: input.message });
            const completion = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: `You are ${agentName}, a symbolic oracle. Offer archetypal and transformative insight.`,
                    },
                    {
                        role: 'user',
                        content: input.message,
                    },
                ],
                temperature: 0.8,
                max_tokens: 800,
            });
            const responseText = completion.choices[0]?.message?.content?.trim() ?? '';
            logger.info(`✅ Model response from ${agentName}`, { response: responseText });
            return responseText;
        }
        catch (error) {
            logger.error(`❌ ModelService error for ${agentName}`, { error });
            return `Symbolic processing failed for ${agentName}. Please try again later.`;
        }
    }
}
export default ModelService;
