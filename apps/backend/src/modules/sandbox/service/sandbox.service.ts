import { aiQueue } from "@/infra/queue/ai.queue.js";

export class SandboxService {
  // private userRepository: UserRepository;

  constructor() {
    // this.userRepository = new UserRepository();
  }

  async runCommand({ message }: { message: string }) {
    // add the data to the queue system
    await aiQueue.add("generate-code", {
      prompt: "make a todo app",
    });
  }
}
