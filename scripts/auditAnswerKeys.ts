/**
 * Cross-checks each question's declared answer against its answer key.
 *
 *   npm run verify:keys
 *
 * Most questions carry the worked answer in `customConfig` — `targetDist: 40`,
 * `result: 10`, `correctFigure: "C"`, `count: 2`. That value is what the activity builds
 * its world around, so if it points at a different option from `correctOptionId`, then a
 * student who works the activity correctly is marked wrong. Nothing else in the codebase
 * compares the two.
 *
 * Every value in a question's config is tested against its options. A config value that
 * lands on exactly one option is treated as that question's declared answer; a value that
 * matches nothing is ignored, since plenty of config is scenery rather than answer.
 */

import { matchNumber, matchText, matchOption } from "../src/components/activities/imo6a/shared";
import { IMO23_24_C_QUESTIONS } from "../src/data/imo23_24_c";
import { IMO10_G6_SETA_QUESTIONS } from "../src/data/imo10_g6_seta";
import { IMO_INTERACTIVE_G6_QUESTIONS } from "../src/data/imo_interactive_g6";
import type { Question } from "../src/types/question";

const PAPERS: { label: string; questions: Question[] }[] = [
  { label: "2023-24 Set C", questions: IMO23_24_C_QUESTIONS },
  { label: "10th SOF Set A", questions: IMO10_G6_SETA_QUESTIONS },
  { label: "Interactive Edition", questions: IMO_INTERACTIVE_G6_QUESTIONS },
];

/** Config keys that describe the paper rather than the answer. */
const IGNORED = new Set(["paper", "examId", "questionNumber", "activity"]);

/**
 * Field names that read as "this is the answer" rather than "this is part of the setup".
 * A mismatch on one of these is almost certainly a real error; a mismatch on an input
 * field (rankFromBottom, alokInitial) is usually just that number also appearing among
 * the options, which is noise.
 */
const ANSWER_LIKE = /^(answer|result|output|final|derived|correct|total|solution|value)/i;

/** Which option, if any, this config value denotes. */
function optionFor(question: Question, value: unknown): string | undefined {
  if (typeof value === "number") return matchNumber(question, value);
  if (typeof value !== "string") return undefined;

  // A bare option letter, or a phrase like "Figure C" / "Option B" / "Clock A".
  const letter = value.trim().match(/^(?:[A-Za-z ]*\s)?([A-D])$/);
  if (letter) {
    const viaOption = matchOption(question, letter[1]);
    if (viaOption) return viaOption;
  }
  return matchText(question, value) ?? undefined;
}

interface Finding {
  paper: string;
  qid: string;
  n: number;
  field: string;
  value: string;
  declares: string;
  key: string;
  strong: boolean;
}

const findings: Finding[] = [];
let checked = 0;
let withDeclared = 0;

for (const paper of PAPERS) {
  paper.questions.forEach((question, i) => {
    const key = question.multipleChoiceConfig?.correctOptionId;
    const config = question.customConfig;
    if (!key || !config) return;
    checked++;

    let declaredHere = false;
    for (const [field, value] of Object.entries(config)) {
      if (IGNORED.has(field)) continue;
      if (value === null || typeof value === "object") continue;

      const option = optionFor(question, value);
      if (!option) continue;

      declaredHere = true;
      if (option !== key) {
        findings.push({
          paper: paper.label,
          qid: question.questionId,
          n: i + 1,
          field,
          value: String(value),
          declares: option,
          key,
          strong: ANSWER_LIKE.test(field),
        });
      }
    }
    if (declaredHere) withDeclared++;
  });
}

console.log("\nDeclared answers vs the answer key\n");
console.log(`  ${checked} questions checked, ${withDeclared} of them declare an answer in their config\n`);

if (!findings.length) {
  console.log("✅ EVERY DECLARED ANSWER AGREES WITH ITS KEY\n");
  process.exit(0);
}

const byPaper = new Map<string, Finding[]>();
for (const f of findings) byPaper.set(f.paper, [...(byPaper.get(f.paper) ?? []), f]);

const strongCount = findings.filter((f) => f.strong).length;

for (const [paper, list] of byPaper) {
  console.log(`  ${paper}`);
  for (const f of [...list].sort((a, b) => Number(b.strong) - Number(a.strong))) {
    const opts = PAPERS.find((p) => p.label === paper)!.questions[f.n - 1].multipleChoiceConfig!.options;
    const text = (id: string) => opts.find((o) => o.id === id)?.text ?? "?";
    console.log(
      `    ${f.strong ? "!!" : "  "} Q${String(f.n).padStart(2, "0")}  ${f.field} = ${f.value}` +
        `  →  option ${f.declares} ("${text(f.declares)}")` +
        `   but the key says ${f.key} ("${text(f.key)}")`
    );
  }
  console.log();
}

console.log(`❌ ${findings.length} DISAGREEMENT(S) between the worked answer and the key\n`);
process.exit(1);
