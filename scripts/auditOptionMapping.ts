/**
 * Audits how each activity turns its derived value into a printed option.
 *
 *   npm run verify:mapping
 *
 * The contract every paper is meant to follow is that an activity produces a *value* and
 * a matcher finds the option carrying that value, so no activity ever names an option.
 * Several packs instead write:
 *
 *     optionId: matchText(question, "40 m") ?? "B"
 *
 * That trailing `?? "B"` is a hardcoded answer. If the matcher resolves it is merely dead
 * code; if it does not, the activity submits "B" no matter what the student did — which
 * marks a correct candidate wrong, or a wrong one right, with nothing on screen to show
 * it happened.
 *
 * This finds every such site, evaluates the matcher against the real question, and says
 * which fallbacks are live. A live fallback is a correctness bug; a dead one is tidy-up.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { matchNumber, matchText, matchOption, matchRatio } from "../src/components/activities/imo6a/shared";
import { IMO23_24_C_QUESTIONS } from "../src/data/imo23_24_c";
import { IMO10_G6_SETA_QUESTIONS } from "../src/data/imo10_g6_seta";
import { IMO_INTERACTIVE_G6_QUESTIONS } from "../src/data/imo_interactive_g6";
import { IMO6P3_QUESTIONS } from "../src/data/imo6p3";
import { IMO6B2_QUESTIONS } from "../src/data/imo6b2";
import { IMO_CLASS6_SETB_QUESTIONS } from "../src/data/sofImoClass6SetB";
import type { Question } from "../src/types/question";

const ROOT = join(process.cwd(), "src", "components", "activities");

const PACKS: { dir: string; label: string; questions: Question[] }[] = [
  { dir: "imo23_24_c-play", label: "2023-24 Set C", questions: IMO23_24_C_QUESTIONS },
  { dir: "imo10_g6_seta-play", label: "10th SOF Set A", questions: IMO10_G6_SETA_QUESTIONS },
  { dir: "imo_interactive_g6-play", label: "Interactive Edition", questions: IMO_INTERACTIVE_G6_QUESTIONS },
  { dir: "imo6p3-play", label: "Paper 3", questions: IMO6P3_QUESTIONS },
  { dir: "imo6b2-play", label: "Set B #2", questions: IMO6B2_QUESTIONS },
  { dir: "imo6b-play", label: "2022-23 Set B", questions: IMO_CLASS6_SETB_QUESTIONS },
];

type Matcher = (q: Question | undefined, arg: unknown) => string | undefined;
const MATCHERS: Record<string, Matcher> = {
  matchText: (q, a) => matchText(q, a as string),
  matchNumber: (q, a) => matchNumber(q, Number(a)),
  matchOption: (q, a) => (matchOption as unknown as Matcher)(q, a),
  matchRatio: (q, a) => matchRatio(q, Number(a), 1),
};

/** `Q07Something` / `PlayQ07Something` -> 7 */
const fnNumber = (line: string): number | null => {
  const m = line.match(/^export function (?:Play)?[A-Za-z](\d{2})/);
  return m ? Number(m[1]) : null;
};

interface Site {
  pack: string;
  file: string;
  qNo: number;
  matcher: string;
  arg: string | null;
  fallback: string;
  verdict: "dead" | "LIVE" | "dynamic";
  key?: string;
}

const sites: Site[] = [];

for (const pack of PACKS) {
  let files: string[];
  try {
    files = readdirSync(join(ROOT, pack.dir)).filter((f) => /^[pb].*\.tsx$/.test(f));
  } catch {
    continue;
  }

  for (const file of files) {
    const lines = readFileSync(join(ROOT, pack.dir, file), "utf8").split(/\r?\n/);
    let current: number | null = null;

    for (const line of lines) {
      const n = fnNumber(line);
      if (n !== null) current = n;
      if (current === null) continue;

      // Two shapes occur:
      //   matcher(question, X) ?? "B"
      //   matcher(question, X) ?? (X === 14 ? "A" : undefined)
      // The second is the worse of the two — it states the correct answer outright — but
      // the comparison also tells us the value to test the matcher with.
      const plain = line.match(/(match[A-Za-z]+)\s*\(\s*question\s*,\s*([^)]*?)\s*\)\s*\?\?\s*"([A-D])"/);
      const cond = line.match(
        /(match[A-Za-z]+)\s*\(\s*question\s*,\s*([^)]*?)\s*\)\s*\?\?\s*\([^=]*===\s*([^)?]+?)\s*\?\s*"([A-D])"/
      );
      const m = plain ?? cond;
      if (!m) continue;

      const matcher = m[1];
      const fallback = plain ? m[3] : m[4];
      // For the conditional form the literal being compared against is the value the
      // activity expects, so that is what the matcher must be able to resolve.
      const rawArg = plain ? m[2] : m[3].trim();
      const question = pack.questions[current - 1];
      const key = question?.multipleChoiceConfig?.correctOptionId;

      // Only a plain string or number literal can be evaluated from source.
      const literal = rawArg.match(/^"([^"]*)"$/) || rawArg.match(/^'([^']*)'$/);
      const numeric = rawArg.match(/^-?\d+(\.\d+)?$/);
      // `\`${w.rankTop}th\`` with the comparison value 14 means the matcher is asked for "14th".
      const templated = plain
        ? null
        : line.match(/match[A-Za-z]+\s*\(\s*question\s*,\s*`\$\{[^}]+\}([^`]*)`/);

      let verdict: Site["verdict"] = "dynamic";
      let arg: string | null = null;

      if (literal || numeric) {
        arg = literal ? literal[1] : rawArg;
        if (templated) arg = `${arg}${templated[1]}`;
        const fn = MATCHERS[matcher];
        if (fn && question) {
          verdict = fn(question, arg) !== undefined ? "dead" : "LIVE";
        }
      }

      sites.push({ pack: pack.label, file, qNo: current, matcher, arg, fallback, verdict, key });
    }
  }
}

console.log("\nHardcoded option fallbacks: `matcher(question, …) ?? \"X\"`\n");

const byPack = new Map<string, Site[]>();
for (const s of sites) byPack.set(s.pack, [...(byPack.get(s.pack) ?? []), s]);

let live = 0;
let wrongLetter = 0;

for (const pack of PACKS) {
  const list = byPack.get(pack.label) ?? [];
  if (!list.length) {
    console.log(`  ${pack.label.padEnd(22)} none — clean`);
    continue;
  }
  const dead = list.filter((s) => s.verdict === "dead").length;
  const liveOnes = list.filter((s) => s.verdict === "LIVE");
  const dyn = list.filter((s) => s.verdict === "dynamic").length;
  live += liveOnes.length;
  console.log(
    `  ${pack.label.padEnd(22)} ${list.length} site(s):  ${dead} dead, ${liveOnes.length} LIVE, ${dyn} need a manual look`
  );
  for (const s of liveOnes) {
    const bad = s.key && s.fallback !== s.key;
    if (bad) wrongLetter++;
    console.log(
      `      Q${String(s.qNo).padStart(2, "0")}  ${s.matcher}(${JSON.stringify(s.arg)}) does not match any option` +
        `  →  submits "${s.fallback}"` +
        (s.key ? `  (key is "${s.key}")${bad ? "  ← WRONG ANSWER" : ""}` : "")
    );
  }
}

console.log(`\n  ${sites.length} fallback sites in total, ${live} of them live`);
if (wrongLetter) {
  console.log(`  ${wrongLetter} live fallback(s) submit a letter that is NOT the key\n`);
  process.exit(1);
}
console.log(
  live
    ? "\n  No live fallback contradicts its key, but each one still hides the student's real answer.\n"
    : "\n✅ NO LIVE FALLBACKS — every activity's value reaches an option on its own\n"
);
