import { IUserRepository } from "../interfaces/IUserRepository";
import { UserProfile, UserRole } from "@/lib/auth/rbac";

// Key bumped so the renamed administrator record replaces any previously cached copy.
const LOCAL_STORAGE_KEY = "olympiad_users_repo_v2";

const INITIAL_USERS: UserProfile[] = [
  {
    id: "usr_admin_01",
    name: "Chirag Gour",
    email: "pa1@skillizee.io",
    role: "SUPER_ADMIN",
    schoolName: "National Olympiad Council",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "usr_teacher_01",
    name: "Prof. Ananya Sen",
    email: "ananya.sen@olympiad.org",
    role: "TEACHER",
    schoolName: "Delhi Public School, R.K. Puram",
    createdAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "usr_student_01",
    name: "Rahul Sharma",
    email: "rahul.s@student.olympiad.org",
    role: "STUDENT",
    schoolName: "Kendriya Vidyalaya No. 1",
    grade: 6,
    createdAt: "2024-03-10T00:00:00Z",
  },
  {
    id: "usr_student_02",
    name: "Ananya Gupta",
    email: "ananya.g@student.olympiad.org",
    role: "STUDENT",
    schoolName: "The Heritage School",
    grade: 6,
    createdAt: "2024-03-11T00:00:00Z",
  },
];

export class LocalUserRepository implements IUserRepository {
  // Every read used to re-parse the full localStorage blob from scratch, even though
  // this repository is a singleton queried from most admin pages on every mount. Cache
  // it in memory the same way LocalExamRepository/LocalQuestionRepository already do.
  private inMemory: UserProfile[] | null = null;

  private async load(): Promise<UserProfile[]> {
    if (this.inMemory) return this.inMemory;

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) {
          this.inMemory = JSON.parse(raw);
          return this.inMemory!;
        }
      } catch {
        // ignore
      }
    }

    this.inMemory = [...INITIAL_USERS];
    this.persist(this.inMemory);
    return this.inMemory;
  }

  private persist(users: UserProfile[]) {
    this.inMemory = users;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
      } catch {
        // ignore
      }
    }
  }

  async getUser(id: string): Promise<UserProfile | null> {
    const users = await this.load();
    return users.find((u) => u.id === id) || null;
  }

  async listUsers(role?: UserRole): Promise<UserProfile[]> {
    const users = await this.load();
    if (role) {
      return users.filter((u) => u.role === role);
    }
    return users;
  }

  async saveUser(user: UserProfile): Promise<void> {
    const users = await this.load();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    this.persist(users);
  }

  async deleteUser(id: string): Promise<void> {
    const users = await this.load();
    const filtered = users.filter((u) => u.id !== id);
    this.persist(filtered);
  }

  async countUsers(role?: UserRole): Promise<number> {
    const users = await this.load();
    if (role) {
      return users.filter((u) => u.role === role).length;
    }
    return users.length;
  }
}
