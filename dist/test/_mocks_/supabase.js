// _mocks_/supabase.js
import { vi } from "vitest";
// Mock functions to mimic supabase methods
export const supabase = {
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockResolvedValue({
      data: [{ id: "1", name: "Mock User" }],
      error: null,
    }),
    upsert: vi.fn().mockResolvedValue({
      data: [{ id: "1", name: "Updated Mock User" }],
      error: null,
    }),
  }),
};
