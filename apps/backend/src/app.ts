import cors from "cors";
import express, { type Express } from "express";
import { clerkMiddleware } from "@clerk/express";

import { errorHandler } from "./shared/errors/errorHandler.js";
import { errorMiddleware } from "./shared/middleware/error.middleware.js";

const app: Express = express();

// global middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    // origin: "*",
    credentials: true,
  }),
);

// WEBHOOK ROUTE FIRST as we need the raw request for the web hook
app.use(
  "/v1/users/webhook",
  express.raw({
    type: "application/json",
  }),
);

app.use(express.json());
app.use(errorMiddleware);
app.use(clerkMiddleware());

// health check route
app.get("/health", (req, res) => {
  res.send("Server is healthy");
});

// ! ============ testing open AI ============
// app.get("/test/summarizer", (req, res) => {
//   const ai = new GeminiClient();
//   const log = {
//     initialPrompt: "Create a sinlge component to show a square red box",
//     finalResponse:
//       "<task_summary>\nCreated a single RedBox component that displays a square red box using Tailwind CSS classes (w-32 h-32 bg-red-500).\n</task_summary>",
//     iterations: 2,
//     toolCalls: [
//       {
//         tool: "write_files",
//         filesEffected: ["app/red-box.tsx"],
//         success: true,
//         summary: "write_files executed",
//       },
//     ],
//   };
//   ai.summarizeExecution({ currentMemory: {}, executionLog: log });

//   res.send("Check logs my bwoi!");
// });
// ! ============ testing open AI ============

// routes imports
import userRoutes from "./modules/user/routes/user.routes.js";
import projectRoutes from "./modules/project/routes/project.routes.js";
import messageRoutes from "./modules/messages/routes/message.routes.js";
import { GeminiClient } from "./infra/ai/providers/Gemini.js";

// routes
app.use("/v1/users", userRoutes);
app.use("/v1/project", projectRoutes);
app.use("/v1/messages", messageRoutes);

// error handler middleware
app.use(errorHandler);

export default app;
