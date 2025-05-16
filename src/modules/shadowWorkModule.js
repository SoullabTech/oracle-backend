// src/modules/shadowWorkModule.js

import { FireAgent } from '../core/agents/fireAgent.js';
import { WaterAgent } from '../core/agents/waterAgent.js';
import { EarthAgent } from '../core/agents/earthAgent.js';
import { AirAgent } from '../core/agents/airAgent.js';
import { AetherAgent } from '../core/agents/aetherAgent.js';
import { FacilitatorAgent } from '../core/agents/facilitatorAgent.js';
import logger from '../utils/logger.js';

/**
 * Runs each element agent briefly and returns the first valid insight.
 * Returns null if none provide a usable response.
 */
export async function runShadowWork(input, userId) {
  const agents = [
    new FireAgent(),
    new WaterAgent(),
    new EarthAgent(),
    new AirAgent(),
    new AetherAgent(),
    new FacilitatorAgent(),
  ];

  for (const agent of agents) {
    try {
      const res = await agent.processQuery({ input, userId });
      if (res?.content) {
        logger.info('ShadowWork: insight from', { agent: agent.constructor.name });
        return {
          content: res.content,
          provider: agent.constructor.name,
          model: res.metadata?.model || 'gpt-4',
          confidence: res.confidence,
          metadata: res.metadata,
        };
      }
    } catch (err) {
      logger.warn('ShadowWork: agent failed', {
        agent: agent.constructor.name,
        error: err.message || err,
      });
    }
  }

  return null;
}
