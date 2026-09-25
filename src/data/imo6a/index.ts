import { Question } from "@/types/question";
import { Exam } from "@/types/exam";
import { IMO6A_LOGICAL_REASONING } from "./logicalReasoning";
import { IMO6A_MATHEMATICAL_REASONING } from "./mathematicalReasoning";
import { IMO6A_EVERYDAY_MATHEMATICS } from "./everydayMathematics";
import { IMO6A_ACHIEVERS } from "./achievers";

/**
 * SOF International Mathematics Olympiad 2018-19 · Class 6 · Set A.
 *
 * Transcribed from the official question booklet supplied as `Paper 1.pdf`, with correct
 * options taken from the official key in `Answer Key 1.pdf`.
 *
 * Structure: Logical Reasoning (15 × 1), Mathematical Reasoning (20 × 1),
 * Everyday Mathematics (10 × 1) and Achievers (5 × 3) = 60 marks over 60 minutes.
 */

export const IMO6A_QUESTIONS: Question[] = [
  ...IMO6A_LOGICAL_REASONING,
  ...IMO6A_MATHEMATICAL_REASONING,
  ...IMO6A_EVERYDAY_MATHEMATICS,
  ...IMO6A_ACHIEVERS,
];

const sectionIds = (from: number, to: number) =>
  IMO6A_QUESTIONS.slice(from, to).map((q) => q.id);

export const IMO6A_EXAM: Exam = {
  id: "exam_imo_2018_g6_seta",
  code: "IMO-2018-G6-SETA",
  title: "SOF International Mathematics Olympiad 2018-19 (Class 6 - Set A)",
  subtitle: "Science Olympiad Foundation • Official Level-1 Examination Paper",
  description:
    "The official SOF IMO 2018-19 Level-1 paper for Class 6, Set A. Every one of the 50 questions is answered by working a hands-on activity rather than by picking a lettered option.",
  subjectId: "sub_mathematics",
  subjectName: "Mathematics & Logical Reasoning",
  grade: 6,
  academicYear: "2018-19",
  durationMinutes: 60,
  totalQuestions: 50,
  totalMarks: 60,
  passingMarks: 24,
  rules: {
    allowBacktrack: true,
    shuffleQuestions: false,
    showTimer: true,
    autoSubmitOnTimeUp: true,
    passPercentage: 40,
    negativeMarkingEnabled: false,
    instructions: [
      "The question paper comprises four sections: Logical Reasoning (15 questions), Mathematical Reasoning (20 questions), Everyday Mathematics (10 questions) and Achievers Section (5 questions).",
      "Each question in the Achievers Section carries 3 marks, whereas all other questions carry 1 mark each.",
      "All questions are compulsory. There is no negative marking. Use of a calculator is not permitted.",
      "Every question is an activity. Work the apparatus on screen — fold the net, walk the perimeter, dial the numerator — and the activity produces your answer for you.",
      "Your work on each activity is saved as you go, so you can leave a question and come back to it exactly as you left it.",
      "You may move freely between questions using the Question Palette.",
      "The examination lasts 60 minutes and submits itself when the time expires.",
    ],
  },
  sections: [
    {
      id: "sec_a_logical",
      title: "Logical Reasoning",
      description: "15 Questions (1 Mark each)",
      questionIds: sectionIds(0, 15),
    },
    {
      id: "sec_a_math",
      title: "Mathematical Reasoning",
      description: "20 Questions (1 Mark each)",
      questionIds: sectionIds(15, 35),
    },
    {
      id: "sec_a_everyday",
      title: "Everyday Mathematics",
      description: "10 Questions (1 Mark each)",
      questionIds: sectionIds(35, 45),
    },
    {
      id: "sec_a_achievers",
      title: "Achievers Section",
      description: "5 Questions (3 Marks each)",
      questionIds: sectionIds(45, 50),
    },
  ],
  questionIds: IMO6A_QUESTIONS.map((q) => q.id),
  status: "Published",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

export {
  IMO6A_LOGICAL_REASONING,
  IMO6A_MATHEMATICAL_REASONING,
  IMO6A_EVERYDAY_MATHEMATICS,
  IMO6A_ACHIEVERS,
};
