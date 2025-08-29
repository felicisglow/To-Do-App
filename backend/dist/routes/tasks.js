"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const prisma_1 = require("../utils/prisma");
const zod_1 = require("zod");
exports.router = (0, express_1.Router)();
const createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(160),
    description: zod_1.z.string().max(5000).optional(),
});
//create new task
exports.router.post("/", async (req, res, next) => {
    try {
        const data = createTaskSchema.parse(req.body);
        const newTask = await prisma_1.prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
            },
        });
        res.status(201).json(newTask);
    }
    catch (err) {
        next(err);
    }
});
//get the 5 latest open taks from the database
exports.router.get("/", async (_req, res, next) => {
    try {
        const tasks = await prisma_1.prisma.task.findMany({
            where: { status: "OPEN" },
            orderBy: { createdAt: "desc" },
            take: 5,
        });
        res.json(tasks);
    }
    catch (err) {
        next(err);
    }
});
//mark a task as done
exports.router.patch("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedTask = await prisma_1.prisma.task.update({
            where: { id },
            data: { status },
        });
        res.json(updatedTask);
    }
    catch (err) {
        res.status(404).json({ error: "Task not found" });
    }
});
