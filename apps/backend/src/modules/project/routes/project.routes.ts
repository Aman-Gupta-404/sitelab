import { Router } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { validate } from "@/shared/middleware/validate.js";
import { CreateMessageSchema } from "../dto/handlePrompt.dto.js";
import { ProjectController } from "../controller/project.controller.js";

const router: Router = Router();

const controller = new ProjectController();

router.post(
  "/prompt",
  requireAuth(),
  validate(CreateMessageSchema),
  controller.handlePrompt,
);

router.get("/status", requireAuth(), controller.getProjectStatus);

router.get("/", requireAuth(), controller.getProject);

router.get("/files", requireAuth(), controller.getProjectFiles);

export default router;
