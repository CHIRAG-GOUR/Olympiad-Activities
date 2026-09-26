import { Question } from "@/types/question";
import { Exam } from "@/types/exam";
import { Subject } from "@/types/subject";
import { ExamSession } from "@/types/session";
import {
  IMO_SUBJECT,
  IMO_CLASS6_SETB_QUESTIONS,
  IMO_CLASS6_SETB_2022_EXAM,
  IMO_CLASS6_SETB_2024_EXAM,
} from "@/data/sofImoClass6SetB";
import { IMO6A_QUESTIONS, IMO6A_EXAM } from "@/data/imo6a";
import { IMO6A_CLASSIC_QUESTIONS, IMO6A_CLASSIC_EXAM } from "@/data/imo6aClassic";
import { IMO6B2_QUESTIONS, IMO6B2_EXAM } from "@/data/imo6b2";
import { IMO6P3_QUESTIONS, IMO6P3_EXAM } from "@/data/imo6p3";

/**
 * Seeded content: six SOF Olympiad papers for Class 6.
 *   • IMO 2018-19 Set A (Playable Mini-Games) — 50 mini-games (10 in 3D).
 *   • IMO 2018-19 Set A (Classic Activities) — 50 classic interactive activities.
 *   • IMO 2022-23 Set B (50 Interactive 3D Mini-Games) — 50 bespoke 3D mini-games.
 *   • IMO 2024-25 Set B (Interactive Activities) — 50 interactive activities.
 *   • IMO Set B #2 (Practice Paper) — 50 mini-games (10 in 3D), keyed to Answer Key 2.
 *   • IMO Class 6 Paper 3 (Set C / Level 1) — 50 interactive mini-games.
 */

export const SEED_QUESTIONS: Question[] = [
  ...IMO6A_QUESTIONS,
  ...IMO6A_CLASSIC_QUESTIONS,
  ...IMO_CLASS6_SETB_QUESTIONS,
  ...IMO6B2_QUESTIONS,
  ...IMO6P3_QUESTIONS,
];
export const SEED_EXAMS: Exam[] = [
  IMO6A_EXAM,
  IMO6A_CLASSIC_EXAM,
  IMO_CLASS6_SETB_2022_EXAM,
  IMO_CLASS6_SETB_2024_EXAM,
  IMO6B2_EXAM,
  IMO6P3_EXAM,
];

export const SEED_SUBJECTS: Subject[] = [
  {
    ...IMO_SUBJECT,
    questionCount: SEED_QUESTIONS.length,
    examCount: SEED_EXAMS.length,
  },
];

export const SEED_LIVE_SESSIONS: ExamSession[] = [];

