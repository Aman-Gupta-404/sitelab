import { z } from "zod";

export const GetProjectStatus = z.object({
  projectId: z.string().min(1, "Project Id cannot be empty"),
});

export type ProjectStatusDTO = z.infer<typeof GetProjectStatus>;
