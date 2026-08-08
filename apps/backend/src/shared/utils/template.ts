import path from "path";
import fs from "fs/promises";
import { getSandbox } from "./sandbox.js";

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

const IGNORE_FILES = new Set([
  ".DS_Store",
  ".bashrc",
  ".bash_logout",
  ".profile",
]);

// This is for using updating the sandbox
// TODO: Shift them to a saperate node process
export async function getFilesFromSandbox({
  sandboxId,
  rootDir = "/home/user",
  selectedFiles,
}: GetFilesOptions): Promise<FileData[]> {
  console.log("h0");
  const sandbox = await getSandbox(sandboxId);
  console.log("h1");
  // CASE 1:
  // Only fetch selected files
  if (selectedFiles?.length) {
    const files = await Promise.all(
      selectedFiles.map(async (filePath) => {
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

  async function traverse(currentPath: string) {
    const entries = await sandbox.files.list(currentPath);
    console.log("Entries size: ", entries.length);

    for (const entry of entries) {
      const fullPath = path.posix.join(currentPath, entry.name);

      // Ignore unwanted dirs
      if (entry.type === "dir") {
        if (IGNORE_DIRS.has(entry.name)) {
          continue;
        }

        await traverse(fullPath);
        continue;
      }

      // Ignore unwanted files
      if (IGNORE_FILES.has(entry.name)) {
        continue;
      }

      try {
        const content = await sandbox.files.read(fullPath);

        result.push({
          path: fullPath,
          content,
        });
      } catch (error) {
        console.error(`Failed to read file: ${fullPath}`);
      }
    }
  }

  console.log("--- starting to read all entries ---");
  await traverse(rootDir);
  console.log("--- All entries read ---");

  return result;
}

export async function generateTemplateSnapshot(files: FileData[]) {
  // const files = await getTemplateFiles("nextjs");

  const outputPath = path.join(
    process.cwd(),
    "template-snapshots",
    "nextjs.json",
  );

  //
  // Ensure directory exists
  //

  await fs.mkdir(path.dirname(outputPath), {
    recursive: true,
  });

  //
  // Write snapshot
  //

  await fs.writeFile(outputPath, JSON.stringify(files, null, 2), "utf8");

  console.log(`Template snapshot generated at: ${outputPath}`);
}
