import {
  registerIntegration,
  getIntegrationConfig,
  updateIntegrationStatus,
} from "../integrationService";

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase module
vi.mock("../../lib/supabase", () => {
  const mockReturn = {
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  };

  return {
    supabase: {
      from: vi.fn(() => mockReturn),
      sql: vi.fn((strings: any, ...values: any[]) => ({ strings, values })),
    },
  };
});

import { supabase } from "../../lib/supabase";

describe("Integration Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("registerIntegration", () => {
    it("should register integration successfully", async () => {
      const mockIntegration = {
        serviceName: "test-service",
        apiKey: "test-key",
      };

      const mockResponse = {
        data: { id: "test-id", ...mockIntegration },
        error: null,
      };

      (supabase.from().insert().select().single as any).mockResolvedValue(
        mockResponse,
      );

      const id = await registerIntegration(mockIntegration);
      expect(id).toBe("test-id");
    });

    it("should handle registration errors", async () => {
      const mockError = new Error("Registration failed");
      (supabase.from().insert().select().single as any).mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(
        registerIntegration({
          serviceName: "test",
          apiKey: "test",
        }),
      ).rejects.toThrow("Failed to register integration");
    });
  });

  describe("getIntegrationConfig", () => {
    it("should get active integration config", async () => {
      const mockConfig = {
        id: "test-id",
        service_name: "test-service",
        api_key_hash: "test-key",
        status: "active",
      };

      (supabase.from().select().eq().eq().single as any).mockResolvedValue({
        data: mockConfig,
        error: null,
      });

      const config = await getIntegrationConfig("test-service");
      expect(config).toBeDefined();
      expect(config?.serviceName).toBe("test-service");
    });
  });

  describe("updateIntegrationStatus", () => {
    it("should update integration status", async () => {
      const mockResponse = { error: null };
      (supabase.from().update().eq as any).mockResolvedValue(mockResponse);

      await expect(
        updateIntegrationStatus("test-id", "inactive"),
      ).resolves.not.toThrow();
    });
  });
});
