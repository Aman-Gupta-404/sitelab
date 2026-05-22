import { aiQueue } from "@/infra/queue/ai.queue.js";
import { MessageModel } from "../model/message.model.js";
import {
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

export class ProjectService {
  private projectRepository: ProjectRepository;
  constructor(private repo?: ProjectRepository) {
    this.projectRepository = repo ? repo : new ProjectRepository();
  }

  async handlePrompt(data: CreateMessageBody) {
    try {
      // create a message and project
      const result = await this.projectRepository.handlePrompt(data);
      console.log("handle prompt 1");
      // add to ai queeue
      if (result) {
        console.log("handle prompt 2");
        // update the redis status to be enqueuing
        const r1 = await updateRedisProjectStatus({
          slug: result.name,
          response: null,
          status: "enquing",
        });

        await aiQueue.add(`generate-code-${result._id.toString()}`, {
          prompt: data.content,
          projectSlug: result.name,
          projectId: result._id.toString(),
        });

        // update the redis status to be queued
        const r2 = await updateRedisProjectStatus({
          slug: result.name,
          response: null,
          status: "enqued",
        });
        console.log("r2: ", r2);
      }
      return result;
    } catch (error: any) {
      console.log(error);
      throw new InternalServerError(error.message);
    }
  }

  async getProject(slug: string) {
    try {
      // create a message and project
      const result = await this.projectRepository.getProject(slug);

      if (!result) {
        throw new NotFoundError("Project not found!");
      }

      return result;
    } catch (error: any) {
      console.log(error);
      throw new InternalServerError(error.message);
    }
  }

  async getProjectFiles(slug: string) {
    try {
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
      console.log({ message });
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
      console.log({ initialData });
      const projectStatus = await getRedisProjectStatus(projectId);
      console.log({ projectStatus });
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
      console.log({ projectStatus });

      if (projectStatus && projectStatus.status === "processed") {
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
          console.log({ parsed });

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
            send({ type: "complete", data: projectData });

            cleanup();
          }
        } catch (err) {
          console.log({ err });
          send({
            type: "error",
            data: "Failed to parse message",
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
}
