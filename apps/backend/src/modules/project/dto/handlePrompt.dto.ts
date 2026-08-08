import { z } from "zod";

export const CreateMessageSchema = z.object({
  content: z.string().min(1, "content cannot be empty"),
  projectSlug: z.string().optional(),
});

export type CreateMessageDTO = z.infer<typeof CreateMessageSchema>;
