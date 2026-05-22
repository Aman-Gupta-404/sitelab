import { z } from "zod";

export const CreateMessageSchema = z.object({
  content: z.string().min(1, "content cannot be empty"),
});

export type CreateMessageDTO = z.infer<typeof CreateMessageSchema>;
