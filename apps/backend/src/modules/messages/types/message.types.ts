export interface CreateMessageBody {
  message: string;
  role: "agent" | "user";
}
