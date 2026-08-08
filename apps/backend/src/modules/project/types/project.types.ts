import type {
  ExecutionLog,
  MemoryContext,
  RawMemoryContext,
} from "@/types/common.js";

export interface CreateMessageBody {
  content: string;
  role: "agent" | "user";
  projectSlug?: string;
}

export interface HandlePromptResponseBody {
  sandboxId: string;
  sandboxUrl: string;
  message: string | null;
  projectId: string;
  executionLog: ExecutionLog;
  updatedFilesList: string[];
  memoryContext: RawMemoryContext;
}

export type SSEPayload = {
  type: "processing" | "complete" | "error" | "not-found";
  data?: any;
  error?: any;
};

export type FileDocument = {
  path: string;
  content: string;
  hash: string;
};

export type TreeNode = {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: TreeNode[] | undefined;
};

export type ClientProjectResponse = {
  tree: TreeNode[];
  files: Record<
    string,
    {
      content: string;
      hash: string;
    }
  >;
};

export type UserOwnsProjectProps = {
  clerkId: string;
  slug: string | null;
  project: string | null;
};

export interface IToolCall {
  tool: string;
  filesEffected: string[];
  success: boolean;
  summary: string;
}

export interface IExecutionLog {
  initialPrompt: string;
  finalResponse: string;
  iterations: number;
  toolCalls: IToolCall[];
}
