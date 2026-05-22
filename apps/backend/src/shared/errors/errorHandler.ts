import type { Request, Response, NextFunction } from "express";
import { AppError } from "./app-error.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      success: false,
    });
  }

  // Handle Zod errors (important)
  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    message: err?.message ?? "Internal Server Error",
  });
};
