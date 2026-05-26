import {
  AuthorizationError,
  BadRequestError,
} from "@/shared/errors/http-error.js";
import { getAuth } from "@clerk/express";
import { sendSuccess } from "@/shared/utils/response.js";
import { ProjectService } from "../service/project.service.js";
import type { NextFunction, Request, Response } from "express";

export class ProjectController {
  private service: ProjectService;
  // private redisClient: RedisClient
  constructor() {
    this.service = new ProjectService();
    // this.redisClient = redisClient
  }

  handlePrompt = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    try {
      // get the userId from clerk handler
      const auth = getAuth(req);

      if (!auth || !auth.userId) {
        throw new AuthorizationError();
      }

      const userClerkId = auth.userId;

      const message = await this.service.handlePrompt(data, userClerkId);

      return sendSuccess(res, message, 201);
    } catch (error: any) {
      next(error);
    }
  };

  getProjectStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const auth = getAuth(req);

    if (!auth || !auth.userId) {
      throw new AuthorizationError();
    }

    const projectId = req.query.projectId as string;
    try {
      // SSE headers
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Access-Control-Allow-Credentials", "true");

      res.flushHeaders();

      await this.service.handleListenProjectStatus({ projectId, req, res });

      return;
    } catch (error: any) {
      next(error);
    }
  };

  getProject = async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.query.slug as string;
    try {
      const auth = getAuth(req);

      if (!auth || !auth.userId) {
        throw new AuthorizationError();
      }

      const userClerkId = auth.userId;

      if (!slug) throw new BadRequestError("Project title required");
      // create a message with user role
      const project = await this.service.getProject(slug, userClerkId);

      // make axios api call

      return sendSuccess(res, project, 200);
    } catch (error: any) {
      next(error);
    }
  };

  getProjectFiles = async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.query.slug as string;
    try {
      if (!slug) throw new BadRequestError("Project title required");
      const auth = getAuth(req);

      if (!auth || !auth.userId) {
        throw new AuthorizationError();
      }

      // create a message with user role
      const project = await this.service.getProjectFiles(slug, auth.userId);

      // make axios api call

      return sendSuccess(res, project, 200);
    } catch (error: any) {
      next(error);
    }
  };
}
