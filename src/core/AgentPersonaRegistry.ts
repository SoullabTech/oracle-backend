// File: /src/core/AgentPersonaRegistry.ts
// Layer: 🧬 Backend/Frontend Shared — Dynamic Agent Loader from Creator Studio

export const AgentPersonaRegistry: Record<string, any> = {};

export async function loadAgentsFromStudio() {
  try {
    const res = await fetch('/api/studio/agents');
    const agents = await res.json();

    agents.forEach((agent) => {
      AgentPersonaRegistry[agent.element] = {
        name: agent.name,
        tone: agent.tone,
        voice: agent.voiceProvider,
        prompt: agent.promptTemplate,
        range: [agent.phaseStart, agent.phaseEnd],
      };
    });

    console.log('[AgentRegistry] Loaded', Object.keys(AgentPersonaRegistry));
  } catch (err) {
    console.error('Failed to load agent registry:', err);
  }
}

