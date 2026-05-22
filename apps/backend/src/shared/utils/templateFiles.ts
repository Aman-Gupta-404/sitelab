import path from "path";
import fs from "fs/promises";

type FileData = {
  path: string;
  content: string;
};

export async function getTemplateFiles(
  templateName = "nextjs",
): Promise<FileData[]> {
  const snapshotPath = path.join(
    process.cwd(),
    "template-snapshots",
    `${templateName}.json`,
  );

  const rawData = await fs.readFile(snapshotPath, "utf8");

  const files = JSON.parse(rawData) as FileData[];

  return files;
}
