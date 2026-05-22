export interface CreateMessageBody {
  message: string;
  role: "assistant" | "user";
}
