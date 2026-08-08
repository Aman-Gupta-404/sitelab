import {
  BadRequestError,
  CustomError,
  InternalServerError,
} from "@/shared/errors/http-error.js";
import { MessageModel } from "../model/message.model.js";
import type {
  ClientProjectResponse,
  CreateMessageBody,
  FileDocument,
  HandlePromptResponseBody,
  TreeNode,
  UserOwnsProjectProps,
} from "../types/project.types.js";
import mongoose from "mongoose";
import { generateSlug } from "random-word-slugs";
import { ProjectModel, type IProject } from "../model/project.model.js";
import { nanoid } from "nanoid";
import type {
  MemoryContext,
  StoreFilesOptions,
  UpdateFilesOptions,
} from "@/types/common.js";
import { generateHash } from "@/shared/utils/helper.js";
import { ProjectFileModel } from "../model/files.model.js";
import { getTemplateFiles } from "@/shared/utils/templateFiles.js";
import { ProjectMetaModel } from "../model/projectMeta.model.js";
import { parseRawSummaryResponse } from "@/shared/utils/projectUtils.js";
import { Sandbox } from "@e2b/code-interpreter";

export class ProjectRepository {
  // ========================== helper methods ==========================
  generateProjectName() {
    return `${generateSlug(2, {
      format: "kebab",
    })}-${nanoid(5)}`;
  }

  buildFileTree(files: FileDocument[]): TreeNode[] {
    const root: TreeNode[] = [];

    for (const file of files) {
      const parts = file.path.split("/").filter(Boolean);

      let currentLevel = root;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i] ?? "";

        const currentPath = "/" + parts.slice(0, i + 1).join("/");

        const isFile = i === parts.length - 1;

        let existingNode = currentLevel.find((node) => node.name === part);

        //
        // CREATE NODE IF NOT EXISTS
        //

        if (!existingNode) {
          existingNode = {
            name: part,
            path: currentPath,
            type: isFile ? "file" : "folder",

            children: isFile ? undefined : [],
          };

          currentLevel.push(existingNode);
        }

        //
        // MOVE DEEPER
        //

        if (existingNode.type === "folder") {
          currentLevel = existingNode.children!;
        }
      }
    }

    // return sortTree(root);
    return root;
  }

  // ========================== repository functions ==========================
  async handlePrompt(data: CreateMessageBody, userId: string) {
    const session = await mongoose.startSession();

    try {
      const result = await session.withTransaction(async () => {
        // add message to DB
        const message = new MessageModel({
          content: data.content,
          role: "user",
        });

        await message.save({ session });

        let project;
        let projectMemory: MemoryContext | {} = {};

        if (!data.projectSlug) {
          // add project to DB
          let retries = 5;
          while (retries > 0) {
            try {
              const projectName = this.generateProjectName();

              project = new ProjectModel({
                messages: [message._id],
                name: projectName,
                userId: userId,
              });

              await project.save({ session });

              // success
              break;
            } catch (error: any) {
              // duplicate key error
              if (error.code === 11000) {
                retries--;
                continue;
              }

              throw error;
            }
          }
        } else {
          // check the project limit
          project = await ProjectModel.findOneAndUpdate(
            {
              name: data.projectSlug,
              totalPrompts: { $lt: 3 },
            },
            {
              $push: {
                messages: message._id,
              },
            },
            {
              returnDocument: "after", // Return the updated document
            },
          );

          if (!project) {
            throw new CustomError(402, "Prompt Limit Exceeded");
          }

          const memory = await ProjectMetaModel.findOne({
            projectId: project?._id,
          });

          if (memory) projectMemory = memory;
        }

        if (!project) {
          throw new Error("Failed to generate unique project name");
        }

        const parsedProject = project.toJSON();

        // TODO: Shift this to R2 storage later on
        if (!data.projectSlug) {
          // add initial project files to DB
          const files = await getTemplateFiles();

          const insertObjs = files.map((file) => {
            const hash = generateHash(file.content);
            return {
              projectId: parsedProject._id,
              path: file.path,
              content: file.content,
              hash: hash,
              size: Buffer.byteLength(file.content, "utf8"),
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          });

          const filesUpdate = await ProjectFileModel.insertMany(insertObjs);
        }

        return {
          message: data.content,
          _id: parsedProject._id,
          name: parsedProject.name,
          userId: parsedProject.userId,
          projectMemory: projectMemory,
          sandboxId: parsedProject.sandboxId,
          projectUrl: parsedProject.projectUrl,
        };
      });
      return result;
    } catch (error: any) {
      throw new InternalServerError(
        error.message ?? "Error in creating project & message",
        error?.statusCode || 500,
      );
    } finally {
      session.endSession();
    }
  }

  async updateProjectSandboxId(projectId: string, sandboxId: string) {
    try {
      await ProjectModel.updateOne(
        {
          _id: projectId,
        },
        {
          $set: {
            sandboxId: sandboxId,
          },
        },
      );
    } catch (error: any) {
      throw new InternalServerError(
        error.message ?? "Error in updating project sandboxId",
      );
    }
  }

  async getProject(slug: string) {
    try {
      const project = await ProjectModel.aggregate([
        {
          $match: {
            name: slug,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  clerkId: 1,
                },
              },
            ],
            as: "user",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            userId: 1,
            projectUrl: 1,
            clerkId: "$user.clerkId",
          },
        },
      ]);

      if (!project.length) return null;

      return project[0];
    } catch (error: any) {
      throw new InternalServerError(
        error.message ?? "Error in creating project & message",
      );
    }
  }

  async getProjectFiles(slug: string) {
    try {
      const files = await ProjectModel.aggregate([
        {
          $match: {
            name: slug,
          },
        },
        {
          $lookup: {
            from: "projectfiles",
            localField: "_id",
            foreignField: "projectId",
            as: "files",
          },
        },
        {
          $unwind: {
            path: "$files",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            _id: 0,
            path: "$files.path",
            content: "$files.content",
            hash: "$files.hash",
          },
        },
      ]);

      // BUILD FILE MAP
      const fileMap: ClientProjectResponse["files"] = {};

      for (const file of files) {
        fileMap[file.path] = {
          content: file.content,
          hash: file.hash,
        };
      }

      // BUILD TREE
      const tree = this.buildFileTree(files);

      return {
        tree,
        files: fileMap,
      };
    } catch (error: any) {
      throw new InternalServerError(
        error.message ?? "Error in creating project & message",
      );
    }
  }

  async handlePromptResponse(data: HandlePromptResponseBody, sandbox: Sandbox) {
    const session = await mongoose.startSession();

    try {
      const result = await session.withTransaction(async () => {
        // adding message to DB
        const message = new MessageModel({
          content: data.message,
          role: "agent",
          executionLog: data.executionLog,
        });

        await message.save({ session });

        // updating project
        const projectResult = await ProjectModel.updateOne(
          { _id: data.projectId },
          {
            $push: { messages: message._id },
            $set: {
              projectUrl: data.sandboxUrl,
            },
            $inc: {
              totalPrompts: 1,
            },
          },
          { session },
        );

        if (projectResult.matchedCount === 0) {
          throw new Error("Project not found");
        }

        if (projectResult.modifiedCount === 0) {
          throw new Error("Project not updated");
        }

        // Update the project Meta memory
        await ProjectMetaModel.findOneAndUpdate(
          {
            // projectId: new mongoose.Types.ObjectId(data.projectId),
            projectId: data.projectId,
          },
          {
            $set: {
              ...parseRawSummaryResponse(data.memoryContext),
            },
            $setOnInsert: {
              projectId: data.projectId,
            },
          },
          {
            upsert: true, // Insert if not found
            returnDocument: "after", // Return the updated/inserted document
          },
        );

        // fetch the important files from sandbox and update the files as well
        const entries = await Promise.all(
          data.updatedFilesList.map(async (path) => {
            const content = await sandbox.files.read(path);
            return [`/${path}`, content] as const;
          }),
        );

        const contents = Object.fromEntries(entries);

        await this.updateProjectFiles({
          projectId: data.projectId,
          files: contents,
        });

        return {
          message: data.message,
        };
      });
      return result;
    } catch (error: any) {
      throw new InternalServerError(
        error.message ?? "Error in handling project response",
      );
    } finally {
      session.endSession();
    }
  }

  async addAgentErrorMsg(data: { message: string; projectId: string }) {
    const session = await mongoose.startSession();

    try {
      const result = await session.withTransaction(async () => {
        const message = new MessageModel({
          content: data.message,
          role: "agent",
          error: true,
        });
        await message.save({ session });

        // updating project
        const projectResult = await ProjectModel.updateOne(
          { _id: data.projectId },
          {
            $push: { messages: message._id },
            $set: {
              updatedAt: Date.now(),
            },
          },
          { session },
        );

        if (projectResult.matchedCount === 0) {
          throw new Error("Project not found");
        }

        if (projectResult.modifiedCount === 0) {
          throw new Error("Project not updated");
        }
      });
    } catch (error: any) {
      throw new InternalServerError(
        error.message ?? "Error updating agent response",
      );
    }
  }

  async updateProjectFiles({ projectId, files }: UpdateFilesOptions) {
    try {
      const projectObjectId = new mongoose.Types.ObjectId(projectId);
      const operations = Object.entries(files).map(([filePath, content]) => ({
        updateOne: {
          filter: {
            projectId: projectObjectId,
            path: filePath,
          },
          update: {
            $set: {
              content: content,
              hash: generateHash(content),
              size: Buffer.byteLength(content, "utf8"),
              updatedAt: new Date(),
            },
            $setOnInsert: {
              projectId: projectObjectId,
              path: filePath,
              createdAt: new Date(),
            },
          },
          upsert: true,
        },
      }));
      if (!operations.length) {
        return {
          success: true,
          updatedFiles: 0,
        };
      }

      await ProjectFileModel.bulkWrite(operations, {
        ordered: false, // faster, allows parallel execution
      });
    } catch (error: any) {
      throw new InternalServerError(
        error.message ?? "Error in Uploading the files",
      );
    }
  }

  async uploadProjectFiles({ projectId, files }: StoreFilesOptions) {
    try {
      const bulkOperations = [];
      const projectObjectId = new mongoose.Types.ObjectId(projectId);

      for (const file of files) {
        const hash = generateHash(file.content);

        //
        // OPTIONAL OPTIMIZATION:
        // Skip DB write if hash is unchanged
        //

        // TODO: Very unoptimized, update this laterOn
        // Removed this because this function is only used at the start, when there are no existing files
        // const existingFile = await ProjectFileModel.findOne({
        //   projectId: projectObjectId,
        //   path: file.path,
        // }).select("hash");

        // if (existingFile?.hash === hash) {
        //   continue;
        // }

        bulkOperations.push({
          updateOne: {
            filter: {
              projectId: projectObjectId,
              path: file.path,
            },

            update: {
              $set: {
                content: file.content,
                hash,
                size: Buffer.byteLength(file.content, "utf8"),
              },

              $setOnInsert: {
                projectId: projectObjectId,
                path: file.path,
              },
            },

            upsert: true,
          },
        });
      }

      if (!bulkOperations.length) {
        return {
          success: true,
          updatedFiles: 0,
        };
      }

      await ProjectFileModel.bulkWrite(bulkOperations);

      return {
        success: true,
        updatedFiles: bulkOperations.length,
      };
    } catch (error: any) {
      throw new InternalServerError(
        error.message ?? "Error in Uploading the files",
      );
    }
  }

  async getProjectMessages(slug: string) {
    try {
      const messages = await ProjectModel.aggregate([
        {
          $match: {
            name: slug,
          },
        },
        {
          $lookup: {
            from: "messages",
            localField: "messages",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  content: 1,
                  role: 1,
                  createdAt: 1,
                  error: { $ifNull: ["$error", false] },
                },
              },
              {
                $sort: { createdAt: 1 },
              },
            ],
            as: "messages",
          },
        },
        {
          $project: {
            updatedAt: 0,
            __v: 0,
          },
        },
      ]);

      return messages[0];
      return null;
    } catch (error: any) {
      throw new InternalServerError(
        error.message ?? "Error in fetching project messages",
      );
    }
  }
}
