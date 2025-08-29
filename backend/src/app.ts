import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { router as taskRouter } from "./routes/tasks";

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(helmet());
app.use(rateLimit({ windowMs: 5 * 60 * 1000, max: 100 }));

app.use("/api/tasks", taskRouter);

app.get("/", (req, res) => {
    res.send("Backend working!");
});

export default app;