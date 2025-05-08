export function generateDailyPrompt({ userId }) {
    const currentPhase = getUserCurrentPhase(userId); // from HealingMap
    const agent = selectAgentForPhase(currentPhase); // e.g. WaterAgent for Transformation
    const ritual = generateRitual({ emotion: "stuck", archetype: "Seeker", element: agent.element });
  
    return {
      phase: currentPhase,
      prompt: agent.dailyPrompt(),
      ritual,
    };
  }
  