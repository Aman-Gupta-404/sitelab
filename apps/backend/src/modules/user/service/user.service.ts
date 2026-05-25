import { Webhook } from "svix";
import type { Request, Response } from "express";

import { User } from "../model/users.model.js";
import { UserRepository } from "../repository/user.repository.js";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUsers() {
    return this.userRepository.getAllUsers();
  }

  async handleClerkWebhook(req: Request, res: Response) {
    try {
      // get the svixId from the request to veryify the webhook request
      const svixId = req.headers["svix-id"] as string;
      const svixTimestamp = req.headers["svix-timestamp"] as string;

      const svixSignature = req.headers["svix-signature"] as string;

      if (!svixId || !svixTimestamp || !svixSignature) {
        return res.status(400).json({
          message: "Missing svix headers",
        });
      }

      const payload = req.body.toString();

      const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

      const evt = wh.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as any;

      const eventType = evt.type;

      // TODO: Update if cases to switch statements
      // USER CREATED
      if (eventType === "user.created") {
        const {
          id: clerkId,
          email_addresses,
          first_name,
          last_name,
          image_url,
        } = evt.data;

        await this.userRepository.createUser({
          clerkId,
          email: email_addresses?.[0]?.email_address,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        });
      }

      // USER UPDATED
      if (eventType === "user.updated") {
        const {
          id: clerkId,
          email_addresses,
          first_name,
          last_name,
          image_url,
        } = evt.data;

        await this.userRepository.updateUser({
          clerkId,
          email: email_addresses?.[0]?.email_address,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        });
      }

      // USER login
      if (eventType === "session.created") {
        const { user_id } = evt.data;
        await this.userRepository.updateUserLastLogin(user_id);
      }

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Webhook error",
      });
    }
  }
}
