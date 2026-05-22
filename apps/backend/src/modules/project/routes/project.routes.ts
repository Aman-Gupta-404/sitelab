import { Router } from "express";
import { ProjectController } from "../controller/project.controller.js";
import { validate } from "@/shared/middleware/validate.js";
import { CreateMessageSchema } from "../dto/handlePrompt.dto.js";
import { GetProjectStatus } from "../dto/getProjectStatus.dto.js";

const router = Router();
const controller = new ProjectController();

router.post("/prompt", validate(CreateMessageSchema), controller.handlePrompt);

router.get("/status", controller.getProjectStatus);

router.get("/", controller.getProject);

router.get("/files", controller.getProjectFiles);

export default router;
