import { QuestionAnswerPayload, QuestionType } from "./question";
import { StudentMetadata, DeviceInfo } from "./session";

export interface QuestionEvaluationResult {
  questionId: string;
  questionNumber: number;
  questionType: QuestionType;
  sectionTitle?: string;
  maxMarks: number;
  marksAwarded: number;
  isCorrect: boolean;
  isPartial?: boolean;
  studentAnswer: any;
  correctAnswerSummary: string;
  explanation?: string;
  timeSpentSeconds: number;
}

export interface SectionScore {
  sectionTitle: string;
  marksAwarded: number;
  maxMarks: number;
  accuracyPercent: number;
  questionsTotal: number;
  questionsCorrect: number;
}

export interface ExamAttempt {
  id: string; // attemptId
  examId: string;
  examCode: string;
  examTitle: string;
  subjectName: string;
  student: StudentMetadata;
  device: DeviceInfo;
  
  // Core Score Data
  totalMarks: number;
  maximumMarks: number;
  scoreDisplay: string; // "45/50"
  percentage: number;
  isPassed: boolean;
  
  // Detailed data for teacher/admin view
  questionEvaluations: QuestionEvaluationResult[];
  sectionScores: SectionScore[];
  totalTimeSpentSeconds: number;
  timeLimitSeconds: number;
  startedAt: string;
  submittedAt: string;
  submissionType: "normal" | "auto_timeout" | "force_submit";
}
