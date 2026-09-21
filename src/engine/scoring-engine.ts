import { Question, QuestionAnswerPayload } from "@/types/question";
import { Exam } from "@/types/exam";
import { ExamAttempt, QuestionEvaluationResult, SectionScore } from "@/types/attempt";
import { StudentMetadata, DeviceInfo } from "@/types/session";
import { evaluateAnswer } from "./answer-evaluator";

export interface ScoreEngineInput {
  exam: Exam;
  questions: Question[];
  answers: Record<string, QuestionAnswerPayload>;
  timeSpentMap: Record<string, number>; // questionId -> seconds
  student: StudentMetadata;
  device: DeviceInfo;
  startedAt: string;
  submittedAt: string;
  submissionType?: "normal" | "auto_timeout" | "force_submit";
}

export function computeExamAttemptScore(input: ScoreEngineInput): ExamAttempt {
  const { exam, questions, answers, timeSpentMap, student, device, startedAt, submittedAt, submissionType = "normal" } = input;

  let totalMarksAwarded = 0;
  let maximumPossibleMarks = 0;
  const questionEvaluations: QuestionEvaluationResult[] = [];
  const sectionAggregates: Record<
    string,
    { marksAwarded: number; maxMarks: number; total: number; correct: number }
  > = {};

  let totalTimeSpentSeconds = 0;

  questions.forEach((q, index) => {
    const payload = answers[q.id];
    const outcome = evaluateAnswer(q, payload);
    const timeSpent = timeSpentMap[q.id] || 0;
    totalTimeSpentSeconds += timeSpent;

    const maxMarks = q.marks || 1;
    maximumPossibleMarks += maxMarks;
    totalMarksAwarded += outcome.marksAwarded;

    const sectionTitle = q.section || "General";
    if (!sectionAggregates[sectionTitle]) {
      sectionAggregates[sectionTitle] = { marksAwarded: 0, maxMarks: 0, total: 0, correct: 0 };
    }
    sectionAggregates[sectionTitle].maxMarks += maxMarks;
    sectionAggregates[sectionTitle].marksAwarded += Math.max(0, outcome.marksAwarded);
    sectionAggregates[sectionTitle].total += 1;
    if (outcome.isCorrect) {
      sectionAggregates[sectionTitle].correct += 1;
    }

    questionEvaluations.push({
      questionId: q.id,
      questionNumber: index + 1,
      questionType: q.questionType,
      sectionTitle: q.section,
      maxMarks,
      marksAwarded: outcome.marksAwarded,
      isCorrect: outcome.isCorrect,
      isPartial: outcome.isPartial,
      studentAnswer: payload?.answer ?? null,
      correctAnswerSummary: outcome.correctAnswerSummary,
      explanation: q.explanation,
      timeSpentSeconds: timeSpent,
    });
  });

  // Ensure totalMarks doesn't drop below 0 unless specific negative rules allow
  const finalTotalMarks = Math.max(0, totalMarksAwarded);
  const percentage = maximumPossibleMarks > 0 ? Math.round((finalTotalMarks / maximumPossibleMarks) * 100) : 0;
  const isPassed = finalTotalMarks >= (exam.passingMarks || Math.round(maximumPossibleMarks * 0.4));

  const sectionScores: SectionScore[] = Object.entries(sectionAggregates).map(([sectionTitle, data]) => ({
    sectionTitle,
    marksAwarded: data.marksAwarded,
    maxMarks: data.maxMarks,
    accuracyPercent: data.maxMarks > 0 ? Math.round((data.marksAwarded / data.maxMarks) * 100) : 0,
    questionsTotal: data.total,
    questionsCorrect: data.correct,
  }));

  const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  return {
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
    questionEvaluations,
    sectionScores,
    totalTimeSpentSeconds,
    timeLimitSeconds: (exam.durationMinutes || 60) * 60,
    startedAt,
    submittedAt,
    submissionType,
  };
}
