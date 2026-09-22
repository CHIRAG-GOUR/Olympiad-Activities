import { QuestionType, QuestionDifficulty } from "./question";

export interface QuestionReportItem {
  questionNumber: number;
  questionId: string;
  questionText: string;
  questionType: QuestionType;
  section: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: QuestionDifficulty;
  maxMarks: number;
  marksAwarded: number;
  status: "CORRECT" | "INCORRECT" | "UNANSWERED" | "PARTIAL";
  studentAnswerFormatted: string;
  correctAnswerFormatted: string;
  explanation?: string;
  timeSpentSeconds: number;
}

export interface TopicReportItem {
  topic: string;
  chapter: string;
  subject: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctQuestions: number;
  wrongQuestions: number;
  marksAwarded: number;
  maxMarks: number;
  accuracyPercentage: number;
}

export interface DifficultyReportItem {
  difficulty: QuestionDifficulty;
  total: number;
  correct: number;
  accuracy: number;
}

export interface ExamReport {
  reportId: string;
  attemptId: string;
  examId: string;
  examTitle: string;
  examCode: string;
  subject: string;
  classLevel: number | string;
  
  // Student Identity
  studentId: string;
  studentName: string;
  schoolName: string;
  attemptNumber: number;

  // Timestamps & Duration
  startedAt: string;
  submittedAt: string;
  totalDurationMinutes: number;
  timeSpentSeconds: number;

  // Aggregate Metrics
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredQuestions: number;

  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  accuracy: number;
  isPassed: boolean;

  // Detailed Analysis
  topicResults: TopicReportItem[];
  difficultyResults: DifficultyReportItem[];
  questionResults: QuestionReportItem[];

  // Security / Telemetry metadata
  lastKnownIp?: string;
  generatedAt: string;
  version: number;
}
