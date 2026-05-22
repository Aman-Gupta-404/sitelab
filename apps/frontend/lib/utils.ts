import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLanguagefromExtention(filename: string) {
  const extention = filename.split(".")?.pop()?.toLowerCase();
  return extention || "text";
}

/**
 * Convert a record of files into tree structure
 * @param files - Record of file path to content
 * @returns Tree structure for TreeView component
 *
 * @example
 * Input: {"src/Button.txt": "...", "README.md": "..."}
 * Output: [["src", "Button.txt"], "README.md"]
 */
export function convertFilesToTreeItem(files: { [path: string]: string }) {}
