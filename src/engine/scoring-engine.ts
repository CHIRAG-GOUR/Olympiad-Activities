import { Question, QuestionAnswerPayload, QuestionDifficulty } from "@/types/question";
import { Exam } from "@/types/exam";
import { ExamAttempt, QuestionEvaluationResult, SectionScore } from "@/types/attempt";
import { StudentMetadata, DeviceInfo } from "@/types/session";
import { ExamReport, QuestionReportItem, TopicReportItem, DifficultyReportItem } from "@/types/report";
import { evaluateAnswer, formatStudentAnswerSummary, getCorrectAnswerSummary } from "./answer-evaluator";

export interface ScoreEngineInput {
  exam: Exam;
  questions: Question[];
  answers: Record<string, any>;
  timeSpentMap: Record<string, number>; // questionId -> seconds
  student: StudentMetadata;
  device: DeviceInfo;
  startedAt: string;
  submittedAt: string;
  submissionType?: "normal" | "auto_timeout" | "force_submit";
  attemptNumber?: number;
  /**
   * Deterministic id for this sitting (see ExamPersistenceService.attemptIdFor). Supplying
   * it makes submission idempotent: a retry produces the same attempt, never a second one.
   */
  attemptId?: string;
  /** Question IDs where hints were unlocked during the exam (costs -1 mark each, max 4). */
  hintsUsed?: string[];
}

export interface ScoreEngineResult {
  attempt: ExamAttempt;
  report: ExamReport;
}

export function computeExamAttemptScore(input: ScoreEngineInput): ExamAttempt {
  const { attempt } = evaluateAndGenerateFullResult(input);
  return attempt;
}

export function evaluateAndGenerateFullResult(input: ScoreEngineInput): ScoreEngineResult {
  const { exam, questions, answers, timeSpentMap, student, device, startedAt, submittedAt, submissionType = "normal" } = input;
  const hintsUsed = input.hintsUsed || [];

  let totalMarksAwarded = 0;
  let maximumPossibleMarks = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;
  let totalTimeSpentSeconds = 0;

  const questionEvaluations: QuestionEvaluationResult[] = [];
  const questionReports: QuestionReportItem[] = [];

  const sectionAggregates: Record<
    string,
    { marksAwarded: number; maxMarks: number; total: number; correct: number }
  > = {};

  const topicAggregates: Record<
    string,
    {
      topic: string;
      chapter: string;
      subject: string;
      total: number;
      attempted: number;
      correct: number;
      wrong: number;
      marksAwarded: number;
      maxMarks: number;
    }
  > = {};

  const difficultyAggregates: Record<
    QuestionDifficulty,
    { total: number; correct: number }
  > = {
    EASY: { total: 0, correct: 0 },
    MEDIUM: { total: 0, correct: 0 },
    HARD: { total: 0, correct: 0 },
    ACHIEVER: { total: 0, correct: 0 },
  };

  questions.forEach((q, index) => {
    // Normalise answer payload
    const rawVal = answers[q.id];
    const payload: QuestionAnswerPayload | null =
      rawVal !== undefined && rawVal !== null && rawVal !== ""
        ? {
            questionId: q.id,
            type: q.questionType,
            answer: typeof rawVal === "object" && "answer" in rawVal ? rawVal.answer : rawVal,
            timestamp: Date.now(),
            timeSpentSeconds: timeSpentMap[q.id] || 0,
          }
        : null;

    const outcome = evaluateAnswer(q, payload);
    const timeSpent = timeSpentMap[q.id] || 0;
    totalTimeSpentSeconds += timeSpent;

    const maxMarks = q.marks || 1;
    maximumPossibleMarks += maxMarks;
    totalMarksAwarded += outcome.marksAwarded;

    const isAttempted = payload !== null;
    let status: "CORRECT" | "INCORRECT" | "UNANSWERED" | "PARTIAL" = "UNANSWERED";

    if (!isAttempted) {
      unansweredCount++;
      status = "UNANSWERED";
    } else if (outcome.isCorrect) {
      correctCount++;
      status = "CORRECT";
    } else if (outcome.isPartial) {
      status = "PARTIAL";
    } else {
      wrongCount++;
      status = "INCORRECT";
    }

    // Section Aggregates
    const sectionTitle = q.section || "General";
    if (!sectionAggregates[sectionTitle]) {
      sectionAggregates[sectionTitle] = { marksAwarded: 0, maxMarks: 0, total: 0, correct: 0 };
    }
    sectionAggregates[sectionTitle].maxMarks += maxMarks;
    sectionAggregates[sectionTitle].total += 1;
    if (outcome.isCorrect) {
      sectionAggregates[sectionTitle].correct += 1;
    }

    // Topic Aggregates
    const topicKey = `${q.chapter || "General"}__${q.topic || "Core"}`;
    if (!topicAggregates[topicKey]) {
      topicAggregates[topicKey] = {
        topic: q.topic || "Core",
        chapter: q.chapter || "General",
        subject: q.subjectName || exam.subjectName || "Mathematics",
        total: 0,
        attempted: 0,
        correct: 0,
        wrong: 0,
        marksAwarded: 0,
        maxMarks: 0,
      };
    }
    topicAggregates[topicKey].total += 1;
    topicAggregates[topicKey].maxMarks += maxMarks;
    if (isAttempted) topicAggregates[topicKey].attempted += 1;
    if (outcome.isCorrect) topicAggregates[topicKey].correct += 1;
    if (status === "INCORRECT") topicAggregates[topicKey].wrong += 1;

    // Difficulty Aggregates
    const diff = q.difficulty || "MEDIUM";
    if (difficultyAggregates[diff]) {
      difficultyAggregates[diff].total += 1;
      if (outcome.isCorrect) difficultyAggregates[diff].correct += 1;
    }

    const isHintUsed = hintsUsed.includes(q.id);
    const qHintPenalty = isHintUsed ? (maxMarks >= 3 ? 1.5 : 0.5) : 0;
    const effectiveQuestionMarks = outcome.isCorrect
      ? Math.max(0, Math.round((maxMarks - qHintPenalty) * 10) / 10)
      : 0;

    // Section Aggregates marks
    sectionAggregates[sectionTitle].marksAwarded += effectiveQuestionMarks;
    topicAggregates[topicKey].marksAwarded += effectiveQuestionMarks;

    const studentAnswerFormatted = formatStudentAnswerSummary(q, payload?.answer);
    const correctAnswerFormatted = outcome.correctAnswerSummary || getCorrectAnswerSummary(q);

    questionEvaluations.push({
      questionId: q.id,
      questionNumber: index + 1,
      questionType: q.questionType,
      sectionTitle: q.section,
      maxMarks,
      marksAwarded: effectiveQuestionMarks,
      isCorrect: outcome.isCorrect,
      isPartial: outcome.isPartial,
      studentAnswer: payload?.answer ?? null,
      correctAnswerSummary: correctAnswerFormatted,
      explanation: q.explanation,
      timeSpentSeconds: timeSpent,
      hintUsed: isHintUsed,
      hintPenalty: qHintPenalty,
    });

    questionReports.push({
      questionNumber: index + 1,
      questionId: q.id,
      questionText: q.questionText,
      questionType: q.questionType,
      section: q.section || "General",
      subject: q.subjectName || exam.subjectName || "Mathematics",
      chapter: q.chapter || "General",
      topic: q.topic || "General Topic",
      difficulty: q.difficulty || "MEDIUM",
      maxMarks,
      marksAwarded: effectiveQuestionMarks,
      status,
      studentAnswerFormatted,
      correctAnswerFormatted,
      explanation: q.explanation,
      timeSpentSeconds: timeSpent,
      hintUsed: isHintUsed,
      hintPenalty: qHintPenalty,
    });
  });

  const hintsCount = hintsUsed.length;

  // Question-specific hint penalties:
  // For each question which is of 1 mark: on hint will only get 1/2 (0.5 marks deduction)
  // For each question which is of 3 marks: cut 1 & half mark in it for taking hint (1.5 marks deduction)
  let hintPenaltyRaw = 0;
  hintsUsed.forEach((qId) => {
    const q = questions.find((item) => item.id === qId);
    const qMarks = q?.marks || 1;
    if (qMarks >= 3) {
      hintPenaltyRaw += 1.5;
    } else {
      hintPenaltyRaw += 0.5;
    }
  });
  const hintPenalty = Math.round(hintPenaltyRaw * 10) / 10;
  const finalTotalMarks = Math.max(0, Math.round((totalMarksAwarded - hintPenalty) * 10) / 10);
  const percentage = maximumPossibleMarks > 0 ? Math.round((finalTotalMarks / maximumPossibleMarks) * 100) : 0;
  const attemptedCount = questions.length - unansweredCount;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
  const isPassed = finalTotalMarks >= (exam.passingMarks || Math.round(maximumPossibleMarks * 0.4));

  const sectionScores: SectionScore[] = Object.entries(sectionAggregates).map(([sectionTitle, data]) => ({
    sectionTitle,
    marksAwarded: data.marksAwarded,
    maxMarks: data.maxMarks,
    accuracyPercent: data.maxMarks > 0 ? Math.round((data.marksAwarded / data.maxMarks) * 100) : 0,
    questionsTotal: data.total,
    questionsCorrect: data.correct,
  }));

  const topicResults: TopicReportItem[] = Object.values(topicAggregates).map((t) => ({
    topic: t.topic,
    chapter: t.chapter,
    subject: t.subject,
    totalQuestions: t.total,
    attemptedQuestions: t.attempted,
    correctQuestions: t.correct,
    wrongQuestions: t.wrong,
    marksAwarded: t.marksAwarded,
    maxMarks: t.maxMarks,
    accuracyPercentage: t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0,
  }));

  const difficultyResults: DifficultyReportItem[] = (
    ["EASY", "MEDIUM", "HARD", "ACHIEVER"] as QuestionDifficulty[]
  ).map((d) => {
    const agg = difficultyAggregates[d];
    return {
      difficulty: d,
      total: agg.total,
      correct: agg.correct,
      accuracy: agg.total > 0 ? Math.round((agg.correct / agg.total) * 100) : 0,
    };
  });

  const attemptId = input.attemptId || `att_${exam.id}_${student.studentId}_${Date.now()}`;
  const reportId = `rep_${attemptId}`;

  const attempt: ExamAttempt = {
    id: attemptId,
    examId: exam.id,
    examCode: exam.code,
    examTitle: exam.title,
    subjectName: exam.subjectName,
    student,
    device,
    totalMarks: finalTotalMarks,
    maximumMarks: maximumPossibleMarks,
    scoreDisplay: `${finalTotalMarks}/${maximumPossibleMarks}`,
    percentage,
    isPassed,
    correctCount,
    wrongCount,
    unansweredCount,
    accuracy,
    questionEvaluations,
    sectionScores,
    totalTimeSpentSeconds,
    timeLimitSeconds: (exam.durationMinutes || 60) * 60,
    startedAt,
    submittedAt,
    submissionType,
    hintsUsed,
    hintsCount,
    hintPenalty,
  };

  const report: ExamReport = {
    reportId,
    attemptId,
    examId: exam.id,
    examTitle: exam.title,
    examCode: exam.code,
    subject: exam.subjectName,
    classLevel: exam.grade || 6,
    studentId: student.studentId,
    studentName: student.name,
    schoolName: student.schoolName || "Olympiad Academy",
    attemptNumber: input.attemptNumber || 1,
    startedAt,
    submittedAt,
    totalDurationMinutes: exam.durationMinutes,
    timeSpentSeconds: totalTimeSpentSeconds,
    totalQuestions: questions.length,
    attemptedQuestions: attemptedCount,
    correctAnswers: correctCount,
    wrongAnswers: wrongCount,
    unansweredQuestions: unansweredCount,
    hintsUsed,
    hintsCount,
    hintPenalty,
    totalMarks: maximumPossibleMarks,
    obtainedMarks: finalTotalMarks,
    percentage,
    accuracy,
    isPassed,
    topicResults,
    difficultyResults,
    questionResults: questionReports,
    lastKnownIp: device.ip,
    generatedAt: submittedAt,
    version: 1,
  };

  return { attempt, report };
}
