import { aiQueue } from "@/infra/queue/ai.queue.js";
import { MessageModel } from "../model/message.model.js";
import { Sandbox } from "@e2b/code-interpreter";
import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "@/shared/errors/http-error.js";
import { ProjectRepository } from "../repository/project.repository.js";

import {
  getRedisProjectStatus,
  updateRedisProjectStatus,
} from "@/infra/redis/services/project.services.js";
import redisClient from "@/infra/redis/redis.client.js";

import type { Request, Response } from "express";
import type { CreateMessageBody, SSEPayload } from "../types/project.types.js";
import logger from "@/shared/utils/logger.js";
import { userApi } from "@/modules/user/service/user.public.service.js";
export class ProjectService {
  private projectRepository: ProjectRepository;
  constructor(private repo?: ProjectRepository) {
    this.projectRepository = repo ? repo : new ProjectRepository();
  }

  async handlePrompt(data: CreateMessageBody, clerkId: string) {
    try {
      // get the userId from clerkId
      const user = await userApi.getUserByClerkId(clerkId);

      let result;

      // create a message and project
      result = await this.projectRepository.handlePrompt(
        data,
        user._id.toString(),
      );

      // add to AI queeue
      if (result) {
        // update the redis status to be enqueuing
        const r1 = await updateRedisProjectStatus({
          slug: result.name,
          response: null,
          status: "enquing",
        });

        await aiQueue.add(
          `generate-code-${result._id.toString()}`,
          {
            prompt: data.content,
            projectSlug: result.name,
            sandboxId: result.sandboxId,
            projectId: result._id.toString(),
            memory: result.projectMemory,
          },
          // adding this dealy, as sse connection is set before queue starts,
          // and error updates done go properly
          {
            delay: 2000, // 2 seconds in milliseconds
          },
        );

        // update the redis status to be queued
        await updateRedisProjectStatus({
          slug: result.name,
          response: null,
          status: "enqued",
        });
      }
      return result;
    } catch (error: any) {
      throw new InternalServerError(error.message, error?.statusCode || 500);
    }
  }

  async getProject(slug: string, clerkId: string) {
    try {
      // create a message and project
      const result = await this.projectRepository.getProject(slug);

      if (!result) {
        throw new NotFoundError("Project not found!");
      }

      if (result.clerkId.toString() !== clerkId) {
        throw new ForbiddenError("Not authorized to access this project");
      }

      return result;
    } catch (error: any) {
      console.log(error);
      throw new InternalServerError(error.message);
    }
  }

  async getProjectFiles(slug: string, userClerkId: string) {
    try {
      const proj = await this.projectRepository.getProject(slug);

      if (proj.clerkId.toString() !== userClerkId) {
        // if (proj.clerkId !== userClerkId) {
        throw new ForbiddenError("Not authorized to access this project");
      }

      // create a message and project
      const result = await this.projectRepository.getProjectFiles(slug);

      if (!result) {
        throw new NotFoundError("Project files not found!");
      }

      return result;
    } catch (error: any) {
      console.log(error);
      throw new InternalServerError(error.message);
    }
  }

  async createMessage(data: CreateMessageBody) {
    // 1. Save message
    try {
      const message = await MessageModel.create({
        // projectId: data.projectId,
        content: data.content,
        role: data.role,
      });

      return message;
    } catch (error) {}
  }

  async postMessage({ message }: { message: string }) {
    // add the data to the queue system
    // await aiQueue.add("generate-code", {
    //   prompt: "make a todo app",
    // });
    return true;
  }

  async handleListenProjectStatus({
    projectId,
    req,
    res,
  }: {
    projectId: string;
    req: Request;
    res: Response;
  }) {
    logger.info("Got the sse request");
    const channel = `projectId:${projectId}`;

    const send = (payload: SSEPayload) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };

    const sub = redisClient.createSubscriber();
    try {
      // send an initial data with initial messages
      const initialData =
        await this.projectRepository.getProjectMessages(projectId);

      send({ type: "processing", data: initialData });

      const projectStatus = await getRedisProjectStatus(projectId);

      if (!projectStatus) {
        // if project status not found in redis, it was never created
        const projectData =
          await this.projectRepository.getProjectMessages(projectId);
        // send({ type: "complete", data: projectData });

        send({
          type: "not-found",
          data: projectData,
        });
        res.write("retry: 0\n\n");
        return res.end();
      }

      if (
        (projectStatus && projectStatus.status === "processed") ||
        projectStatus.status === "error"
      ) {
        const projectData =
          await this.projectRepository.getProjectMessages(projectId);

        send({ type: "complete", data: projectData });

        // send({
        //   type: "complete",
        //   data: JSON.parse(projectStatus),
        // });
        res.write("retry: 0\n\n");
        return res.end();
      }

      await sub.subscribe(channel);

      // listening to the message
      sub.on("message", async (_channel, message) => {
        try {
          const parsed: SSEPayload = JSON.parse(message);

          // Validate structure
          if (!parsed.type) {
            throw new Error("Invalid message format");
          }

          // send(parsed);

          // Close connection on completion
          if (parsed.type === "complete" || parsed.type === "error") {
            // get project status
            const projectData =
              await this.projectRepository.getProjectMessages(projectId);
            send({
              type: parsed.type,
              data: projectData,
              error: parsed.error || null,
            });

            cleanup();
          }
        } catch (err) {
          console.log({ err });
          send({
            type: "error",
            data: "Failed to parse message",
            error: "Something went wrong, please try again",
          });
        }
      });

      // Keep-alive ping
      const interval = setInterval(() => {
        res.write(":\n\n");
      }, 15000);

      // cleanup method
      const cleanup = async () => {
        interval && clearInterval(interval);
        await redisClient.closeSubscriber(sub);
        res.end();
      };

      // Client disconnect
      req.on("close", cleanup);
    } catch (error: any) {
      logger.error(error);
      res.write(
        `data: ${JSON.stringify({
          type: "error",
          data: "Subscription failed",
        })}\n\n`,
      );
      await redisClient.closeSubscriber(sub);
      res.end();
      throw new InternalServerError(error.message);
    }
  }

  async getProjectSandbox({
    sandboxId,
    projectId,
  }: {
    projectId: string;
    sandboxId?: string;
  }) {
    try {
      // ---- Step: 1 ----
      // if sandboxId is provided
      // -> check if sandbox is running, if yes, then return the id
      // ->       else, create a new sandboxId, start the sandbox, and return the new ID
      // else create a new sandboxId & start the sandbox, and return the new ID
      if (sandboxId) {
        // TODO: Put this entire thing inside a saperate trycatch
        try {
          const sandbox = await Sandbox.connect(sandboxId);
          const alive = await sandbox.isRunning();

          if (alive) {
            // return the valid data
            return { sandbox, sandboxId };
          }
        } catch (error: any) {
          // TODO: remove the throw error to create fresh sandbox
          throw new Error(error);
          // will continue the sandbox creation
        }
      }

      // ---- Create a new sandbox ----
      const sandbox = await Sandbox.create("ag9139563/sitelab-next-test-2", {
        timeoutMs: 20 * 60 * 1000, // 20 minutes
      }); // TODO: Shift the template name to env

      const newSandboxId = sandbox.sandboxId;

      // update the sandboxId to projects DB
      await this.projectRepository.updateProjectSandboxId(
        projectId,
        newSandboxId,
      );

      // TODO: load the updated files to this sandbox

      return {
        sandbox,
        sandboxId: newSandboxId,
      };
    } catch (error: any) {
      console.log({ error: error?.data, msg: error?.message });
      throw new InternalServerError(error.message);
    }
  }
}
