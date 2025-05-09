export function generateRitual({ emotion, archetype, element }: {
    emotion: string;
    archetype: string;
    element: "fire" | "water" | "earth" | "air" | "aether";
  }) {
    const flows: Record<string, any> = {
      grounded: {
        breath: "4-8 Earth breath",
        journal: "What anchors me when I feel shaken?",
        movement: "Slow earth-squat hold",
        sound: "432Hz root chakra track",
      },
      stuck: {
        breath: "Fire breath (quick inhale, full exhale)",
        journal: "What’s the fear beneath my hesitation?",
        movement: "Shaking release + wild dance",
        sound: "Shamanic drum or fire crackle",
      },
      longing: {
        breath: "Water breath — slow, wave-like",
        journal: "What does my heart ache to express?",
        movement: "Flow stretch & chest opener",
        sound: "Mystic cello or moonlight synth",
      },
    };
  
    // Pick a general emotional match (simplified for now)
    const key = ["stuck", "longing", "grounded"].includes(emotion) ? emotion : "stuck";
  
    return {
      element,
      archetype,
      ...flows[key],
      suggestion: "You may close with a single candle moment + intention phrase.",
    };
  }
  