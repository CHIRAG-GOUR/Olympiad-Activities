import { test } from "node:test";
import assert from "node:assert/strict";
import type { ExamAttempt } from "@/types/attempt";
import { selectAttempts, questionStats, sectionStats, classSummary } from "@/lib/results/analysis";

let n = 0;
function attempt(student: string, marks: number, submittedAt: string, answers: [boolean, unknown, number][]): ExamAttempt {
  n++;
  return {
    id: `att_${n}`,
    examId: "exam1",
    examCode: "E1",
    examTitle: "Paper",
    subjectName: "Maths",
    student: { name: student, studentId: student },
    ownerUid: student,
    device: { ip: "", device: "", browser: "", os: "" },
    totalMarks: marks,
    maximumMarks: 3,
    scoreDisplay: `${marks}/3`,
    percentage: Math.round((marks / 3) * 100),
    isPassed: marks >= 2,
    questionEvaluations: answers.map(([ok, ans, time], i) => ({
      questionId: `q${i + 1}`,
      questionNumber: i + 1,
      questionType: "MULTIPLE_CHOICE",
      sectionTitle: i < 2 ? "Logic" : "Maths",
      maxMarks: 1,
      marksAwarded: ok ? 1 : 0,
      isCorrect: ok,
      studentAnswer: ans,
      correctAnswerSummary: "A",
      timeSpentSeconds: time,
    })),
    sectionScores: [
      { sectionTitle: "Logic", marksAwarded: answers.slice(0, 2).filter((a) => a[0]).length, maxMarks: 2, accuracyPercent: 0, questionsTotal: 2, questionsCorrect: 0 },
      { sectionTitle: "Maths", marksAwarded: answers[2][0] ? 1 : 0, maxMarks: 1, accuracyPercent: 0, questionsTotal: 1, questionsCorrect: 0 },
    ],
    totalTimeSpentSeconds: answers.reduce((s, a) => s + a[2], 0),
    timeLimitSeconds: 600,
    startedAt: submittedAt,
    submittedAt,
    submissionType: "normal",
  };
}

const a1 = attempt("asha", 1, "2026-10-01T10:00:00Z", [[true, "A", 30], [false, "B", 60], [false, "", 5]]);
const a2 = attempt("asha", 3, "2026-10-02T10:00:00Z", [[true, "A", 20], [true, "A", 40], [true, "A", 10]]);
const b1 = attempt("ben", 0, "2026-10-01T11:00:00Z", [[false, "C", 50], [false, "B", 90], [false, "", 0]]);
const c1 = attempt("cara", 2, "2026-10-01T12:00:00Z", [[true, "A", 40], [false, "B", 30], [true, "A", 20]]);
const all = [a1, a2, b1, c1];

test("retakes: count latest, best, or all attempts", () => {
  assert.deepEqual(selectAttempts(all, "latest").map((a) => a.id).sort(), [a2.id, b1.id, c1.id].sort());
  assert.deepEqual(selectAttempts(all, "best").map((a) => a.id).sort(), [a2.id, b1.id, c1.id].sort());
  assert.equal(selectAttempts(all, "all").length, 4);
  assert.equal(selectAttempts([a1, a2].reverse(), "best")[0].id, a2.id);
});

test("question analysis finds the most missed question, average time and the common wrong answer", () => {
  const stats = questionStats([a1, b1, c1]);
  const q2 = stats.find((s) => s.questionId === "q2")!;
  assert.equal(q2.correct, 0);
  assert.equal(q2.wrong, 3);
  assert.equal(q2.missedPercent, 100);
  assert.equal(q2.averageTimeSeconds, 60);
  assert.deepEqual(q2.commonWrongAnswer, { answer: "B", count: 3 });
  const q3 = stats.find((s) => s.questionId === "q3")!;
  assert.equal(q3.unanswered, 2);
  assert.equal(q3.correct, 1);
});

test("section averages and class summary", () => {
  const counted = selectAttempts(all, "latest");
  const logic = sectionStats(counted).find((s) => s.section === "Logic")!;
  assert.equal(logic.maxMarks, 2);
  assert.equal(logic.averageMarks, 1);
  const sum = classSummary(counted);
  assert.equal(sum.students, 3);
  assert.equal(sum.highestPercent, 100);
  assert.equal(sum.lowestPercent, 0);
});
