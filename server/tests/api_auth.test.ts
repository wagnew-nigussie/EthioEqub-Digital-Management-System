import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/index";

describe("API Health & Authentication Endpoints (FR-001, NFR-012)", () => {
  it("GET /api/health returns 200 HEALTHY with database CONNECTED", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("HEALTHY");
    expect(res.body.database).toBe("CONNECTED");
  });

  it("POST /api/v1/auth/login succeeds with seeded credentials and sets session cookie", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "wagnewnigussie569@gmail.com",
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe("wagnewnigussie569@gmail.com");
    expect(res.body.data.token).toBeDefined();

    // Verify Set-Cookie header contains HttpOnly session
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain("ethioequb_session=");
    expect(cookies[0]).toContain("HttpOnly");
  });

  it("POST /api/v1/auth/login rejects wrong password with 401 Unauthorized", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "wagnewnigussie569@gmail.com",
        password: "wrongpassword",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("POST /api/v1/auth/register rejects invalid email with 400 VALIDATION_ERROR", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Test User",
        email: "not-an-email",
        phone: "+251911000000",
        password: "short",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});
