import { Subject } from "@/types/subject";

export interface ISubjectRepository {
  getSubject(id: string): Promise<Subject | null>;
  listSubjects(): Promise<Subject[]>;
  saveSubject(subject: Subject): Promise<void>;
  deleteSubject(id: string): Promise<void>;
}
