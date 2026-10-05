import type { ExamAttempt } from "@/types/attempt";
import type { ExamReport } from "@/types/report";

/**
 * The one way a score is summarised for display.
 *
 * The scoring engine decides marks; this only reads its output. Every screen that shows
 * "Correct / Wrong / Unanswered / Accuracy" (score paper, results ledger, dashboards,
 * analytics) calls this, so the same attempt can never show different numbers in
 * different places.
 *
 *   percentage = marks obtained ÷ maximum marks
 *   accuracy   = correct ÷ attempted
 */
export interface ScoreSummary {
  obtained: number;
  maximum: number;
  percentage: number;
  correct: number;
  wrong: number;
  partial: number;
  unanswered: number;
  attempted: number;
  total: number;
  accuracy: number;
}

const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0);

export function summarizeAttempt(attempt: ExamAttempt): ScoreSummary {
  const evals = attempt.questionEvaluations || [];
  const total = evals.length;
  const unanswered =
    attempt.unansweredCount ?? evals.filter((q) => q.studentAnswer === null || q.studentAnswer === undefined).length;
  const correct = attempt.correctCount ?? evals.filter((q) => q.isCorrect).length;
  const partial = evals.filter((q) => !q.isCorrect && q.isPartial).length;
  const wrong = attempt.wrongCount ?? Math.max(0, total - unanswered - correct - partial);
  const attempted = total - unanswered;
  return {
    obtained: attempt.totalMarks,
    maximum: attempt.maximumMarks,
    percentage: attempt.percentage ?? pct(attempt.totalMarks, attempt.maximumMarks),
    correct,
    wrong,
    partial,
    unanswered,
    attempted,
    total,
    accuracy: attempt.accuracy ?? pct(correct, attempted),
  };
}

export function summarizeReport(report: ExamReport): ScoreSummary {
  const partial = Math.max(
    0,
    report.totalQuestions - report.correctAnswers - report.wrongAnswers - report.unansweredQuestions
  );
  return {
    obtained: report.obtainedMarks,
    maximum: report.totalMarks,
    percentage: report.percentage,
    correct: report.correctAnswers,
    wrong: report.wrongAnswers,
    partial,
    unanswered: report.unansweredQuestions,
    attempted: report.attemptedQuestions,
    total: report.totalQuestions,
    accuracy: report.accuracy,
  };
}

/** The report is the authoritative record; the attempt is used when no report exists. */
export function summarizeResult(report: ExamReport | null | undefined, attempt: ExamAttempt | null | undefined): ScoreSummary | null {
  if (report) return summarizeReport(report);
  if (attempt) return summarizeAttempt(attempt);
  return null;
}
