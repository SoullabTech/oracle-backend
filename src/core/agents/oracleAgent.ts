// src/core/agents/oracleAgent.ts

import type { AgentResponse, Metadata } from "../../types/ai.js";

export class OracleAgent {
  debug: boolean;

  constructor(options: { debug?: boolean } = {}) {
    this.debug = options.debug ?? false;
  }

  /**
   * Processes a basic query with simulated output.
   * Subclasses should override this method with specialized behavior.
   */
  async processQuery(query: string): Promise<AgentResponse> {
    if (this.debug) {
      console.log('[OracleAgent] Processing query:', query);
    }

    const detectedElement = this.detectElement(query);

    const simulatedResponse = `Processed query: ${query}`;
    const metadata: Metadata = {
      timestamp: new Date().toISOString(),
      element: detectedElement,
      processedAt: new Date().toISOString(),
      prefect: { task: 'simulate', status: 'success' },
    };

    return {
      response: simulatedResponse,
      confidence: 0.9,
      metadata,
      routingPath: [detectedElement, 'oracle-agent'],
    };
  }

  /**
   * Detects which elemental archetype the query relates to.
   */
  protected detectElement(text: string): string {
    const lower = text.toLowerCase();

    if (lower.includes('fire')) return 'Fire';
    if (lower.includes('water')) return 'Water';
    if (lower.includes('earth')) return 'Earth';
    if (lower.includes('air')) return 'Air';

    return 'Aether';
  }
}
