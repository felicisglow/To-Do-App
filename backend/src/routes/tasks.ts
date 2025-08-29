import { Router } from "express";
import { prisma } from "../utils/prisma";
import { z } from "zod";

export const router = Router();


const createTaskSchema = z.object({
  title: z.string().min(1).max(160),
  description: z.string().max(5000).optional(),
});

//create new task
router.post("/", async (req, res, next) => {
  try {
    const data = createTaskSchema.parse(req.body);
    const newTask = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
      },
    });
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

//get the 5 latest open taks from the database
router.get("/", async (_req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

//mark a task as done
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
    });
    res.json(updatedTask);
  } catch (err) {
    res.status(404).json({ error: "Task not found" });
  }
});





