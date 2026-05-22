import type { Request, Response } from "express";
import { SandboxService } from "../service/sandbox.service.js";
import { LlmClient } from "@/infra/ai/index.js";
import { aiQueue } from "@/infra/queue/ai.queue.js";

export class SandboxController {
  private sandboxService: SandboxService;

  constructor() {
    this.sandboxService = new SandboxService();
  }

  runCommand = async (req: Request, res: Response) => {
    // aiClient.promptLLM("make a simple todo application");
    this.sandboxService.runCommand({ message: "Dummy message" });

    res.json({ status: 200, result: "Check logs 2!" });
  };
}
