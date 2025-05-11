// src/services/myService.test.ts
import { supabase } from "@supabase/supabase-js"; // Import the mocked supabase client
import { myServiceFunction } from "../myService"; // Function under test
describe("My Service", () => {
  it("should fetch user data successfully", async () => {
    const response = await myServiceFunction();
    expect(response.data[0].name).toBe("Test User");
    expect(response.error).toBeNull();
    expect(supabase.from).toHaveBeenCalledWith("users"); // Check if correct table is queried
  });
  it("should insert user data successfully", async () => {
    const response = await myServiceFunction();
    expect(supabase.from().insert).toHaveBeenCalled();
    expect(response.data[0].name).toBe("Test User");
  });
  it("should handle insert errors", async () => {
    // Simulating error in insert
    supabase.from().insert.mockResolvedValue({
      data: null,
      error: { message: "Insert failed" },
    });
    const response = await myServiceFunction();
    expect(response.error.message).toBe("Insert failed");
  });
});
