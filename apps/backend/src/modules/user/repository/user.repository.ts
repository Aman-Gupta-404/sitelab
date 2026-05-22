export class UserRepository {
  async getAllUsers() {
    // Mock data (later replace with DB)
    return [
      { id: 1, name: "Aman" },
      { id: 2, name: "John" },
    ];
  }
}
