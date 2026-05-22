import type { CreateMessageBody } from "../types/message.types.js";

export class MessageRepository {
  async createMessage({ message, role }: CreateMessageBody) {
    // Mock data (later replace with DB)
    return [
      { id: 1, name: "Aman" },
      { id: 2, name: "John" },
    ];
  }
}
