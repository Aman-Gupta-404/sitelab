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

// routes imports
import userRoutes from "./modules/user/routes/user.routes.js";
import projectRoutes from "./modules/project/routes/project.routes.js";
import messageRoutes from "./modules/messages/routes/message.routes.js";
// import sandboxRoutes from "./modules/sandbox/routes/sandbox.routes.js";

// routes
app.use("/v1/users", userRoutes);
app.use("/v1/project", projectRoutes);
// app.use("/v1/sandbox", sandboxRoutes);
app.use("/v1/messages", messageRoutes);

// error handler middleware
app.use(errorHandler);

export default app;
