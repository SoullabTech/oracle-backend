import { describe, it, expect, beforeEach, vi } from "vitest";
import { Client } from "@notionhq/client";
import { fetchNotionPages, transformToKnowledgeEntry } from "../notionService";

vi.mock("@notionhq/client");

describe("Notion Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchNotionPages", () => {
    it("should fetch and transform pages", async () => {
      const mockPages = [
        {
          id: "page-1",
          properties: {
            Name: { title: [{ plain_text: "Test Page" }] },
            Category: { select: { name: "test" } },
          },
        },
      ];

      const mockBlocks = {
        results: [
          {
            type: "paragraph",
            paragraph: {
              rich_text: [{ plain_text: "Test content" }],
            },
          },
        ],
      };

      (Client.prototype.databases.query as any).mockResolvedValue({
        results: mockPages,
      });

      (Client.prototype.blocks.children.list as any).mockResolvedValue(
        mockBlocks,
      );

      const pages = await fetchNotionPages("test-db");

      expect(pages).toHaveLength(1);
      expect(pages[0].title).toBe("Test Page");
      expect(pages[0].content).toBe("Test content");
    });

    it("should handle fetch errors", async () => {
      (Client.prototype.databases.query as any).mockRejectedValue(
        new Error("API error"),
      );

      await expect(fetchNotionPages("test-db")).rejects.toThrow(
        "Failed to fetch Notion pages",
      );
    });
  });

  describe("transformToKnowledgeEntry", () => {
    it("should transform Notion page to knowledge entry", () => {
      const page = {
        id: "page-1",
        title: "Test Page",
        content: "Test content",
        properties: {
          Category: { select: { name: "test" } },
          Element: { select: { name: "fire" } },
          Confidence: { number: 0.8 },
        },
      };

      const entry = transformToKnowledgeEntry(page);

      expect(entry).toEqual({
        title: "Test Page",
        content: "Test content",
        category: "test",
        element: "fire",
        confidence: 0.8,
        source: "notion",
        metadata: expect.objectContaining({
          notionId: "page-1",
        }),
      });
    });

    it("should use default values when properties are missing", () => {
      const page = {
        id: "page-1",
        title: "Test Page",
        content: "Test content",
        properties: {},
      };

      const entry = transformToKnowledgeEntry(page);

      expect(entry.category).toBe("general");
      expect(entry.confidence).toBe(0.7);
    });
  });
});
