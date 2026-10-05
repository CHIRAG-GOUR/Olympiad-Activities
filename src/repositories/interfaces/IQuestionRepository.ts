import { Question, QuestionDifficulty } from "@/types/question";

export interface QuestionFilters {
  subjectId?: string;
  grade?: number | string;
  chapter?: string;
  topic?: string;
  difficulty?: QuestionDifficulty;
  section?: string;
  searchQuery?: string;
}

export interface IQuestionRepository {
  getQuestion(id: string): Promise<Question | null>;
  listQuestions(filters?: QuestionFilters): Promise<Question[]>;
  /** The given questions only, in the order asked for; ids with no question are skipped. */
  getQuestionsByIds(ids: string[]): Promise<Question[]>;
  saveQuestion(question: Question): Promise<void>;
  saveQuestions?(questions: Question[]): Promise<void>;
  deleteQuestion(id: string): Promise<void>;
  countQuestions(): Promise<number>;
}
