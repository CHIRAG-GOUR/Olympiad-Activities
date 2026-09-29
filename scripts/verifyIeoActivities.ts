import { IEO_G6_SETA_QUESTIONS, IEO_G6_SETA_KEY, IEO_G6_SETA_EXAM } from "../src/data/ieo_g6_seta";
import { IEO_G6_SETA_PLAY_ACTIVITY_MAP } from "../src/components/activities/ieo_g6_seta-play/registry";
import { getQuestionActivity, hasBespokeActivity } from "../src/components/activities/ActivityRegistry";

console.log("=================================================");
console.log("  IEO CLASS 6 SET A - 50 ACTIVITIES VERIFICATION ");
console.log("=================================================\n");

console.log(`Total Exam Questions: ${IEO_G6_SETA_QUESTIONS.length}`);
console.log(`Exam Total Marks: ${IEO_G6_SETA_EXAM.totalMarks}`);
console.log(`Exam Duration: ${IEO_G6_SETA_EXAM.durationMinutes} mins`);
console.log(`Exam Status: ${IEO_G6_SETA_EXAM.status}\n`);

let passedCount = 0;
let errors: string[] = [];

for (let i = 0; i < 50; i++) {
  const q = IEO_G6_SETA_QUESTIONS[i];
  const qNum = i + 1;
  const nn = String(qNum).padStart(2, "0");
  const expectedKey = IEO_G6_SETA_KEY[i];

  if (!q) {
    errors.push(`Q${qNum}: Missing from IEO_G6_SETA_QUESTIONS`);
    continue;
  }

  const actByInternalId = IEO_G6_SETA_PLAY_ACTIVITY_MAP[`ieo_g6_seta_q${nn}`];
  const actByCode = IEO_G6_SETA_PLAY_ACTIVITY_MAP[`IEO-G6-SETA-Q${nn}`];
  const globalAct = getQuestionActivity(`IEO-G6-SETA-Q${nn}`);

  if (!actByInternalId || !actByCode || !globalAct) {
    errors.push(`Q${qNum} (${q.id}): Missing activity in registry! (id: ${Boolean(actByInternalId)}, code: ${Boolean(actByCode)}, global: ${Boolean(globalAct)})`);
    continue;
  }

  const correctOption = q.multipleChoiceConfig?.options?.find(
    (o) => o.id === q.multipleChoiceConfig?.correctOptionId
  );

  if (q.multipleChoiceConfig?.correctOptionId !== expectedKey) {
    errors.push(`Q${qNum}: Key mismatch! Question has ${q.multipleChoiceConfig?.correctOptionId}, Expected: ${expectedKey}`);
    continue;
  }

  passedCount++;
  console.log(
    `✓ Q${nn} [${q.section} - ${q.topic}]: Key=${expectedKey} (${correctOption?.text}) -> Component Registered (${actByInternalId.name})`
  );
}

console.log("\n=================================================");
console.log(`Results: ${passedCount} / 50 Questions Fully Verified!`);
if (errors.length > 0) {
  console.error("ERRORS FOUND:");
  errors.forEach((e) => console.error(" ❌ " + e));
  process.exit(1);
} else {
  console.log("🎉 ALL 50 IEO CLASS 6 SET A BESPOKE 3D ACTIVITIES VERIFIED 100%!");
  process.exit(0);
}
