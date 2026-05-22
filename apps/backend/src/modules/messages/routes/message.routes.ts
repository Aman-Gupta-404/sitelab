import { Router } from "express";
import { MessageController } from "../controller/messages.controller.js";

const router = Router();
const messageController = new MessageController();

router.get("/", messageController.postMessage);

router.post("/", messageController.postMessage);

export default router;
