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
