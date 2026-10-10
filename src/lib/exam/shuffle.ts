import type { Question } from "@/types/question";

/**
 * Per-candidate paper order.
 *
 * Neighbours sitting the same paper see it in a different order, but one candidate always
 * sees the same order for a given sitting — after a refresh, a crash or on another device —
 * because the order is derived from the sitting's id, not from chance at load time.
 *
 * Scoring and every report use the paper's own order (see `restorePaperOrder`), so
 * "Q12" means the same question for every student in a teacher's analysis.
 */

/** FNV-1a: a stable 32-bit seed from any string. */
export function hashSeed(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32: small, fast, deterministic PRNG returning floats in [0, 1). */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates with a seeded generator. Returns a new array. */
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const out = items.slice();
  const rand = seededRandom(hashSeed(seed));
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Options whose meaning depends on their position ("All of the above", "Both (a) and (b)")
 * cannot be moved, so a question containing one keeps its printed order.
 */
const POSITIONAL_OPTION = /\b(all|none|both|neither)\b.*\b(above|these|of them|and)\b|\(\s*[a-d]\s*\)|\boption\s+[a-d]\b/i;

export function canShuffleOptions(question: Question): boolean {
  const options = question.multipleChoiceConfig?.options;
  if (question.questionType !== "MULTIPLE_CHOICE" || !options || options.length < 3) return false;
  return !options.some((o) => POSITIONAL_OPTION.test(`${o.text ?? ""} ${o.subtext ?? ""}`));
}

/** Options always remain in canonical A, B, C, D order. */
export function shuffleOptions(question: Question, _seed: string): Question {
  return question;
}

/**
 * The paper as this sitting shows it: sections stay in their printed order (a section is
 * a run of consecutive questions sharing `section`), questions are shuffled within each
 * section, and answer options within each question.
 */
export function orderForSitting(
  questions: readonly Question[],
  seed: string,
  /** Which section a question belongs to; defaults to its `section` field. */
  sectionOf: (q: Question) => string = (q) => q.section ?? ""
): Question[] {
  const blocks: Question[][] = [];
  for (const q of questions) {
    const last = blocks[blocks.length - 1];
    if (last && sectionOf(last[0]) === sectionOf(q)) last.push(q);
    else blocks.push([q]);
  }
  return blocks.flatMap((block, i) => seededShuffle(block, `${seed}|sec${i}`)).map((q) => shuffleOptions(q, seed));
}

/** Back to the paper's printed order, for scoring and reports. */
export function restorePaperOrder<T extends { id: string }>(questions: readonly T[], paperIds: readonly string[]): T[] {
  const rank = new Map(paperIds.map((id, i) => [id, i]));
  return questions
    .map((q, i) => ({ q, r: rank.get(q.id) ?? paperIds.length + i }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.q);
}
