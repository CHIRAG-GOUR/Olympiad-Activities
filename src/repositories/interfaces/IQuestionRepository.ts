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
  saveQuestion(question: Question): Promise<void>;
  deleteQuestion(id: string): Promise<void>;
  countQuestions(): Promise<number>;
}
