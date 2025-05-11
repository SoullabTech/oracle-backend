import { vi } from "vitest";
// Mock the Notion Client
export const Client = vi.fn().mockImplementation(() => ({
  databases: {
    query: vi.fn().mockResolvedValue({ results: [] }), // Mock query response with empty results
  },
  pages: {
    create: vi.fn().mockResolvedValue({ id: "mock-page-id" }), // Mock page creation with a mock page ID
  },
}));
