import { apiClient } from "@/lib/apiClient";
import { SendMessageType } from "./messages.types";

const endpoint = "/v1/messages";

export const messagesApi = {
  //   getMessages: () => apiClient.get<Message[]>("/messages"),

  sendMessage: (data: SendMessageType) =>
    apiClient.post<SendMessageType>(endpoint, data),
};
