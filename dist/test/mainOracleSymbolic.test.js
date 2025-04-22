import { describe, it, expect } from "vitest";
import { oracle } from "../core/agents/MainOracleAgent";
describe("MainOracleAgent Symbolic Routing", () => {
  it("should route a dream-related input to the dreamAgent", async () => {
    const result = await oracle.processQuery({
      input: "Last night I had a dream about flying through ancient ruins.",
      userId: "test-user-001",
    });
    expect(result).toHaveProperty("content");
    expect(result.routingPath?.includes("dream-agent")).toBe(true);
    expect(result.metadata?.archetype).toBe("Dreamer");
  });
});
