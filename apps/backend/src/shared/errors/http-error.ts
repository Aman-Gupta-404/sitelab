import { AppError } from "./app-error.js";

export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400, "BAD_REQUEST");
  }
}
export class CustomError extends AppError {
  constructor(code: number, message: string) {
    super(message, code, "Error");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409, "CONFLICT");
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Conflict") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Conflict") {
    super(message, 403, "FORBIDDEN");
  }
}

export class InternalServerError extends AppError {
  constructor(message = "INTERNAL_SERVER_ERROR", code = 500) {
    super(message, code, "INTERNAL_SERVER_ERROR");
  }
}
