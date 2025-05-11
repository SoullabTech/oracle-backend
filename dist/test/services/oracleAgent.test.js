import { describe, it, expect, vi } from "vitest";
import { oracle } from "@/core/agents/mainOracleAgent";
vi.mock("@/services/profileService", () => ({
  getUserProfile: vi.fn(() => ({
    crystal_focus: "fire",
    fire: 80,
    water: 60,
    earth: 40,
    air: 30,
    aether: 70,
  })),
}));
vi.mock("@/services/monitoringService", () => ({
  getPersonalityWeights: vi.fn(() => ({
    fire: 0.8,
    water: 0.6,
    earth: 0.4,
    air: 0.3,
    aether: 0.7,
  })),
}));
vi.mock("@/services/memoryService", () => ({
  getRelevantMemories: vi.fn(() => [
    { id: "1", content: "Previous dream...", metadata: { tags: ["dream"] } },
  ]),
}));
describe("oracleAgent.processQuery", () => {
  it("routes to a symbolic agent when matched", async () => {
    const result = await oracle.processQuery({
      input: "I had a dream about flying",
      userId: "test-user",
    });
    expect(result.metadata?.routedFrom).toBe("symbolic");
    expect(result.metadata?.queryType).toBe("dream");
    expect(result.content).toMatch(/dream/i);
  });
  it("routes to elemental agent when no symbolic match", async () => {
    const result = await oracle.processQuery({
      input: "I want to create something new",
      userId: "test-user",
    });
    expect(result.metadata?.routedFrom).toBe("elemental");
    expect(result.metadata?.element).toBeDefined();
  });
  it("returns a story response when story keyword is present", async () => {
    const result = await oracle.processQuery({
      input: "Tell me a story about fire and transformation",
      userId: "test-user",
    });
    expect(result.metadata?.routedFrom).toBe("story");
    expect(result.metadata?.storyRequest?.elementalTheme).toBe("fire");
  });
  it("handles shadow fallback when no route applies", async () => {
    const result = await oracle.processQuery({
      input: "Why do I keep sabotaging myself?",
      userId: "test-user",
    });
    expect(result.metadata?.routedFrom).toMatch(/symbolic|elemental/);
    expect(result.content).toMatch(/shadow/i);
  });
});
