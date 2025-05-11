// src/services/__mocks__/supabaseClient.ts
import { vi } from "vitest";
const mockSelect = vi.fn().mockResolvedValue({
  data: [{ id: "1", name: "Test User", email: "test@example.com" }],
  error: null,
});
const mockUpsert = vi.fn().mockResolvedValue({
  data: [{ id: "1", name: "Updated User", email: "updated@example.com" }],
  error: null,
});
const mockInsert = vi.fn().mockResolvedValue({
  data: [{ id: "2", name: "New User", email: "new@example.com" }],
  error: null,
});
const mockUpdate = vi.fn().mockResolvedValue({
  data: [{ id: "1", name: "Updated User", email: "updated@example.com" }],
  error: null,
});
const mockDelete = vi.fn().mockResolvedValue({
  data: [{ id: "1", name: "Deleted User", email: "deleted@example.com" }],
  error: null,
});
export const supabase = {
  from: vi.fn(() => ({
    select: mockSelect,
    upsert: mockUpsert,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  })),
};
