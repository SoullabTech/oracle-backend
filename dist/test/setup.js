"use strict";
vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn(() => ({
      from: vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({
          data: [{ id: "1", name: "Test User" }],
          error: null,
        }),
        select: vi.fn().mockResolvedValue({
          data: [{ id: "1", name: "Test User" }],
          error: null,
        }),
        update: vi.fn().mockResolvedValue({
          data: [{ id: "1", name: "Updated User" }],
          error: null,
        }),
        delete: vi.fn().mockResolvedValue({
          data: [{ id: "1", name: "Deleted User" }],
          error: null,
        }),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
      })),
    })),
  };
});
