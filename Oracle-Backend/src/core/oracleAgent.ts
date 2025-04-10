import type { AgentResponse, Metadata } from './types.js';

export class OracleAgent {
  debug: boolean;

  constructor(options: { debug?: boolean } = {}) {
    this.debug = options.debug || false;
  }

  async processQuery(query: string): Promise<AgentResponse> {
    if (this.debug) {
      console.log("OracleAgent processing query:", query);
    }
    
    const simulatedResponse = `Processed query: ${query}`;
    
    const metadata: Metadata = {
      timestamp: new Date().toISOString(),
      element: this.detectElement(query),
      processedAt: new Date().toISOString(),
      prefect: { task: 'simulate', status: 'success' }
    };

    return {
      response: simulatedResponse,
      confidence: 0.9,
      metadata,
      routingPath: [this.detectElement(query), 'oracle-agent']
    };
  }

  private detectElement(text: string): string {
    const lower = text.toLowerCase();
    if (lower.includes('fire')) return 'Fire';
    if (lower.includes('water')) return 'Water';
    if (lower.includes('earth')) return 'Earth';
    if (lower.includes('air')) return 'Air';
    return 'Aether';
  }
}