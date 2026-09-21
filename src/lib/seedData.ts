import { Question } from "@/types/question";
import { Exam } from "@/types/exam";
import { Subject } from "@/types/subject";
import { ExamSession } from "@/types/session";
import {
  IMO_SUBJECT,
  IMO_CLASS6_SETB_QUESTIONS,
  IMO_CLASS6_SETB_EXAM,
} from "@/data/sofImoClass6SetB";

// Real Olympiad Examination: SOF IMO Class-6 Set-B 2024-25 (50 questions, 60 marks)
export const SEED_SUBJECTS: Subject[] = [IMO_SUBJECT];
export const SEED_QUESTIONS: Question[] = IMO_CLASS6_SETB_QUESTIONS;
export const SEED_EXAMS: Exam[] = [IMO_CLASS6_SETB_EXAM];
export const SEED_LIVE_SESSIONS: ExamSession[] = [];
