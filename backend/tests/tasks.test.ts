import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/utils/prisma";

beforeEach(async () => {
  // Clear tasks table before each test
  await prisma.task.deleteMany();
});

afterAll(async () => {
  // Disconnect Prisma after tests
  await prisma.$disconnect();
});

describe("Tasks API", () => {

  it("should create a new task", async () => {
    const newTask = { title: "Test Task", description: "Test description", status: "OPEN" };

    const res = await request(app)
      .post("/api/tasks")
      .send(newTask);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(newTask);
  });

  it("should fetch latest 5 open tasks", async () => {
    // Insert 6 tasks
    for (let i = 1; i <= 6; i++) {
      await prisma.task.create({
        data: { title: `Task ${i}`, description: `Description ${i}`, status: "OPEN" }
      });
    }

    const res = await request(app).get("/api/tasks?limit=5");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(5);
    expect(res.body[0].title).toBe("Task 6"); // newest first
  });

  it("should update a task's status", async () => {
    const task = await prisma.task.create({
      data: { title: "Task 1", description: "Desc", status: "OPEN" }
    });

    const res = await request(app)
      .patch(`/api/tasks/${task.id}`)
      .send({ status: "DONE" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("DONE");
  });

  it("should return 404 when updating a non-existent task", async () => {
    const res = await request(app)
      .patch("/api/tasks/999999")
      .send({ status: "DONE" });

    expect(res.status).toBe(404);
  });

});
