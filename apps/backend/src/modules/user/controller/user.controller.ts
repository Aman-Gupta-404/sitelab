import type { Request, Response } from "express";
import { UserService } from "../service/user.service.js";
import { LlmClient } from "@/infra/ai/index.js";
import { aiQueue } from "@/infra/queue/ai.queue.js";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getUsers = async (req: Request, res: Response) => {
    const users = await this.userService.getUsers();
    const aiClient = new LlmClient();
    // aiClient.promptLLM("make a simple todo application");
    // await aiQueue.add("generate-code", {
    //   prompt: "make a todo app",
    // });
    res.json(users);
  };

  handleClerkWebhook = async (req: Request, res: Response) => {
    return await this.userService.handleClerkWebhook(req, res);
  };
}
