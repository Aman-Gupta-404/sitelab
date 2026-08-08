import { exec } from "child_process";
import util from "util";
import path from "path";
import { Sandbox } from "@e2b/code-interpreter";

const execAsync = util.promisify(exec);

// types imports
import type {
  WriteFilesInput,
  ReadFileInput,
  RunCommandInput,
  UpdateFilesInput,
} from "@/types/common.js";
import { applyFindReplaceUpdates } from "@/shared/utils/tool-helpers.js";

export const toolHandlers = {
  // handler to write files
  async write_files(input: WriteFilesInput, sandbox: Sandbox) {
    const results: { path: string; status: string }[] = [];
    if (typeof input.files === "string") input.files = JSON.parse(input.files);

    if (!input.files || !input.files.length) {
      return JSON.stringify({
        success: false,
        error:
          "Did not recieve any files for updates, please send files for update",
      });
    }

    try {
      let updatedFile: any = {};

      // Write files in parallel
      await Promise.all(
        input.files.map(async (file) => {
          const res = await sandbox.files.write(file.path, file.content);

          updatedFile[file.path] = file.content;
        }),
      );

      return JSON.stringify({
        success: true,
        files: results,
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: error,
      });
    }
  },

  // handler to update files
  async update_files(input: UpdateFilesInput, sandbox: Sandbox) {
    const results: {
      path: string;
      success: boolean;
      error?: string;
    }[] = [];

    for (const file of input.files) {
      const { path, updates } = file;

      try {
        // 1. Read existing file
        const existingContent = await sandbox.files.read(path);

        if (typeof existingContent !== "string") {
          throw new Error("File content is not a string");
        }

        // 2. Basic validation
        for (const u of updates) {
          if (!u.find || u.find.trim().length < 3) {
            throw new Error(`Invalid find string in ${path}`);
          }
        }

        // 3. Apply updates
        const updatedContent = applyFindReplaceUpdates(
          existingContent,
          updates,
        );

        // 4. Write back to file
        await sandbox.files.write(path, updatedContent);

        results.push({
          path,
          success: true,
        });
        return JSON.stringify(results);
      } catch (err: any) {
        results.push({
          path,
          success: false,
          error: err.message || "Unknown error",
        });
      }
    }

    return JSON.stringify({
      success: results.every((r) => r.success),
      results,
    });
  },

  async read_file(input: ReadFileInput, sandbox: Sandbox) {
    try {
      const contents: any = {};
      for (const path of input.paths) {
        const content = await sandbox.files.read(path);

        contents[path] = content;
      }
      return JSON.stringify({
        success: true,
        data: contents,
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: error,
      });
    }
  },

  async run_command(input: RunCommandInput, sandbox: Sandbox) {
    if (typeof input === "string") JSON.parse(input);

    // 🔒 Restrict commands
    const allowedPrefixes = [
      "npm install",
      "npx shadcn add",
      "npm run",
      "pnpm install",
      "yarn add",
    ];

    const buffers = {
      stdout: "",
      stderr: "",
    };

    try {
      const isAllowed = allowedPrefixes.some((prefix) =>
        input.command.startsWith(prefix),
      );

      if (!isAllowed) {
        throw new Error(`Command not allowed: ${input.command}`);
      }

      // exec the command in the sandbox

      const result = await sandbox.commands.run(input.command, {
        onStdout: (data: string) => {
          buffers.stdout += data;
        },
        onStderr: (data: string) => {
          buffers.stderr += data;
        },
      });

      return result.stdout;
    } catch (error) {
      return `Command Failed: ${error} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`;
    }
  },
};
