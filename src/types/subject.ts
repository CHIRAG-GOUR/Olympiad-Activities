export interface Topic {
  id: string;
  name: string;
  description?: string;
  questionCount?: number;
}

export interface Chapter {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  code: string; // e.g. IMO, NSO, NCO, IEO
  name: string;
  description: string;
  color: string;
  iconName: string;
  gradeLevels: number[];
  chapters: Chapter[];
  questionCount?: number;
  examCount?: number;
}

export interface QuestionBank {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  grade: number | string;
  questionIds: string[];
  totalQuestions: number;
  createdAt: string;
  updatedAt: string;
}
