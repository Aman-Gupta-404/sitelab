import {
  InternalServerError,
  NotFoundError,
} from "@/shared/errors/http-error.js";
import { User } from "../model/users.model.js";
import type { CreateUser } from "../types/user.types.js";

export class UserRepository {
  async getAllUsers() {
    // Mock data (later replace with DB)
    return [
      { id: 1, name: "Aman" },
      { id: 2, name: "John" },
    ];
  }

  async getUserByClerkId(clerkId: string) {
    try {
      const user = await User.findOne({
        clerkId: clerkId,
      });

      if (!user) throw new NotFoundError("User not found");

      return user;
    } catch (error: any) {
      throw new InternalServerError(error.message ?? "Error in updating User");
    }
  }

  async createUser(user: CreateUser) {
    try {
      const { clerkId, email, firstName, lastName, imageUrl } = user;

      const response = await User.findOneAndUpdate(
        {
          clerkId,
        },
        {
          email,
          lastName,
          imageUrl,
          firstName,
          lastLoginAt: new Date(),
        },
        {
          upsert: true,
          returnDocument: "after",
        },
      );

      return response;
    } catch (error: any) {
      throw new InternalServerError(error.message ?? "Error in creating User");
    }
  }

  async updateUser(user: CreateUser) {
    try {
      const { clerkId, email, firstName, lastName, imageUrl } = user;

      const response = await User.findOneAndUpdate(
        {
          clerkId,
        },
        {
          $set: { lastName, imageUrl, firstName },
        },
      );

      return response;
    } catch (error: any) {
      throw new InternalServerError(error.message ?? "Error in creating User");
    }
  }

  async updateUserLastLogin({
    email,
    clerkId,
    lastName,
    imageUrl,
    firstName,
  }: CreateUser) {
    try {
      const user = await User.findOneAndUpdate(
        { clerkId },
        {
          $set: {
            lastLoginAt: new Date(),
          },
          $setOnInsert: {
            email,
            clerkId,
            firstName,
            lastName,
            imageUrl,
          },
        },
        {
          upsert: true, // Insert if not found
          returnDocument: "after", // Return the updated/inserted document
        },
      );

      return true;
    } catch (error: any) {
      throw new InternalServerError(error.message ?? "Error in updating User");
    }
  }
}
