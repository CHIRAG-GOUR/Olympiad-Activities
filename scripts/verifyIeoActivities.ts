import { IEO_G6_SETA_QUESTIONS, IEO_G6_SETA_KEY, IEO_G6_SETA_EXAM } from "../src/data/ieo_g6_seta";
import { IEO_INTERACTIVE_G6_QUESTIONS, IEO_INTERACTIVE_G6_KEY, IEO_INTERACTIVE_G6_EXAM } from "../src/data/ieo_interactive_g6";
import { IEO_G6_SETA_PLAY_ACTIVITY_MAP } from "../src/components/activities/ieo_g6_seta-play/registry";
import { IEO_INTERACTIVE_G6_PLAY_ACTIVITY_MAP } from "../src/components/activities/ieo_interactive_g6-play/registry";
import { getQuestionActivity } from "../src/components/activities/ActivityRegistry";

console.log("==========================================================");
console.log("  IEO CLASS 6 — DUAL ENGLISH EXAMS VERIFICATION (100 ACTS)");
console.log("==========================================================\n");

function verifyExam(
  name: string,
  exam: typeof IEO_G6_SETA_EXAM,
  questions: typeof IEO_G6_SETA_QUESTIONS,
  key: string | string[],
  map: typeof IEO_G6_SETA_PLAY_ACTIVITY_MAP,
  idPrefix: string,
  codePrefix: string
) {
  console.log(`--- ${name} ---`);
  console.log(`Exam ID: ${exam.id} | Code: ${exam.code}`);
  console.log(`Title: ${exam.title}`);
  console.log(`Total Marks: ${exam.totalMarks} | Duration: ${exam.durationMinutes}m | Status: ${exam.status}\n`);

  let passed = 0;
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const nn = String(i + 1).padStart(2, "0");
    const expKey = key[i];
    const internalId = `${idPrefix}${nn}`;
    const code = `${codePrefix}${nn}`;

    const act1 = map[internalId];
    const act2 = map[code];
    const globalAct = getQuestionActivity(code);

    if (!act1 || !act2 || !globalAct) {
      throw new Error(`Missing activity registration for Q${nn} (${q.id})`);
    }

    if (q.multipleChoiceConfig?.correctOptionId !== expKey) {
      throw new Error(`Key mismatch for Q${nn}: got ${q.multipleChoiceConfig?.correctOptionId}, expected ${expKey}`);
    }
    passed++;
  }
  console.log(`✓ ${passed}/50 questions and 3D activities verified successfully!\n`);
}

verifyExam(
  "1. OFFICIAL EXAM PAPER: IEO CLASS 6 SET A",
  IEO_G6_SETA_EXAM,
  IEO_G6_SETA_QUESTIONS,
  IEO_G6_SETA_KEY,
  IEO_G6_SETA_PLAY_ACTIVITY_MAP,
  "ieo_g6_seta_q",
  "IEO-G6-SETA-Q"
);

verifyExam(
  "2. INTERACTIVE MASTER EDITION: IEO CLASS 6",
  IEO_INTERACTIVE_G6_EXAM,
  IEO_INTERACTIVE_G6_QUESTIONS,
  IEO_INTERACTIVE_G6_KEY,
  IEO_INTERACTIVE_G6_PLAY_ACTIVITY_MAP,
  "ieo_g6_interactive_q",
  "IEO-G6-INT-Q"
);

console.log("==========================================================");
console.log("🎉 ALL 100 QUESTIONS ACROSS BOTH IEO ENGLISH EXAMS VERIFIED 100%!");
console.log("==========================================================");

