import { Question } from "@/types/question";
import { Exam } from "@/types/exam";
import { Subject } from "@/types/subject";
import { ExamSession } from "@/types/session";
import {
  IMO_SUBJECT,
  IMO_CLASS6_SETB_QUESTIONS,
  IMO_CLASS6_SETB_EXAM,
} from "@/data/sofImoClass6SetB";
import { IMO6A_QUESTIONS, IMO6A_EXAM } from "@/data/imo6a";

/**
 * Seeded content: two official SOF Olympiad papers for Class 6.
 *   • IMO 2018-19 Set A — transcribed from the supplied booklet, fully activity-driven.
 *   • IMO 2024-25 Set B — the paper the platform originally shipped with.
 * Both share one subject, so its counts are derived rather than hard-coded.
 */

export const SEED_QUESTIONS: Question[] = [...IMO6A_QUESTIONS, ...IMO_CLASS6_SETB_QUESTIONS];
export const SEED_EXAMS: Exam[] = [IMO6A_EXAM, IMO_CLASS6_SETB_EXAM];

export const SEED_SUBJECTS: Subject[] = [
  {
    ...IMO_SUBJECT,
    questionCount: SEED_QUESTIONS.length,
    examCount: SEED_EXAMS.length,
  },
];

export const SEED_LIVE_SESSIONS: ExamSession[] = [];
