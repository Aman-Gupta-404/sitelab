import { InternalServerError } from "@/shared/errors/http-error.js";
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
          new: true,
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

  async updateUserLastLogin(clerkId: string) {
    try {
      const response = await User.findOneAndUpdate(
        {
          clerkId: clerkId,
        },
        {
          $set: { lastLoginAt: new Date() },
        },
      );

      return response;
    } catch (error: any) {
      throw new InternalServerError(error.message ?? "Error in updating User");
    }
  }
}
