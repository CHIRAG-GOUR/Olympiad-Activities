/**
 * Exam 5 audit — 9th IMO Class 6 Set B (Question Paper 2).
 *
 * Checks that the exam has 50 questions wired to 50 games, and that every correct option
 * equals the official key printed in "Answer Key 2", except Q39 (see VERIFIED in ../index.ts).
 */

import { IMO6B2_QUESTIONS, IMO6B2_EXAM } from "../index";
import { IMO6B2_ACTIVITY_MAP } from "@/components/activities/imo6b2-play/registry";

// Transcribed from "Answer Key 2", Q1 → Q50. Q39 is verified as C (the key prints D).
const OFFICIAL_KEY_2 = "BAADCCBDDC" + "DACDBDCBDA" + "CCCBBABCBD" + "ACBCBCBDDC" + "ADBACBBBAD";
const ERRATA: Record<number, string> = { 39: "C" };

function fail(msg: string): never {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

if (IMO6B2_QUESTIONS.length !== 50) fail(`Expected 50 questions, found ${IMO6B2_QUESTIONS.length}`);
if (IMO6B2_EXAM.questionIds.length !== 50) fail(`Expected 50 exam questionIds, found ${IMO6B2_EXAM.questionIds.length}`);
const sectionTotal = IMO6B2_EXAM.sections?.reduce((s, x) => s + x.questionIds.length, 0);
if (sectionTotal !== 50) fail(`Sections hold ${sectionTotal} questions, not 50`);

let redrawn = 0;
IMO6B2_QUESTIONS.forEach((q, i) => {
  const n = i + 1;
  if (!IMO6B2_ACTIVITY_MAP[q.id] || !IMO6B2_ACTIVITY_MAP[q.questionId as string]) fail(`No game for Q${n} (${q.id})`);
  const opts = q.multipleChoiceConfig?.options ?? [];
  if (opts.length !== 4) fail(`Q${n} has ${opts.length} options`);
  const key = q.multipleChoiceConfig?.correctOptionId;
  const want = ERRATA[n] ?? OFFICIAL_KEY_2[i];
  if (key !== want) fail(`Q${n}: correct option ${key}, expected ${want}`);
  if ((q.customConfig as Record<string, unknown> | undefined)?.redrawn) redrawn++;
});

console.log("✓ Exam 5: 50/50 questions have a game, 4 options and the Answer Key 2 option (Q39 erratum: C).");
console.log(`  ${redrawn} figure questions carry a note on how the scanned figure was redrawn.`);
