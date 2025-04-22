// src/services/elementalOracleService.ts
import { logInsight } from "../utils/oracleLogger"; // ✅ fixed import
export const elementalOracle = {
  async generateStory(request, context) {
    const { elementalTheme, archetype, focusArea } = request;
    const story = {
      narrative: `Once upon a time, in the realm of ${elementalTheme}, a soul known as the ${archetype} sought ${focusArea}.`,
      reflections: [
        `This story reflects your elemental alignment with ${elementalTheme}.`,
        `The archetype "${archetype}" is calling you into deeper awareness.`,
      ],
      symbols: ["mirror", "flame", "labyrinth"],
    };
    await logInsight({
      userId: "system",
      insightType: "story",
      content: story.narrative,
      metadata: {
        element: elementalTheme,
        archetype,
        symbols: story.symbols,
        reflections: story.reflections,
        phase: "narrative-visioning",
      },
    });
    return story;
  },
};
