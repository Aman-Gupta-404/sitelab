import { apiClient } from "@/lib/apiClient";
import {
  ProjectFilesResponse,
  ProjectResponseType,
  SendPromptResponseType,
  SendPromptType,
} from "./projects.types";

const endpoint = "/api/v1/project";

export const projectsApi = {
  sendPrompt: (data: SendPromptType) =>
    apiClient.post<SendPromptResponseType>(`${endpoint}/prompt`, data),

  getProject: (slug: string) =>
    apiClient.get<ProjectResponseType>(`${endpoint}?slug=${slug}`),

  getProjectFiles: (slug: string) =>
    apiClient.get<ProjectFilesResponse>(`${endpoint}/files?slug=${slug}`),
};
