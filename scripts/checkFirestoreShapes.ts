/**
 * Proves the Firestore nested-array decoder does real work.
 *
 *   npm run verify:shapes
 *
 * Firestore cannot hold an array inside an array. The seeder therefore wraps every inner
 * array in a single-key map, which silently reshapes any question carrying coordinates,
 * grids or polygons. This walks all four papers, finds every config that the encoding
 * would reshape, and checks the decoder restores it exactly — so the render harness's
 * "via Firestore" case cannot quietly become a test of nothing.
 */

import { IMO6A_QUESTIONS } from "../src/data/imo6a";
import { IMO6A_CLASSIC_QUESTIONS } from "../src/data/imo6aClassic";
import { IMO6B2_QUESTIONS } from "../src/data/imo6b2";
import { IMO_CLASS6_SETB_QUESTIONS } from "../src/data/sofImoClass6SetB";
import { reviveNestedArrays } from "../src/repositories/firebase/decodeFirestore";
import type { Question } from "../src/types/question";

/** Mirrors scripts/seedAllFirestore.ts. */
function encodeForFirestore(value: unknown, insideArray = false): unknown {
  if (Array.isArray(value)) {
    const encoded = value.map((v) => encodeForFirestore(v, true));
    return insideArray ? { items: encoded } : encoded;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = encodeForFirestore(v, false);
    return out;
  }
  return value;
}

const PAPERS: [string, Question[]][] = [
  ["Set A · mini-games", IMO6A_QUESTIONS],
  ["Set A · classic", IMO6A_CLASSIC_QUESTIONS],
  ["Set B #2", IMO6B2_QUESTIONS],
  ["Set B", IMO_CLASS6_SETB_QUESTIONS],
];

let reshaped = 0;
let restored = 0;
const broken: string[] = [];

console.log("\nFirestore round trip for every question's configuration\n");

for (const [label, questions] of PAPERS) {
  let paperReshaped = 0;
  for (const q of questions) {
    const config = q.customConfig;
    if (!config) continue;

    const original = JSON.stringify(config);
    const encoded = JSON.stringify(encodeForFirestore(config));
    const decoded = JSON.stringify(reviveNestedArrays(encodeForFirestore(config)));

    if (original !== encoded) {
      reshaped++;
      paperReshaped++;
    }
    if (original === decoded) restored++;
    else broken.push(`${label} ${q.questionId}`);
  }
  console.log(`  ${label.padEnd(20)} ${paperReshaped}/${questions.length} questions reshaped by Firestore`);
}

console.log(`\n  ${reshaped} configurations are reshaped by the write`);
console.log(`  ${restored} of them are restored exactly by the decoder`);

if (reshaped === 0) {
  console.log("\n❌ the encoder reshaped nothing - this check proves nothing\n");
  process.exit(1);
}
if (broken.length) {
  console.log(`\n❌ ${broken.length} configuration(s) NOT restored:\n`);
  broken.slice(0, 20).forEach((b) => console.log(`  ${b}`));
  console.log();
  process.exit(1);
}

console.log("\n✅ EVERY RESHAPED CONFIGURATION IS RESTORED EXACTLY\n");
