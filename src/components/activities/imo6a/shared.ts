import { Question } from "@/types/question";

/**
 * Shared plumbing for the IMO 2018-19 Set A activities.
 *
 * The rule these helpers enforce: an activity computes a *value* from what the student
 * did, and then looks for the option whose printed text carries that value. No activity
 * ever names an option id, so none of them can leak which option happens to be correct.
 */

const options = (q?: Question) => q?.multipleChoiceConfig?.options ?? [];

/** Strip currency, units and typographic minus so an option's number can be read. */
function clean(text: string): string {
  return text
    .replace(/₹/g, "")
    .replace(/[,]/g, "")
    .replace(/−/g, "-")
    .replace(/°C/gi, "")
    .replace(/\bsq\.?\s*(cm|m)\b/gi, "")
    .replace(/\b(cm|kg|mL|L|m|g)\b/g, "")
    .trim();
}

/**
 * Numeric value an option's text denotes. Understands plain integers and decimals,
 * vulgar fractions ("45/75") and mixed numbers ("1 64/101").
 */
export function optionValue(text: string): number | undefined {
  const t = clean(text);
  const mixed = t.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)/);
  if (mixed) {
    const whole = Number(mixed[1]);
    const frac = Number(mixed[2]) / Number(mixed[3]);
    return whole < 0 ? whole - frac : whole + frac;
  }
  const frac = t.match(/^(-?\d+)\s*\/\s*(\d+)/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  const num = t.match(/-?\d+(?:\.\d+)?/);
  return num ? Number(num[0]) : undefined;
}

/** Every number appearing in an option, in order — for options like "490, 392, 280". */
export function optionNumbers(text: string): number[] {
  return (clean(text).match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
}

/** Option whose text denotes `target`, within a small tolerance for decimals. */
export function matchNumber(q: Question | undefined, target: number | undefined, tolerance = 1e-6) {
  if (target === undefined || !Number.isFinite(target)) return undefined;
  return options(q).find((o) => {
    const v = optionValue(o.text);
    return v !== undefined && Math.abs(v - target) <= tolerance;
  })?.id;
}

/** Option whose numbers match `targets` in order — "490, 392, 280" style options. */
export function matchNumberList(
  q: Question | undefined,
  targets: (number | undefined)[],
  tolerance = 1e-6
) {
  if (targets.some((t) => t === undefined || !Number.isFinite(t as number))) return undefined;
  return options(q).find((o) => {
    const nums = optionNumbers(o.text);
    if (nums.length !== targets.length) return false;
    return nums.every((n, i) => Math.abs(n - (targets[i] as number)) <= tolerance);
  })?.id;
}

/** Option expressing the ratio a : b, compared in lowest terms. */
export function matchRatio(q: Question | undefined, a?: number, b?: number) {
  if (a === undefined || b === undefined || !b) return undefined;
  const target = a / b;
  return options(q).find((o) => {
    const nums = optionNumbers(o.text);
    if (nums.length !== 2 || !nums[1]) return false;
    return Math.abs(nums[0] / nums[1] - target) < 1e-9;
  })?.id;
}

/** Normalise free text so wording differences in spacing or case do not matter. */
export function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[−–—]/g, "-")
    .replace(/[^a-z0-9+\-./:> ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Option whose text equals `target` once normalised. */
export function matchText(q: Question | undefined, target: string | undefined) {
  if (!target) return undefined;
  const want = normalise(target);
  return options(q).find((o) => normalise(o.text) === want)?.id;
}

/** Option whose ID, letter index, or text denotation matches `keyOrLetter`. */
export function matchOption(q: Question | undefined, keyOrLetter: string | undefined): string | undefined {
  if (!keyOrLetter) return undefined;
  const opts = options(q);
  if (opts.length === 0) return keyOrLetter;

  // 1. Direct ID match
  const directId = opts.find((o) => o.id.toLowerCase() === keyOrLetter.toLowerCase());
  if (directId) return directId.id;

  // 2. Direct single letter A/B/C/D mapping to 0/1/2/3 index if available
  const upper = keyOrLetter.toUpperCase();
  const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
  if (letterMap[upper] !== undefined) {
    const idx = letterMap[upper];
    if (opts[idx]) return opts[idx].id;
  }

  // 3. Option text starts with or contains
  const textMatch = opts.find((o) =>
    o.text.trim().toLowerCase().startsWith(keyOrLetter.toLowerCase()) ||
    normalise(o.text) === normalise(keyOrLetter)
  );
  if (textMatch) return textMatch.id;

  return keyOrLetter;
}

/** Option whose text contains every fragment given — for multi-part options. */
export function matchAllFragments(q: Question | undefined, fragments: (string | undefined)[]) {
  if (fragments.some((f) => !f)) return undefined;
  const wanted = fragments.map((f) => normalise(f as string));
  return options(q).find((o) => {
    const hay = normalise(o.text);
    return wanted.every((w) => hay.includes(w));
  })?.id;
}

/**
 * Option whose declared state in `customConfig.optionStates` matches the state the
 * student built. Used by the figure questions, where options are pictures rather than
 * values: the question data says what each picture depicts, the activity says what the
 * student made, and this compares the two.
 */
export function matchOptionState<T>(
  q: Question | undefined,
  built: T | undefined,
  equals: (optionState: any, built: T) => boolean
): string | undefined {
  if (built === undefined) return undefined;
  const states = q?.customConfig?.optionStates as Record<string, any> | undefined;
  if (!states) return undefined;
  const hit = Object.keys(states).find((id) => equals(states[id], built));
  return hit;
}

/* ── number formatting ─────────────────────────────────────── */

export const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

export function reduceFraction(num: number, den: number): [number, number] {
  if (!den) return [num, den];
  const g = gcd(Math.round(num), Math.round(den)) || 1;
  const sign = den < 0 ? -1 : 1;
  return [(sign * Math.round(num)) / g, (sign * Math.round(den)) / g];
}

/** "165/101" -> "1 64/101". Whole numbers come back bare. */
export function toMixedString(num: number, den: number): string {
  const [n, d] = reduceFraction(num, den);
  if (!d) return "—";
  if (n % d === 0) return String(n / d);
  const whole = Math.trunc(n / d);
  const rem = Math.abs(n % d);
  return whole === 0 ? `${n < 0 ? "-" : ""}${rem}/${d}` : `${whole} ${rem}/${d}`;
}

/** Round to `dp` decimal places, killing floating-point dust. */
export const round = (v: number, dp = 2) => Number(v.toFixed(dp));

export const money = (v: number, symbol = "₹") => `${symbol} ${v.toFixed(2)}`;

/** Multiset equality — for comparing sets of faces, cells or labels. */
export function sameSet(a: (string | number)[], b: (string | number)[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].map(String).sort();
  const sb = [...b].map(String).sort();
  return sa.every((v, i) => v === sb[i]);
}
