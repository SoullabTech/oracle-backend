// src/services/__tests__/myService.test.ts
import { supabase } from "../__mocks__/supabaseClient"; // Import mock
import { myServiceFunction } from "../myService"; // Function you want to test
describe("My Service", () => {
  it("should fetch user data successfully", async () => {
    // Call the service function that uses the mocked supabase
    const response = await myServiceFunction();
    // Assert that the data is fetched correctly from the mock
    expect(response.data[0].name).toBe("Test User");
    expect(response.error).toBeNull();
  });
  it("should insert a new user successfully", async () => {
    // Call the function that interacts with the insert method
    const response = await myServiceFunction(); // Function should use supabase.insert
    // Check if the insert method was called
    expect(supabase.from().insert).toHaveBeenCalled();
    expect(response.data[0].name).toBe("New User");
  });
  it("should handle errors in insertion", async () => {
    // Simulate an error response from the mock
    supabase.from().insert.mockResolvedValue({
      data: null,
      error: { message: "Insert failed" },
    });
    const response = await myServiceFunction();
    expect(response.error.message).toBe("Insert failed");
  });
});
