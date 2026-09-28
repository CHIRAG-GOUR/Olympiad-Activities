import { SEED_EXAMS, SEED_QUESTIONS } from "../src/lib/seedData";
import { getQuestionActivity, hasBespokeActivity } from "../src/components/activities/ActivityRegistry";

console.log("================================================================================");
console.log(`TOTAL EXAMS IN SEED_EXAMS: ${SEED_EXAMS.length}`);
console.log(`TOTAL QUESTIONS IN SEED_QUESTIONS: ${SEED_QUESTIONS.length}`);
console.log("================================================================================\n");

const qMap = new Map(SEED_QUESTIONS.map((q) => [q.id, q]));

SEED_EXAMS.forEach((exam, idx) => {
  console.log(`\n────────────────────────────────────────────────────────────────────────────────`);
  console.log(`EXAM #${idx + 1}: [${exam.id}] "${exam.title}" (Code: ${exam.code})`);
  console.log(`Total configured questionIds: ${exam.questionIds.length}`);
  
  let missing = 0;
  let missingActivities = 0;
  
  exam.questionIds.forEach((qId, qIdx) => {
    const qObj = qMap.get(qId);
    if (!qObj) {
      missing++;
      if (missing <= 3) console.log(`  ❌ Missing question in SEED_QUESTIONS: ${qId} (at index ${qIdx})`);
    } else {
      const hasAct = hasBespokeActivity(qObj.id) || hasBespokeActivity(qObj.questionId);
      if (!hasAct) {
        missingActivities++;
      }
    }
  });

  const firstQ = qMap.get(exam.questionIds[0]);
  const lastQ = qMap.get(exam.questionIds[exam.questionIds.length - 1]);

  console.log(`  • First Q: [${exam.questionIds[0]}] -> "${firstQ?.questionText?.slice(0, 60)}..."`);
  console.log(`  • Last Q:  [${exam.questionIds[exam.questionIds.length - 1]}] -> "${lastQ?.questionText?.slice(0, 60)}..."`);
  console.log(`  • Missing question objects: ${missing}`);
  console.log(`  • Missing bespoke activities: ${missingActivities} / ${exam.questionIds.length}`);
});
