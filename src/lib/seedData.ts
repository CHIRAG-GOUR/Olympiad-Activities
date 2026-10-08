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
import { IMO23_24_C_QUESTIONS, IMO23_24_C_EXAM } from "@/data/imo23_24_c";
import { IMO10_G6_SETA_QUESTIONS, IMO10_G6_SETA_EXAM } from "@/data/imo10_g6_seta";
import { IMO_INTERACTIVE_G6_QUESTIONS, IMO_INTERACTIVE_G6_EXAM } from "@/data/imo_interactive_g6";
import { IEO_G6_SETA_QUESTIONS, IEO_G6_SETA_EXAM } from "@/data/ieo_g6_seta";
import { IEO_INTERACTIVE_G6_QUESTIONS, IEO_INTERACTIVE_G6_EXAM } from "@/data/ieo_interactive_g6";
import { IGKO_G6_SCITECH_QUESTIONS, IGKO_G6_SCITECH_EXAM, IGKO_SUBJECT } from "@/data/igko_g6_scitech";

/**
 * Seeded content: SOF Olympiad papers for Class 6.
 *   • SOF International English Olympiad 2024-25 (Class 6 - Set A) (ieo-2024-25-class-6-set-a)
 *   • SOF International English Olympiad 2024-25 (Class 6 - Master Set) (ieo-class6-master-interactive)
 *   • SOF International Mathematics Olympiad 2025-26 (Class 6 - Master Set) (imo-class6-master-interactive)
 *   • 10th SOF International Mathematics Olympiad (Class 6 - Set A) (imo-class6-setA-2026)
 *   • SOF International Mathematics Olympiad 2023-24 (Class 6 - Set C) (imo-2023-24-class-6-set-c)
 *   • SOF International Mathematics Olympiad 2018-19 (Class 6 - Set A) (exam_imo_2018_g6_seta)
 *   • SOF International Mathematics Olympiad 2018-19 (Class 6 - Set A - Classic) (exam_imo_2018_g6_seta_classic)
 *   • SOF International Mathematics Olympiad 2022-23 (Class 6 - Set B) (exam_imo_2022_g6_setb)
 *   • SOF International Mathematics Olympiad 2024-25 (Class 6 - Set B) (exam_imo_2024_g6_setb)
 *   • SOF 9th International Mathematics Olympiad (Class 6 - Set B) (exam_imo_g6_setb2)
 *   • SOF International Mathematics Olympiad 2019-20 (Class 6 - Set A) (exam_imo_g6_paper3)
 */

/** FNV-1a hash of a record's JSON, ignoring its own seedRev. */
function fingerprint(x: object): string {
  const json = JSON.stringify({ ...x, seedRev: undefined });
  let h = 0x811c9dc5;
  for (let i = 0; i < json.length; i++) {
    h ^= json.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

function stamp<T extends { seedRev?: string }>(items: T[]): T[] {
  return items.map((x) => ({ ...x, seedRev: fingerprint(x) }));
}

/**
 * Merge stored records with the built-in papers. A stored copy of a built-in record is kept
 * only while it carries the current seedRev (so a teacher's edit survives until the paper
 * itself changes); a copy of an older revision is replaced by the code's version, and
 * built-in records missing from the store are appended.
 */
export function reconcileWithSeed<T extends { id: string; seedRev?: string }>(stored: T[], seeds: T[]): T[] {
  const byId = new Map(seeds.map((s) => [s.id, s]));
  const kept = stored.map((x) => {
    const seed = byId.get(x.id);
    return seed && x.seedRev !== seed.seedRev ? seed : x;
  });
  const have = new Set(stored.map((x) => x.id));
  return [...kept, ...seeds.filter((s) => !have.has(s.id))];
}

/** The built-in version of one record, when the stored copy is missing or out of date. */
export function preferSeed<T extends { id: string; seedRev?: string }>(stored: T | null, seeds: T[], id: string): T | null {
  const seed = seeds.find((s) => s.id === id || (s as { code?: string }).code === id || (s as { questionId?: string }).questionId === id);
  if (!stored) return seed ?? null;
  if (seed && seed.id === stored.id && stored.seedRev !== seed.seedRev) return seed;
  return stored;
}

export const SEED_QUESTIONS: Question[] = stamp([
  ...IEO_G6_SETA_QUESTIONS,
  ...IEO_INTERACTIVE_G6_QUESTIONS,
  ...IMO_INTERACTIVE_G6_QUESTIONS,
  ...IMO10_G6_SETA_QUESTIONS,
  ...IMO23_24_C_QUESTIONS,
  ...IMO6A_QUESTIONS,
  ...IMO6A_CLASSIC_QUESTIONS,
  ...IMO_CLASS6_SETB_QUESTIONS,
  ...IMO6B2_QUESTIONS,
  ...IMO6P3_QUESTIONS,
  ...IGKO_G6_SCITECH_QUESTIONS,
]);
export const SEED_EXAMS: Exam[] = stamp([
  IEO_G6_SETA_EXAM,
  IEO_INTERACTIVE_G6_EXAM,
  IMO_INTERACTIVE_G6_EXAM,
  IMO10_G6_SETA_EXAM,
  IMO23_24_C_EXAM,
  IMO6A_EXAM,
  IMO6A_CLASSIC_EXAM,
  IMO_CLASS6_SETB_2022_EXAM,
  IMO_CLASS6_SETB_2024_EXAM,
  IMO6B2_EXAM,
  IMO6P3_EXAM,
  IGKO_G6_SCITECH_EXAM,
]);

export const IEO_SUBJECT: Subject = {
  id: "sub_english",
  name: "English",
  code: "ENG-06",
  description:
    "International English Olympiad (IEO) curriculum covering word and structure knowledge, reading comprehension, spoken and written expression, and higher-order verbal reasoning.",
  color: "#9333EA",
  iconName: "BookOpen",
  gradeLevels: [6],
  chapters: [
    {
      id: "ch_word_power",
      name: "Word and Structure Knowledge",
      topics: [
        { id: "top_grammar", name: "Grammar & Sentence Structure" },
        { id: "top_vocab", name: "Vocabulary & Idioms" },
      ],
    },
    {
      id: "ch_reading",
      name: "Reading Comprehension",
      topics: [{ id: "top_comprehension", name: "Passage Analysis & Inference" }],
    },
    {
      id: "ch_achievers_eng",
      name: "Achievers Section",
      topics: [{ id: "top_achievers_eng", name: "Advanced Verbal Reasoning" }],
    },
  ],
  questionCount: 0,
  examCount: 0,
};

export const SEED_SUBJECTS: Subject[] = [
  {
    ...IMO_SUBJECT,
    name: "Mathematics",
    questionCount: SEED_QUESTIONS.filter((q) => q.subjectId === "sub_mathematics" || !q.subjectId).length,
    examCount: SEED_EXAMS.filter((e) => e.subjectId === "sub_mathematics" || !e.subjectId).length,
  },
  {
    ...IEO_SUBJECT,
    questionCount: SEED_QUESTIONS.filter((q) => q.subjectId === "sub_english").length,
    examCount: SEED_EXAMS.filter((e) => e.subjectId === "sub_english").length,
  },
  {
    ...IGKO_SUBJECT,
    questionCount: SEED_QUESTIONS.filter((q) => q.subjectId === IGKO_SUBJECT.id).length,
    examCount: SEED_EXAMS.filter((e) => e.subjectId === IGKO_SUBJECT.id).length,
  },
];

export const SEED_LIVE_SESSIONS: ExamSession[] = [];

