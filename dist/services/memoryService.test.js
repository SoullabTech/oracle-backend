// test/services/memoryService.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { storeMemoryItem } from "@/services/memoryService";
import { supabase } from "../../test/__mocks__/supabase";
vi.mock("@/lib/supabaseClient", () => ({
  supabase,
}));
vi.mock("@/utils/oracleLogger", () => ({
  logInsight: vi.fn(),
}));
vi.mock("@/utils/logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));
describe("storeMemoryItem()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should insert a memory and return it", async () => {
    const memory = {
      clientId: "user-123",
      content: "This is a test memory.",
      metadata: { tags: ["dream", "shadow"] },
      sourceAgent: "test-agent",
      element: "water",
      confidence: 0.85,
    };
    const result = await storeMemoryItem(memory);
    expect(result).toBeDefined();
    expect(supabase.from().insert).toHaveBeenCalled();
    expect(supabase.from().select).toHaveBeenCalled();
    expect(result.content).toBe("This is a test memory.");
  });
});
