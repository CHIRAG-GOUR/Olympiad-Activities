import { Question } from "./question";

export type ExamStatus = "Draft" | "Published" | "Archived" | "Live";

export interface ExamSection {
  id: string;
  title: string;
  description?: string;
  questionIds: string[];
  durationMinutes?: number;
}

export interface ExamRules {
  allowBacktrack: boolean;
  shuffleQuestions: boolean;
  showTimer: boolean;
  autoSubmitOnTimeUp: boolean;
  passPercentage: number;
  negativeMarkingEnabled: boolean;
  instructions: string[];
}

export interface Exam {
  id: string;
  code: string; // e.g. IMO-2026-PRIMARY
  title: string;
  subtitle?: string;
  description: string;
  subjectId: string;
  subjectName: string;
  grade: number | string;
  academicYear: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  totalQuestions: number;
  questionIds: string[];
  sections?: ExamSection[];
  rules: ExamRules;
  status: ExamStatus;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  createdAt: string;
  updatedAt: string;
  participantCount?: number;
  completionCount?: number;
  averageScore?: number;
}

export interface ExamWithQuestions extends Exam {
  questions: Question[];
}
