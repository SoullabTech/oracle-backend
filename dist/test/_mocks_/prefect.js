// src/services/__mocks__/prefect.ts
export const createFlow = vi.fn().mockResolvedValue({
  id: "flow-123",
  name: "Test Flow",
  status: "completed",
});
export const runFlow = vi.fn().mockResolvedValue({
  status: "success",
  message: "Flow ran successfully",
});
export const getFlowStatus = vi.fn().mockResolvedValue({
  id: "flow-123",
  status: "completed",
});
export const prefectClient = {
  createFlow,
  runFlow,
  getFlowStatus,
};
