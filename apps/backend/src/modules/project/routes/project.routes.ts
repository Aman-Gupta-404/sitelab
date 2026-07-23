import { Router } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { validate } from "@/shared/middleware/validate.js";
import { CreateMessageSchema } from "../dto/handlePrompt.dto.js";
import { ProjectController } from "../controller/project.controller.js";
import { requireAuthMiddleware } from "@/middleware/auth-middleware.js";

const router: Router = Router();

const controller = new ProjectController();

router.post(
  "/prompt",
  requireAuthMiddleware,
  validate(CreateMessageSchema),
  controller.handlePrompt,
);

router.get("/status", requireAuthMiddleware, controller.getProjectStatus);

router.get("/", requireAuthMiddleware, controller.getProject);

router.get("/files", requireAuthMiddleware, controller.getProjectFiles);

export default router;
