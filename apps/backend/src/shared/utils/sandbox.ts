import { Sandbox } from "@e2b/code-interpreter";

type GetFilesOptions = {
  sandboxId: string;
  rootDir?: string;
  selectedFiles?: string[];
};

type FileData = {
  path: string;
  content: string;
};

const IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "coverage",
]);

const IGNORE_FILES = new Set([".DS_Store"]);

export async function getSandboxFiles({
  sandboxId,
  rootDir = "/home/user",
  selectedFiles,
}: GetFilesOptions): Promise<FileData[]> {
  const sandbox = await getSandbox(sandboxId);

  if (selectedFiles?.length) {
    const files = await Promise.all(
      selectedFiles.map(async (path) => {
        const filePath = rootDir + path;
        try {
          const content = await sandbox.files.read(filePath);

          return {
            path: filePath,
            content,
          };
        } catch (error) {
          console.error(`Failed to read file: ${filePath}`);

          return null;
        }
      }),
    );

    return files.filter(Boolean) as FileData[];
  }
  console.log("h3");
  // CASE 2:
  // Fetch all files recursively
  const result: FileData[] = [];

  return result;
}

export async function getSandbox(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
}
