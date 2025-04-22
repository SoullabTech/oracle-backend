import { describe, it, expect } from "vitest";
import { matchSymbolicAgent } from "@/services/symbolicRouterService";
describe("matchSymbolicAgent", () => {
  it("routes dream-related queries", () => {
    const result = matchSymbolicAgent("I had a strange dream last night");
    expect(result?.agent).toBe("dream-agent");
  });
  it("routes mentor requests", () => {
    const result = matchSymbolicAgent(
      "I need a mentor to guide me through this",
    );
    expect(result?.agent).toBe("mentor-agent");
  });
  it("routes inner-guide queries", () => {
    const result = matchSymbolicAgent("Here is my journal reflection today");
    expect(result?.agent).toBe("inner-guide-agent");
  });
  it("routes relationship reflections", () => {
    const result = matchSymbolicAgent(
      "I’m having conflict with a close friend",
    );
    expect(result?.agent).toBe("relationship-agent");
  });
  it("routes shadow processing", () => {
    const result = matchSymbolicAgent(
      "I keep repeating this self-sabotage pattern",
    );
    expect(result?.agent).toBe("shadow-agent");
  });
  it("returns null for non-symbolic input", () => {
    const result = matchSymbolicAgent(
      "This is a neutral update with no special meaning",
    );
    expect(result).toBeNull();
  });
});
