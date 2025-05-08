// src/integration/_tests_/mainOracleAgent.integration.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { oracle } from "@/core/agents/mainOracleAgent";
import * as profileService from "@/services/profileService";
import * as memoryService from "@/services/memoryService";
import * as elementalOracleService from "@/services/elementalOracleService";
import * as oracleLogger from "@/utils/oracleLogger";
vi.mock("@/services/profileService");
vi.mock("@/services/memoryService");
vi.mock("@/services/elementalOracleService");
vi.mock("@/utils/oracleLogger");
describe("MainOracleAgent - processQuery", () => {
    const mockUserId = "user-123";
    const mockInput = "tell me a story about fire";
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(profileService, "getUserProfile").mockResolvedValue({
            fire: 0.9,
            water: 0.4,
            earth: 0.3,
            air: 0.5,
            aether: 0.6,
            crystal_focus: {},
        });
        vi.spyOn(memoryService, "getRelevantMemories").mockResolvedValue([
            { content: "previous insight", element: "fire" },
        ]);
        vi.spyOn(elementalOracleService.elementalOracle, "generateStory").mockResolvedValue({
            narrative: "A fiery transformation occurred...",
            reflections: ["Embrace change", "Act with courage"],
            symbols: ["Phoenix", "Flame"],
        });
        vi.spyOn(memoryService, "storeMemoryItem").mockResolvedValue(undefined);
        vi.spyOn(oracleLogger, "logInsight").mockResolvedValue(undefined);
    });
    it("generates a story when story keywords are present", async () => {
        const result = await oracle.processQuery({
            input: mockInput,
            userId: mockUserId,
        });
        expect(result.content).toContain("A fiery transformation occurred");
        expect(result.metadata?.storyRequest?.elementalTheme).toBe("fire");
        expect(result.metadata?.symbols).toContain("Phoenix");
        expect(result.feedbackPrompt).toBeDefined();
    });
    // Add more test cases later:
    // - Shadow insight path
    // - Elemental routing (e.g., fireAgent, waterAgent)
    // - Feedback handling
});
