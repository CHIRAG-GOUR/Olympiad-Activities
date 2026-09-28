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

/**
 * Seeded content: seven SOF Olympiad papers for Class 6.
 *   • 10th SOF IMO Class 6 Set A Level 1 (imo-class6-setA-2026) — 50 bespoke interactive activities.
 *   • IMO 2023-24 Set C (imo-2023-24-class-6-set-c) — 50 bespoke interactive activities.
 *   • IMO 2018-19 Set A (Playable Mini-Games) — 50 mini-games (10 in 3D).
 *   • IMO 2018-19 Set A (Classic Activities) — 50 classic interactive activities.
 *   • IMO 2022-23 Set B (50 Interactive 3D Mini-Games) — 50 bespoke 3D mini-games.
 *   • IMO 2024-25 Set B (Interactive Activities) — 50 interactive activities.
 *   • IMO Set B #2 (Practice Paper) — 50 mini-games (10 in 3D), keyed to Answer Key 2.
 *   • IMO Class 6 Paper 3 (Set C / Level 1) — 50 interactive mini-games.
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
  ...IMO10_G6_SETA_QUESTIONS,
  ...IMO23_24_C_QUESTIONS,
  ...IMO6A_QUESTIONS,
  ...IMO6A_CLASSIC_QUESTIONS,
  ...IMO_CLASS6_SETB_QUESTIONS,
  ...IMO6B2_QUESTIONS,
  ...IMO6P3_QUESTIONS,
]);
export const SEED_EXAMS: Exam[] = stamp([
  IMO10_G6_SETA_EXAM,
  IMO23_24_C_EXAM,
  IMO6A_EXAM,
  IMO6A_CLASSIC_EXAM,
  IMO_CLASS6_SETB_2022_EXAM,
  IMO_CLASS6_SETB_2024_EXAM,
  IMO6B2_EXAM,
  IMO6P3_EXAM,
]);

export const SEED_SUBJECTS: Subject[] = [
  {
    ...IMO_SUBJECT,
    questionCount: SEED_QUESTIONS.length,
    examCount: SEED_EXAMS.length,
  },
];

export const SEED_LIVE_SESSIONS: ExamSession[] = [];

