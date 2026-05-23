export interface CreateMessageBody {
  content: string;
  role: "agent" | "user";
}

export interface HandlePromptResponseBody {
  sandboxId: string;
  sandboxUrl: string;
  message: string | null;
  projectId: string;
}

export type SSEPayload = {
  type: "processing" | "complete" | "error" | "not-found";
  data?: any;
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
