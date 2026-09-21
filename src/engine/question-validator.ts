import { z } from "zod";

export const QuestionTypeEnum = z.enum([
  "ORDERING",
  "DRAG_DROP",
  "NUMERIC",
  "NUMERIC_TOLERANCE",
  "MATCHING",
  "CLASSIFICATION",
  "HOTSPOT",
  "SEQUENCE",
  "GRAPH",
  "CONSTRUCTION",
  "SIMULATION",
  "CUSTOM",
]);

export const DifficultyEnum = z.enum(["EASY", "MEDIUM", "HARD", "ACHIEVER"]);

export const QuestionSchema = z.object({
  id: z.string().min(1),
  questionId: z.string().min(1),
  subjectId: z.string().min(1),
  subjectName: z.string().min(1),
  chapter: z.string().min(1),
  topic: z.string().min(1),
  grade: z.union([z.number(), z.string()]),
  section: z.enum(["Logical Reasoning", "Mathematical Reasoning", "Everyday Mathematics", "Achievers Section"]).optional(),
  questionText: z.string().min(3, "Question text must be at least 3 characters"),
  questionType: QuestionTypeEnum,
  difficulty: DifficultyEnum,
  marks: z.number().min(0.5).default(1),
  negativeMarks: z.number().min(0).default(0),
  explanation: z.string().optional(),
  status: z.enum(["Draft", "Review", "Published", "Archived"]).default("Published"),
});

export const RawImportRowSchema = z.object({
  question_text: z.string().min(1, "Question text is required"),
  question_type: z.string().optional(),
  subject: z.string().optional(),
  grade: z.union([z.string(), z.number()]).optional(),
  marks: z.union([z.string(), z.number()]).optional(),
  answer: z.string().optional(),
});
