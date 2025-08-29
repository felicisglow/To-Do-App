import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/utils/prisma";

describe("App routes", () => {
  afterAll(async () => {
    // Close DB connection after tests
    await prisma.$disconnect();
  });

  it("GET / should return 200 and message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Backend working!");
  });

  it("GET /api/tasks should return 200 and an array", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
