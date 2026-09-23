import { Exam } from "@/types/exam";
import { ExamAttempt } from "@/types/attempt";
import { Question } from "@/types/question";
import { hasBespokeActivity } from "@/components/activities/ActivityRegistry";
import type { MotifKind, InteractionKind } from "@/components/ui/OlympiadArt";

/**
 * Dashboard derivations.
 *
 * Every figure the dashboard shows is computed here from the real repositories — the
 * question bank, graded attempts and live examination sessions. Nothing is seeded with
 * placeholder numbers: where there is no data yet, these return empty/null and the UI
 * says so plainly.
 */

/** Shape of a persisted exam session as stored by ExamPersistenceService. */
export interface LiveSession {
  sessionId: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  schoolName?: string;
  startedAt: string;
  durationMinutes: number;
  lastSavedAt: string;
  currentQuestionIndex: number;
  answers?: Record<string, unknown>;
  markedForReview?: string[];
  status: string;
}

/* ── Syllabus sections ────────────────────────────────────── */

export interface SectionInsight {
  title: string;
  motif: MotifKind;
  questionCount: number;
  activityCount: number;
  /** Average accuracy across graded attempts, or null when nothing is graded yet */
  accuracy: number | null;
  difficultyMix: { easy: number; medium: number; hard: number; achiever: number };
}

function motifForSection(title: string): MotifKind {
  const t = title.toLowerCase();
  if (t.includes("logical") || t.includes("reasoning") && !t.includes("math")) return "logic";
  if (t.includes("everyday")) return "everyday";
  if (t.includes("achiever")) return "achiever";
  if (t.includes("math")) return "geometry";
  return "numbers";
}

export function buildSectionInsights(questions: Question[], attempts: ExamAttempt[]): SectionInsight[] {
  const byTitle = new Map<string, SectionInsight>();

  for (const q of questions) {
    const title = q.section || q.chapter || "General";
    let entry = byTitle.get(title);
    if (!entry) {
      entry = {
        title,
        motif: motifForSection(title),
        questionCount: 0,
        activityCount: 0,
        accuracy: null,
        difficultyMix: { easy: 0, medium: 0, hard: 0, achiever: 0 },
      };
      byTitle.set(title, entry);
    }
    entry.questionCount += 1;
    if (hasBespokeActivity(q.id) || hasBespokeActivity(q.questionId)) entry.activityCount += 1;
    const d = q.difficulty;
    if (d === "EASY") entry.difficultyMix.easy += 1;
    else if (d === "MEDIUM") entry.difficultyMix.medium += 1;
    else if (d === "HARD") entry.difficultyMix.hard += 1;
    else if (d === "ACHIEVER") entry.difficultyMix.achiever += 1;
  }

  // Fold in measured accuracy from graded attempts
  const agg = new Map<string, { correct: number; total: number }>();
  for (const att of attempts) {
    for (const s of att.sectionScores || []) {
      const cur = agg.get(s.sectionTitle) || { correct: 0, total: 0 };
      cur.correct += s.questionsCorrect;
      cur.total += s.questionsTotal;
      agg.set(s.sectionTitle, cur);
    }
  }
  for (const [title, entry] of byTitle) {
    const a = agg.get(title);
    if (a && a.total > 0) entry.accuracy = Math.round((a.correct / a.total) * 100);
  }

  return Array.from(byTitle.values()).sort((a, b) => b.questionCount - a.questionCount);
}

/* ── Activity previews ────────────────────────────────────── */

export interface ActivityPreview {
  questionId: string;
  topic: string;
  section: string;
  kind: InteractionKind;
  blurb: string;
}

const KIND_BLURB: Record<InteractionKind, string> = {
  rotate: "Turn the solid and read the hidden face",
  plot: "Move the marker onto the right value",
  arrange: "Drag the pieces into the right order",
  simulate: "Set the parameter and run it",
  construct: "Build the figure line by line",
  measure: "Measure it off the instrument",
};

/** Classify what a question's activity actually asks the student to do. */
export function interactionKindFor(q: Question): InteractionKind {
  const topic = (q.topic || "").toLowerCase();
  const text = (q.questionText || "").toLowerCase();

  if (q.questionType === "SIMULATION") return "simulate";
  if (topic.includes("spatial") || topic.includes("symmetry")) return "rotate";
  if (topic.includes("lines") || topic.includes("angles")) return "construct";
  if (topic.includes("perimeter") || topic.includes("area") || topic.includes("measurement")) return "measure";
  if (q.questionType === "ORDERING" || q.questionType === "CLASSIFICATION" || q.questionType === "MATCHING")
    return "arrange";
  if (topic.includes("pattern") || topic.includes("matri")) return "arrange";
  if (text.includes("graph") || topic.includes("data")) return "plot";
  if (topic.includes("integer") || topic.includes("fraction") || topic.includes("decimal")) return "measure";
  return "plot";
}

/**
 * Pick a spread of real questions that have a bespoke activity, favouring variety of
 * interaction so the preview row shows what the platform can actually do.
 */
export function buildActivityPreviews(questions: Question[], limit = 6): ActivityPreview[] {
  const withActivity = questions.filter((q) => hasBespokeActivity(q.id) || hasBespokeActivity(q.questionId));
  const seen = new Set<InteractionKind>();
  const picked: ActivityPreview[] = [];

  const push = (q: Question) => {
    const kind = interactionKindFor(q);
    picked.push({
      questionId: q.questionId || q.id,
      topic: q.topic || q.chapter || "Olympiad",
      section: q.section || "",
      kind,
      blurb: KIND_BLURB[kind],
    });
    seen.add(kind);
  };

  // First pass: one of each distinct interaction
  for (const q of withActivity) {
    if (picked.length >= limit) break;
    if (!seen.has(interactionKindFor(q))) push(q);
  }
  // Second pass: fill remaining slots
  for (const q of withActivity) {
    if (picked.length >= limit) break;
    if (!picked.some((p) => p.questionId === (q.questionId || q.id))) push(q);
  }

  return picked;
}

/* ── Examinations ─────────────────────────────────────────── */

export interface ExamInsight {
  exam: Exam;
  questionCount: number;
  completed: number;
  inProgress: number;
  participants: number;
  avgScore: number | null;
  passRate: number | null;
  /** Shortest remaining time among live sessions on this exam, in seconds */
  soonestRemainingSeconds: number | null;
}

export function remainingSecondsFor(session: LiveSession): number {
  const started = new Date(session.startedAt).getTime();
  const elapsed = (Date.now() - started) / 1000;
  return Math.max(0, Math.round(session.durationMinutes * 60 - elapsed));
}

export function buildExamInsights(
  exams: Exam[],
  attempts: ExamAttempt[],
  sessions: LiveSession[],
  totalQuestionsFallback: number
): ExamInsight[] {
  return exams.map((exam) => {
    const examAttempts = attempts.filter((a) => a.examId === exam.id);
    const live = sessions.filter((s) => s.examId === exam.id && s.status === "in_progress");
    const completed = examAttempts.length;
    const remaining = live.map(remainingSecondsFor).filter((r) => r > 0);

    return {
      exam,
      questionCount: exam.questionIds.length || exam.totalQuestions || totalQuestionsFallback,
      completed,
      inProgress: live.length,
      participants: completed + live.length,
      avgScore:
        completed > 0
          ? Math.round(examAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / completed)
          : null,
      passRate:
        completed > 0
          ? Math.round((examAttempts.filter((a) => a.isPassed).length / completed) * 100)
          : null,
      soonestRemainingSeconds: remaining.length ? Math.min(...remaining) : null,
    };
  });
}

/* ── Formatting helpers ───────────────────────────────────── */

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((v) => String(v).padStart(2, "0")).join(":");
}

export function greetingFor(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function firstName(fullName?: string): string {
  if (!fullName) return "there";
  const cleaned = fullName.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i, "").trim();
  return cleaned.split(/\s+/)[0] || "there";
}

/* ── Analytics derivations ────────────────────────────────── */

/** Accent assigned to each syllabus section, kept stable across the dashboard. */
export const SECTION_TONES = ["#2468B2", "#8067D9", "#F29A38", "#55B987", "#59B6DE", "#E8786A"];

export function toneForIndex(i: number) {
  return SECTION_TONES[i % SECTION_TONES.length];
}

/** Score spread across graded attempts, bucketed into bands. Empty when nothing graded. */
export function buildScoreDistribution(attempts: ExamAttempt[]) {
  if (!attempts.length) return [];
  const bands = [
    { label: "0–39", min: 0, max: 39, tone: "#E8786A" },
    { label: "40–59", min: 40, max: 59, tone: "#F29A38" },
    { label: "60–74", min: 60, max: 74, tone: "#F4C542" },
    { label: "75–89", min: 75, max: 89, tone: "#59B6DE" },
    { label: "90–100", min: 90, max: 100, tone: "#55B987" },
  ];
  return bands.map((b) => ({
    label: b.label,
    tone: b.tone,
    value: attempts.filter((a) => a.percentage >= b.min && a.percentage <= b.max).length,
  }));
}

/** Submissions per day over the recent window — only days that actually have records. */
export function buildParticipationTrend(attempts: ExamAttempt[], days = 7) {
  if (!attempts.length) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const out: { label: string; value: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    const count = attempts.filter((a) => {
      const t = new Date(a.submittedAt).getTime();
      return t >= day.getTime() && t < next.getTime();
    }).length;
    out.push({ label: day.toLocaleDateString(undefined, { weekday: "short" }), value: count });
  }
  return out;
}

/** How far through their paper the live candidates currently are. */
export function buildLiveCompletion(sessions: LiveSession[], totalByExam: Record<string, number>) {
  const live = sessions.filter((s) => s.status === "in_progress");
  if (!live.length) return null;
  const answered = live.reduce((sum, s) => sum + Object.keys(s.answers || {}).length, 0);
  const capacity = live.reduce((sum, s) => sum + (totalByExam[s.examId] || 0), 0);
  return {
    answered,
    capacity,
    percent: capacity > 0 ? Math.round((answered / capacity) * 100) : 0,
    candidates: live.length,
  };
}

/** Difficulty spread of the question bank. */
export function buildDifficultyMix(questions: Question[]) {
  if (!questions.length) return [];
  const counts: Record<string, number> = {};
  for (const q of questions) counts[q.difficulty] = (counts[q.difficulty] || 0) + 1;
  const order = [
    { key: "EASY", label: "Easy", tone: "#55B987" },
    { key: "MEDIUM", label: "Medium", tone: "#59B6DE" },
    { key: "HARD", label: "Hard", tone: "#F29A38" },
    { key: "ACHIEVER", label: "Achiever", tone: "#8067D9" },
  ];
  return order
    .filter((o) => counts[o.key])
    .map((o) => ({ label: o.label, value: counts[o.key], tone: o.tone }));
}
