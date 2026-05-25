import express, { Router } from "express";
import { UserController } from "../controller/user.controller.js";

const router: Router = Router();
const userController = new UserController();

router.get("/", userController.getUsers);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  userController.handleClerkWebhook,
);

export default router;
