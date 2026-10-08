import type { ExamAttempt } from "@/types/attempt";

/**
 * Class results and question analysis, computed from submitted attempts.
 *
 * With retakes allowed a student can have several attempts at one paper; `CountPolicy`
 * decides which of them count, so one student never weighs more than another.
 */

export type CountPolicy = "latest" | "best" | "all";

const studentKey = (a: ExamAttempt) => a.ownerUid || a.student?.studentId || a.student?.name || a.id;

/** The attempts that count under the policy: one per student per paper, unless "all". */
export function selectAttempts(attempts: ExamAttempt[], policy: CountPolicy): ExamAttempt[] {
  if (policy === "all") return attempts.slice();
  const chosen = new Map<string, ExamAttempt>();
  for (const a of attempts) {
    const key = `${a.examId}::${studentKey(a)}`;
    const cur = chosen.get(key);
    if (!cur) {
      chosen.set(key, a);
      continue;
    }
    const better =
      policy === "best"
        ? a.totalMarks > cur.totalMarks ||
          (a.totalMarks === cur.totalMarks && new Date(a.submittedAt).getTime() > new Date(cur.submittedAt).getTime())
        : new Date(a.submittedAt).getTime() > new Date(cur.submittedAt).getTime();
    if (better) chosen.set(key, a);
  }
  return Array.from(chosen.values());
}

export interface ClassSummary {
  students: number;
  attempts: number;
  averageMarks: number;
  maximumMarks: number;
  averagePercent: number;
  highestPercent: number;
  lowestPercent: number;
  passRate: number;
  averageTimeMinutes: number;
  /** Attempts where the student left the exam window or full screen at least once. */
  flaggedForFocus: number;
}

const round1 = (n: number) => Math.round(n * 10) / 10;
const avg = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);

export function classSummary(attempts: ExamAttempt[]): ClassSummary {
  const pcts = attempts.map((a) => a.percentage || 0);
  return {
    students: new Set(attempts.map(studentKey)).size,
    attempts: attempts.length,
    averageMarks: round1(avg(attempts.map((a) => a.totalMarks || 0))),
    maximumMarks: Math.max(0, ...attempts.map((a) => a.maximumMarks || 0)),
    averagePercent: round1(avg(pcts)),
    highestPercent: pcts.length ? Math.max(...pcts) : 0,
    lowestPercent: pcts.length ? Math.min(...pcts) : 0,
    passRate: attempts.length ? Math.round((attempts.filter((a) => a.isPassed).length / attempts.length) * 100) : 0,
    averageTimeMinutes: round1(avg(attempts.map((a) => (a.totalTimeSpentSeconds || 0) / 60))),
    flaggedForFocus: attempts.filter((a) => (a.integrity?.tabSwitches || 0) + (a.integrity?.fullscreenExits || 0) > 0).length,
  };
}

export interface QuestionStat {
  examId: string;
  questionNumber: number;
  questionId: string;
  section: string;
  answered: number;
  correct: number;
  wrong: number;
  unanswered: number;
  /** Share of counted attempts that got it right, in percent. */
  correctPercent: number;
  /** Share that got it wrong or left it, in percent — "most missed" sorts on this. */
  missedPercent: number;
  averageTimeSeconds: number;
  /** The wrong answer chosen most often, when one stands out. */
  commonWrongAnswer?: { answer: string; count: number };
}

const isBlank = (v: unknown) =>
  v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0) ||
  (typeof v === "object" && !Array.isArray(v) && Object.keys(v as object).length === 0);

const answerText = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : JSON.stringify(v));

/** Per-question statistics, grouped by paper, in question order. */
export function questionStats(attempts: ExamAttempt[]): QuestionStat[] {
  const acc = new Map<string, QuestionStat & { times: number[]; wrongAnswers: Map<string, number> }>();
  for (const a of attempts) {
    for (const e of a.questionEvaluations || []) {
      const key = `${a.examId}::${e.questionId}`;
      let st = acc.get(key);
      if (!st) {
        st = {
          examId: a.examId,
          questionNumber: e.questionNumber,
          questionId: e.questionId,
          section: e.sectionTitle || "General",
          answered: 0,
          correct: 0,
          wrong: 0,
          unanswered: 0,
          correctPercent: 0,
          missedPercent: 0,
          averageTimeSeconds: 0,
          times: [],
          wrongAnswers: new Map(),
        };
        acc.set(key, st);
      }
      st.times.push(e.timeSpentSeconds || 0);
      if (e.isCorrect) {
        st.correct += 1;
        st.answered += 1;
      } else if (isBlank(e.studentAnswer)) {
        st.unanswered += 1;
      } else {
        st.wrong += 1;
        st.answered += 1;
        const text = answerText(e.studentAnswer);
        st.wrongAnswers.set(text, (st.wrongAnswers.get(text) || 0) + 1);
      }
    }
  }
  return Array.from(acc.values())
    .map(({ times, wrongAnswers, ...st }) => {
      const total = st.correct + st.wrong + st.unanswered;
      const top = Array.from(wrongAnswers.entries()).sort((x, y) => y[1] - x[1])[0];
      return {
        ...st,
        correctPercent: total ? Math.round((st.correct / total) * 100) : 0,
        missedPercent: total ? Math.round(((st.wrong + st.unanswered) / total) * 100) : 0,
        averageTimeSeconds: Math.round(avg(times)),
        ...(top && top[1] >= 2 ? { commonWrongAnswer: { answer: top[0], count: top[1] } } : {}),
      };
    })
    .sort((x, y) => (x.examId === y.examId ? x.questionNumber - y.questionNumber : x.examId.localeCompare(y.examId)));
}

export interface SectionStat {
  examId: string;
  section: string;
  maxMarks: number;
  averageMarks: number;
  averagePercent: number;
  questions: number;
}

/** How the class did in each section of each paper. */
export function sectionStats(attempts: ExamAttempt[]): SectionStat[] {
  const acc = new Map<string, { examId: string; section: string; maxMarks: number; marks: number[]; questions: number }>();
  for (const a of attempts) {
    for (const s of a.sectionScores || []) {
      const key = `${a.examId}::${s.sectionTitle}`;
      const cur = acc.get(key) || { examId: a.examId, section: s.sectionTitle, maxMarks: s.maxMarks, marks: [], questions: s.questionsTotal };
      cur.maxMarks = Math.max(cur.maxMarks, s.maxMarks);
      cur.questions = Math.max(cur.questions, s.questionsTotal);
      cur.marks.push(s.marksAwarded);
      acc.set(key, cur);
    }
  }
  return Array.from(acc.values()).map((c) => {
    const average = avg(c.marks);
    return {
      examId: c.examId,
      section: c.section,
      maxMarks: c.maxMarks,
      averageMarks: round1(average),
      averagePercent: c.maxMarks ? Math.round((average / c.maxMarks) * 100) : 0,
      questions: c.questions,
    };
  });
}

/** "4m 05s" style duration for tables. */
export function formatSeconds(total: number): string {
  const s = Math.max(0, Math.round(total));
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${String(s % 60).padStart(2, "0")}s` : `${s}s`;
}
