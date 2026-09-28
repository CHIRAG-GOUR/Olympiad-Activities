/**
 * Exam Audit — SOF International Mathematics Olympiad 2023–24 Class 6 Set C.
 *
 * Checks that the exam has 50 questions wired to 50 bespoke activities,
 * and that every correct option equals the official verified key.
 */

import { IMO23_24_C_QUESTIONS, IMO23_24_C_EXAM, IMO23_24_C_KEY } from "../index";
import { IMO23_24_C_PLAY_ACTIVITY_MAP } from "../../../components/activities/imo23_24_c-play/registry";

function fail(msg: string): never {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

if (IMO23_24_C_QUESTIONS.length !== 50) fail(`Expected 50 questions, found ${IMO23_24_C_QUESTIONS.length}`);
if (IMO23_24_C_EXAM.questionIds.length !== 50) fail(`Expected 50 exam questionIds, found ${IMO23_24_C_EXAM.questionIds.length}`);
const sectionTotal = IMO23_24_C_EXAM.sections?.reduce((s, x) => s + x.questionIds.length, 0);
if (sectionTotal !== 50) fail(`Sections hold ${sectionTotal} questions, not 50`);

IMO23_24_C_QUESTIONS.forEach((q, i) => {
  const n = i + 1;
  const act = IMO23_24_C_PLAY_ACTIVITY_MAP[q.id] || IMO23_24_C_PLAY_ACTIVITY_MAP[q.questionId as string];
  if (!act) {
    fail(`No activity registered for Q${n} (${q.id} / ${q.questionId})`);
  }
  const opts = q.multipleChoiceConfig?.options ?? [];
  if (opts.length !== 4) fail(`Q${n} has ${opts.length} options instead of 4`);
  const key = q.multipleChoiceConfig?.correctOptionId;
  if (key !== IMO23_24_C_KEY[i]) {
    fail(`Q${n}: correct option ${key}, official key ${IMO23_24_C_KEY[i]}`);
  }
});

console.log("✓ IMO 2023-24 Class 6 Set C: All 50/50 questions have an interactive activity, 4 options, and match the official Answer Key.");
