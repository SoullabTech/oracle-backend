"use strict";

import { OracleAgent } from "./oracleAgent";
import { oracle } from "../core/agents/MainOracleAgent";
import type { AgentResponse, Metadata } from "./types";


export class ClientAgent extends OracleAgent {
  private clientId: string;

  constructor(clientId: string) {
    super();
    this.clientId = clientId;
  }

  async processQuery(query: string): Promise<AgentResponse> {
    const baseResponse = await super.processQuery(query);

    console.log(`[ClientAgent] Processing response for client: ${this.clientId}`);

    const personalizedResponse = `${baseResponse.response}\n\n🧩 Tailored for you, valued client.`;

    const updatedMetadata: Metadata = {
      ...(baseResponse.metadata || {}),
      timestamp: new Date().toISOString(),
      clientId: this.clientId,
      archetype: baseResponse.metadata?.archetype || 'Client',
      phase: baseResponse.metadata?.phase || 'Client Phase',
      emotion_score: baseResponse.metadata?.emotion_score || 0.8,
    };

    const finalResponse: AgentResponse = {
      ...baseResponse,
      response: personalizedResponse,
      metadata: updatedMetadata,
      routingPath: [...(baseResponse.routingPath ?? []), 'client-agent'],
    };

    // Send wisdom to MainOracleAgent (afferent)
    await oracle.storeExchange(this.clientId, query, finalResponse);

    return finalResponse;
  }
}
