import { UserProfile, UserRole } from "@/lib/auth/rbac";

export interface IUserRepository {
  getUser(id: string): Promise<UserProfile | null>;
  listUsers(role?: UserRole): Promise<UserProfile[]>;
  saveUser(user: UserProfile): Promise<void>;
  deleteUser(id: string): Promise<void>;
  countUsers(role?: UserRole): Promise<number>;
}
