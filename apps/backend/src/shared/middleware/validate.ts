import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

import { BadRequestError } from "@/shared/errors/http-error.js";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const error = result.error.issues.map((e) => e.message).join(", ");
      return next(new BadRequestError(error));
    }

    req.body = result.data;
    next();
  };
