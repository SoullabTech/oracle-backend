import { FireAgent } from "@/core/agents/fireAgent";
import { WaterAgent } from "@/core/agents/waterAgent";
import { EarthAgent } from "@/core/agents/earthAgent";
import { AirAgent } from "@/core/agents/airAgent";
import { AetherAgent } from "@/core/agents/aetherAgent";

const agents = [
  new FireAgent(),
  new WaterAgent(),
  new EarthAgent(),
  new AirAgent(),
  new AetherAgent(),
];

export async function generateCircleDialogue(input: string, userId: string) {
  const responses = await Promise.all(
    agents.map(async (agent) => {
      const res = await agent.processQuery({ input, userId });
      return {
        name: agent.constructor.name,
        content: res.content,
        element: res.metadata?.element,
        archetype: res.metadata?.archetype,
      };
    })
  );

  return responses;
}
