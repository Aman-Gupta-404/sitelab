import { apiClient } from "@/lib/apiClient";
import { SendMessageType } from "./messages.types";

const endpoint = "/api/v1/messages";

export const messagesApi = {
  //   getMessages: () => apiClient.get<Message[]>("/messages"),

  sendMessage: (data: SendMessageType) =>
    apiClient.post<SendMessageType>(endpoint, data),
};
