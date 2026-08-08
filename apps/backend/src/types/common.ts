export type WriteFilesInput = {
  files: { path: string; content: string }[];
};

export type UpdateFilesInput = {
  files: {
    path: string;
    updates: { find: string; replace: string; replaceAll?: boolean }[];
  }[];
};

export type ReadFileInput = {
  paths: string[];
};

export type RunCommandInput = {
  command: string;
};

export type FileData = {
  path: string;
  content: string;
};

export type StoreFilesOptions = {
  projectId: string;
  files: FileData[];
};

export type UpdateFilesOptions = {
  projectId: string;
  files: { [path: string]: string };
};

export type ExecutionLog = {
  initialPrompt: string;
  finalResponse: string;
  toolCalls: {
    tool: string;
    filesEffected: string[];
    success: boolean;
    summary: string;
  }[];
};

export type RawMemoryContext = {
  projectGoal: string;
  currentState: string;
  completedFeatures: string[];
  pendingFeatures: string[];
  architecture: string[];
  userPreferences: string[];
  knownIssues: string[];
  importantFiles: string[];
  lastTask: string;
};

export type MemoryContext = {
  goal: string;
  state: string;
  completed: string[];
  pending: string[];
  architecture: string[];
  preferences: string[];
  issues: string[];
  importantFiles: string[];
  lastTask: string;
};
