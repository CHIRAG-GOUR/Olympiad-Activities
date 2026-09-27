/**
 * Exam 6 audit — IMO 2019-20 Class 6 Set A (Question Paper 3).
 *
 * Checks that the exam has 50 questions wired to 50 games, and that every correct option
 * equals the official key printed in "Answer ket VI Imo - 3.pdf".
 */

import { IMO6P3_QUESTIONS, IMO6P3_EXAM } from "../index";
import { IMO6P3_ACTIVITY_MAP } from "@/components/activities/imo6p3-play/registry";

// Transcribed from "Answer ket VI Imo - 3.pdf", Q1 → Q50.
const OFFICIAL_KEY_3 = "DAADDACACB" + "ABCBCDDDBD" + "CBDBCCDBCD" + "DDCACCBDAD" + "BDCCCBCCBD";

function fail(msg: string): never {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

if (IMO6P3_QUESTIONS.length !== 50) fail(`Expected 50 questions, found ${IMO6P3_QUESTIONS.length}`);
if (IMO6P3_EXAM.questionIds.length !== 50) fail(`Expected 50 exam questionIds, found ${IMO6P3_EXAM.questionIds.length}`);
const sectionTotal = IMO6P3_EXAM.sections?.reduce((s, x) => s + x.questionIds.length, 0);
if (sectionTotal !== 50) fail(`Sections hold ${sectionTotal} questions, not 50`);

let redrawn = 0;
IMO6P3_QUESTIONS.forEach((q, i) => {
  const n = i + 1;
  if (!IMO6P3_ACTIVITY_MAP[q.id] || !IMO6P3_ACTIVITY_MAP[q.questionId as string]) fail(`No game for Q${n} (${q.id})`);
  const opts = q.multipleChoiceConfig?.options ?? [];
  if (opts.length !== 4) fail(`Q${n} has ${opts.length} options`);
  const key = q.multipleChoiceConfig?.correctOptionId;
  if (key !== OFFICIAL_KEY_3[i]) fail(`Q${n}: correct option ${key}, official key ${OFFICIAL_KEY_3[i]}`);
  if ((q.customConfig as Record<string, unknown> | undefined)?.redrawn) redrawn++;
});

console.log("✓ Exam 6: 50/50 questions have a game, 4 options and the official Answer Key 3 option.");
console.log(`  ${redrawn} figure questions carry a note on how the scanned figure was redrawn.`);
