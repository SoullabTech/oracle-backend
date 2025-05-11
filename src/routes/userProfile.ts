// src/routes/userProfile.test.ts
import request from "supertest";
import app from "../app"; // or adjust path/export if needed

describe("POST /update-profile", () => {
  it("should update user profile successfully", async () => {
    const profileData = {
      user_id: "user123",
      fire: 75,
      water: 60,
      earth: 45,
      air: 80,
      aether: 90,
      crystal_focus: {
        type: "career",
        challenges: "Struggling with work-life balance",
        aspirations: "Achieve career success",
      },
    };

    const response = await request(app)
      .post("/update-profile")
      .send(profileData)
      .expect(200);

    expect(response.body.id).toBeDefined();
    expect(response.body.user_id).toBe("user123");
    expect(response.body.fire).toBe(75);
    expect(response.body.crystal_focus.type).toBe("career");
  });

  it("should return an error if validation fails", async () => {
    const invalidData = {
      user_id: "user123",
      fire: 120, // Invalid: exceeds expected range
      water: 60,
      earth: 45,
      air: 80,
      aether: 90,
    };

    const response = await request(app)
      .post("/update-profile")
      .send(invalidData)
      .expect(400);

    expect(response.body.message).toBe("Profile validation failed");
  });
});
