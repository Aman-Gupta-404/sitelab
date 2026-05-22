import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error.js";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err;

  if (!(error instanceof AppError)) {
    error = new AppError("Internal Server Error", 500);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    code: error.code,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });
};
