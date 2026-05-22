import { aiQueue } from "@/infra/queue/ai.queue.js";
// import type { MessageRepository } from "../repository/message.repository.js";
import { MessageRepository } from "../repository/message.repository.js";

export class MessagesService {
  private messageRepository: MessageRepository;
  constructor(private repo?: MessageRepository) {
    this.messageRepository = repo ? repo : new MessageRepository();
  }

  async createMessage(data: { content: string }) {
    // 1. Save message

    return "message";
  }

  async postMessage({ message }: { message: string }) {
    // add the data to the queue system
    // await aiQueue.add("generate-code", {
    //   prompt: "make a todo app",
    // });
    console.log("Reached here");
    return true;
  }
}
