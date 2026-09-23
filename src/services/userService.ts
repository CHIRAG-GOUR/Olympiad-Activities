import { userRepository } from "@/repositories";
import { UserProfile, UserRole } from "@/lib/auth/rbac";

export class UserService {
  async getUser(id: string): Promise<UserProfile | null> {
    return userRepository.getUser(id);
  }

  async listUsers(role?: UserRole): Promise<UserProfile[]> {
    return userRepository.listUsers(role);
  }

  async listStudents(): Promise<UserProfile[]> {
    return userRepository.listUsers("STUDENT");
  }

  async listTeachers(): Promise<UserProfile[]> {
    return userRepository.listUsers("TEACHER");
  }

  async saveUser(user: UserProfile): Promise<void> {
    return userRepository.saveUser(user);
  }

  async deleteUser(id: string): Promise<void> {
    return userRepository.deleteUser(id);
  }

  async countUsers(role?: UserRole): Promise<number> {
    return userRepository.countUsers(role);
  }
}

export const userService = new UserService();
export const studentService = userService;
