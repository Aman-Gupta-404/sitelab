import { UserRepository } from "../repository/user.repository.js";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUsers() {
    return this.userRepository.getAllUsers();
  }
}
