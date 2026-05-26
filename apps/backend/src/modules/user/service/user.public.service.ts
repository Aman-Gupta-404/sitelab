import { UserService } from "./user.service.js";

const userService = new UserService();

export const userApi = {
  getUserByClerkId: userService.getUserByClerkId.bind(userService),
};
