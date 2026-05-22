// src/modules/messages/message.container.ts

import { MessageRepository } from "./repository/message.repository.js";
import { MessagesService } from "./service/messages.service.js";

export class MessageContainer {
  static getService() {
    const repo = new MessageRepository();
    return new MessagesService(repo);
  }
}
