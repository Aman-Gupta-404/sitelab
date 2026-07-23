import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { userApi } from "../modules/user/service/user.public.service.js";
import { AuthorizationError } from "@/shared/errors/http-error.js";

export async function requireAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const auth = getAuth(req);
  const { userId } = auth;
  console.log({ auth });
  if (!userId) {
    throw new AuthorizationError();
  }

  // make API call to fetch user details
  const user = await userApi.getUserByClerkId(userId);

  req.user = {
    _id: user._id.toString(),
    clerkId: userId,
  };

  next();
}
