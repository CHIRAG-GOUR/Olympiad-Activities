"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { attemptRepository, reportRepository } from "@/repositories";
import { ExamAttempt } from "@/types/attempt";
import { ExamReport } from "@/types/report";
import { RedPenScoreCircle } from "@/components/examination/RedPenScoreCircle";
import { CheckedAnswerSheet, teacherRemark } from "@/components/examination/CheckedAnswerSheet";
import type { QuestionReportItem } from "@/types/report";
import type { SectionScore } from "@/types/attempt";
import { useAuth } from "@/context/AuthContext";
import { canReadAttempt, canReadReport } from "@/lib/auth/dataAccess";
import { homeFor } from "@/lib/auth/roleRoutes";
import { ROLE_PREFIX } from "@/lib/auth/sections";
import { StatusPanel } from "@/components/feedback/StatusPanel";
import { summarizeResult } from "@/engine/score-summary";
import { isSubmissionPending, retryPendingSubmissions } from "@/services/exam/SubmissionService";
import { logError, userMessageFor } from "@/lib/logger";
import { AccessRestricted } from "@/components/auth/AccessRestricted";
import { AppLoading } from "@/components/auth/AppLoading";
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  Check,
  XCircle,
  MinusCircle,
  Award,
  Clock,
  Target,
  FileSpreadsheet,
  BookOpen,
  Layers,
  BarChart3,
  HelpCircle,
  FileDown,
  ShieldCheck,
} from "lucide-react";

export default function ExamResultClient({ attemptId }: { attemptId: string }) {
  const { scope, activeRole, can } = useAuth();
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [report, setReport] = useState<ExamReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [uploadPending, setUploadPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [rep, att, pending] = await Promise.all([
          attemptId ? reportRepository.getReportByAttemptId(attemptId) : Promise.resolve(null),
          attemptId ? attemptRepository.getAttempt(attemptId) : Promise.resolve(null),
          attemptId ? isSubmissionPending(attemptId) : Promise.resolve(false),
        ]);
        if (cancelled) return;
        setReport(rep);
        setAttempt(att);
        setUploadPending(pending);
      } catch (err) {
        if (cancelled) return;
        logError("RESULT_LOAD_FAILED", { attemptId }, err);
        setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [attemptId, reloadKey]);

  // A submission made offline uploads when the connection returns; reflect that here.
  useEffect(() => {
    if (!uploadPending || !scope) return;
    const retry = async () => {
      const left = await retryPendingSubmissions(scope.userId);
      if (left === 0) setUploadPending(await isSubmissionPending(attemptId));
    };
    window.addEventListener("online", retry);
    void retry();
    return () => window.removeEventListener("online", retry);
  }, [uploadPending, scope, attemptId]);

  const handlePrint = () => {
    window.print();
  };

  const isStaff = can("result:view");
  const portalHref = `${ROLE_PREFIX[activeRole]}/results`;
  const portalLabel = isStaff ? "All results" : "My results";

  if (loading) {
    return <AppLoading label="Opening the score paper" />;
  }

  if (error) {
    return (
      <StatusPanel
        title="Unable to load this score paper"
        message={userMessageFor(error, "this score paper")}
        actions={[
          { label: portalLabel, href: portalHref },
          { label: "Retry", onClick: () => setReloadKey((n) => n + 1), primary: true },
        ]}
      />
    );
  }

  const permitted =
    (attempt !== null && canReadAttempt(scope, attempt)) ||
    (report !== null && canReadReport(scope, report));

  if ((attempt || report) && !permitted) {
    return <AccessRestricted homeHref={homeFor(activeRole)} />;
  }

  const summary = summarizeResult(report, attempt);
  if (!summary) {
    return (
      <StatusPanel
        tone="notfound"
        title="Score paper not found"
        message="No submitted examination matches this link. If you have just submitted, wait a moment and retry."
        actions={[
          { label: portalLabel, href: portalHref },
          { label: "Retry", onClick: () => setReloadKey((n) => n + 1), primary: true },
        ]}
      />
    );
  }

  const totalMarks = summary.maximum;
  const obtainedMarks = summary.obtained;
  const examTitle = report?.examTitle ?? attempt?.examTitle ?? "Olympiad Examination";
  const studentName = report?.studentName ?? attempt?.student.name ?? "Candidate";
  const studentId = attempt?.student.rollNumber ?? report?.studentId ?? attempt?.student.studentId ?? "—";
  const grade = report?.classLevel ?? attempt?.student.grade ?? "—";
  const correctCount = summary.correct;
  const totalQuestions = summary.total;
  const wrongCount = summary.wrong;
  const unansweredCount = summary.unanswered;
  const accuracy = summary.accuracy;
  const timeSpentMins = Math.round((report?.timeSpentSeconds ?? attempt?.totalTimeSpentSeconds ?? 0) / 60);

  const topicResults = report?.topicResults || [];
  // The report carries the full item list; an attempt alone (report not yet synced) is
  // turned into the same shape so the checked sheet always renders.
  const questionResults: QuestionReportItem[] =
    report?.questionResults && report.questionResults.length > 0
      ? report.questionResults
      : (attempt?.questionEvaluations || []).map((e) => ({
          questionNumber: e.questionNumber,
          questionId: e.questionId,
          questionText: "",
          questionType: e.questionType,
          section: e.sectionTitle || "General",
          subject: attempt?.subjectName || "",
          chapter: "",
          topic: "",
          difficulty: "MEDIUM",
          maxMarks: e.maxMarks,
          marksAwarded: e.marksAwarded,
          status: e.isCorrect ? "CORRECT" : e.isPartial ? "PARTIAL" : e.studentAnswer === undefined || e.studentAnswer === null || e.studentAnswer === "" ? "UNANSWERED" : "INCORRECT",
          studentAnswerFormatted: e.studentAnswer === undefined || e.studentAnswer === null ? "" : String(e.studentAnswer),
          correctAnswerFormatted: e.correctAnswerSummary,
          explanation: e.explanation,
          timeSpentSeconds: e.timeSpentSeconds,
        }));
  const sortedQuestions = [...questionResults].sort((a, b) => a.questionNumber - b.questionNumber);
  const sectionScores: SectionScore[] =
    attempt?.sectionScores && attempt.sectionScores.length > 0
      ? attempt.sectionScores
      : Object.values(
          sortedQuestions.reduce<Record<string, SectionScore>>((acc, q) => {
            const key = q.section || "General";
            const cur = acc[key] || { sectionTitle: key, marksAwarded: 0, maxMarks: 0, accuracyPercent: 0, questionsTotal: 0, questionsCorrect: 0 };
            cur.marksAwarded += Math.max(0, q.marksAwarded);
            cur.maxMarks += q.maxMarks;
            cur.questionsTotal += 1;
            if (q.status === "CORRECT") cur.questionsCorrect += 1;
            acc[key] = cur;
            return acc;
          }, {})
        );
  const attemptNumber = report?.attemptNumber || attempt?.attemptNumber || 1;
  const submittedAt = report?.submittedAt || attempt?.submittedAt;
  const checkedOn = submittedAt
    ? new Date(submittedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
    : "";
  const focus = attempt?.integrity;

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col justify-between py-6 px-3 sm:px-6 lg:px-8 font-sans print:bg-white print:p-0 select-none text-[#182338]">
      <div className="max-w-5xl mx-auto w-full flex flex-wrap items-center justify-between gap-3 text-xs text-[#667085] mb-5 print:hidden">
        <Link
          href={portalHref}
          className="h-10 px-4 bg-white border border-[#E1E7EF] hover:bg-[#EAF2FC] text-[#182338] flex items-center gap-2 font-bold rounded-xl transition-colors shadow-subtle"
        >
          <ArrowLeft className="w-4 h-4 text-[#667085]" /> {portalLabel}
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="h-10 px-5 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl flex items-center gap-2 font-bold transition-all shadow-subtle cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Download / Print Report
        </button>
      </div>

      {uploadPending && (
        <div role="status" className="max-w-5xl mx-auto w-full mb-4 p-3 rounded-xl border border-amber-200 bg-amber-50 text-[12.5px] font-semibold text-amber-900 print:hidden">
          Your paper is submitted and saved on this device. It will be sent to your teacher automatically as soon as
          this device is back online — you do not need to do anything.
        </div>
      )}

      <main className="max-w-5xl mx-auto w-full space-y-6">
        <div className="bg-white border border-[#E1E7EF] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden print:border-none print:shadow-none">
          <div className="border-b border-[#E1E7EF] pb-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#2468B2] text-white flex items-center justify-center font-black text-sm">
                <ShieldCheck className="w-5 h-5 text-[#E0AE2B]" />
              </span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#2468B2]">
                National Olympiad Digital Examination
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#182338] tracking-tight">
              {examTitle}
            </h1>

            <div className="bg-[#F4F7FB] border border-[#E1E7EF] rounded-xl p-3.5 max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-left mt-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#667085] block">Student Name</span>
                <strong className="text-xs font-extrabold text-[#182338] truncate block">{studentName}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#667085] block">Roll Number</span>
                <strong className="text-xs font-mono font-bold text-[#2468B2] block">{studentId}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#667085] block">Class / Level</span>
                <strong className="text-xs font-bold text-[#182338] block">Class {grade}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#667085] block">Attempt No.</span>
                <strong className="text-xs font-mono font-bold text-[#667085] block">
                  {String(attemptNumber).padStart(2, "0")}
                </strong>
              </div>
            </div>
          </div>

          <div className="py-6 flex flex-col items-center justify-center">
            <span className="text-[11px] uppercase font-black tracking-widest text-[#E8786A] mb-2">
              Teacher Evaluated Score
            </span>
            <RedPenScoreCircle
              scoreObtained={obtainedMarks}
              maxScore={totalMarks}
              scale={1.25}
            />
            <p className="font-hand text-[26px] text-[#B42318] mt-6 text-center leading-tight">
              {teacherRemark(summary.percentage)}
            </p>

            <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 text-xs font-bold text-[#182338] flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>Correct:</span>
                <strong className="font-mono text-emerald-700 font-extrabold">{correctCount}</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <span>Wrong:</span>
                <strong className="font-mono text-rose-700 font-extrabold">{wrongCount}</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#667085]" />
                <span>Unanswered:</span>
                <strong className="font-mono text-[#667085] font-extrabold">{unansweredCount}</strong>
              </div>
              {Boolean((attempt?.hintsCount ?? report?.hintsCount ?? 0) > 0) && (
                <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Hints:</span>
                  <strong className="font-mono text-rose-700 font-extrabold">
                    {attempt?.hintsCount ?? report?.hintsCount} (-{attempt?.hintPenalty ?? report?.hintPenalty} marks)
                  </strong>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-4 border-t border-[#E1E7EF] text-center">
            <div className="bg-[#F4F7FB] border border-[#E1E7EF] rounded-xl p-3">
              <span className="text-[10px] font-bold uppercase text-[#667085] block">Percentage</span>
              <strong className="text-lg font-mono font-black text-[#182338] block">
                {summary.percentage}%
              </strong>
            </div>
            <div className="bg-[#F4F7FB] border border-[#E1E7EF] rounded-xl p-3">
              <span className="text-[10px] font-bold uppercase text-[#667085] block">Accuracy</span>
              <strong className="text-lg font-mono font-black text-[#2468B2] block">{accuracy}%</strong>
            </div>
            <div className="bg-[#F4F7FB] border border-[#E1E7EF] rounded-xl p-3">
              <span className="text-[10px] font-bold uppercase text-[#667085] block">Items Solved</span>
              <strong className="text-lg font-mono font-black text-[#182338] block">
                {correctCount}/{totalQuestions}
              </strong>
            </div>
            <div className="bg-[#F4F7FB] border border-[#E1E7EF] rounded-xl p-3">
              <span className="text-[10px] font-bold uppercase text-[#667085] block">Time Spent</span>
              <strong className="text-lg font-mono font-black text-[#182338] block">{timeSpentMins} min</strong>
            </div>
          </div>

          {Boolean((attempt?.hintsCount ?? report?.hintsCount ?? 0) > 0) && (
            <div className="max-w-2xl mx-auto mt-3 p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl text-center text-xs text-amber-900 font-semibold flex items-center justify-center gap-2">
              <span>💡</span>
              <span>
                <strong>{attempt?.hintsCount ?? report?.hintsCount} hint{(attempt?.hintsCount ?? report?.hintsCount) === 1 ? "" : "s"}</strong> used during this exam ({attempt?.hintPenalty ?? report?.hintPenalty} marks deducted: 0.5 for 1-mark questions, 1.5 for 3-mark questions).
              </span>
            </div>
          )}

          {isStaff && focus && (
            <p
              className={`max-w-2xl mx-auto mt-4 text-center text-xs font-bold rounded-xl border px-3 py-2 ${
                focus.tabSwitches + focus.fullscreenExits > 0
                  ? "text-rose-800 bg-rose-50 border-rose-200"
                  : "text-emerald-800 bg-emerald-50 border-emerald-200"
              }`}
            >
              {focus.tabSwitches + focus.fullscreenExits > 0
                ? `During this sitting the student left the exam window ${focus.tabSwitches} time${focus.tabSwitches === 1 ? "" : "s"} and full screen ${focus.fullscreenExits} time${focus.fullscreenExits === 1 ? "" : "s"}.`
                : "The student stayed in the exam window for the whole sitting."}
            </p>
          )}
        </div>

        {topicResults.length > 0 && (
          <div className="bg-white border border-[#E1E7EF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E1E7EF] pb-3">
              <BarChart3 className="w-5 h-5 text-[#2468B2]" />
              <h2 className="text-base font-extrabold text-[#182338]">Topic-Wise Performance Breakdown</h2>
            </div>

            <div className="overflow-x-auto border border-[#E1E7EF] rounded-xl">
              <table className="w-full text-left text-xs font-semibold">
                <thead className="bg-[#F4F7FB] text-[#667085] border-b border-[#E1E7EF] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Topic / Chapter</th>
                    <th className="p-3 text-center">Correct</th>
                    <th className="p-3 text-center">Total</th>
                    <th className="p-3 text-center">Marks</th>
                    <th className="p-3 text-right">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E7EF] text-[#182338]">
                  {topicResults.map((t, idx) => (
                    <tr key={idx} className="hover:bg-[#F4F7FB]/60">
                      <td className="p-3 font-bold text-[#182338]">
                        {t.topic}
                        <span className="block text-[10px] font-medium text-[#667085]">{t.chapter}</span>
                      </td>
                      <td className="p-3 text-center font-mono text-emerald-700 font-bold">{t.correctQuestions}</td>
                      <td className="p-3 text-center font-mono">{t.totalQuestions}</td>
                      <td className="p-3 text-center font-mono font-bold text-[#2468B2]">
                        +{t.marksAwarded} / {t.maxMarks}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-[#F4F7FB] border border-[#E1E7EF] h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                t.accuracyPercentage >= 80
                                  ? "bg-[#2468B2]"
                                  : t.accuracyPercentage >= 50
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                              }`}
                              style={{ width: `${t.accuracyPercentage}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-xs">{t.accuracyPercentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {sortedQuestions.length > 0 ? (
          <CheckedAnswerSheet
            questions={sortedQuestions}
            sections={sectionScores}
            percentage={summary.percentage}
            checkedOn={checkedOn}
          />
        ) : (
          <div className="bg-white border border-[#E1E7EF] rounded-3xl p-6 text-xs text-[#667085] text-center">
            No detailed items recorded for this paper.
          </div>
        )}

        <div className="text-center text-xs text-[#667085] pb-8 print:hidden">
          Official Digital Examination Record • Evaluated by Central Olympiad Scoring Engine
        </div>
      </main>
    </div>
  );
}
