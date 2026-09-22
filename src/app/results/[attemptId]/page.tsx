"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { attemptRepository, reportRepository } from "@/repositories";
import { ExamAttempt } from "@/types/attempt";
import { ExamReport } from "@/types/report";
import { RedPenScoreCircle } from "@/components/examination/RedPenScoreCircle";
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
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

export default function ExamResultScorePage({ params }: { params: Promise<{ attemptId: string }> }) {
  const resolvedParams = use(params);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [report, setReport] = useState<ExamReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [rep, att] = await Promise.all([
          reportRepository.getReportByAttemptId(resolvedParams.attemptId),
          attemptRepository.getAttempt(resolvedParams.attemptId),
        ]);
        setReport(rep);
        setAttempt(att);
      } catch (err) {
        console.error("Failed to load result:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resolvedParams.attemptId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7EE] flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#4D741F] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[#172033] font-bold">Evaluating Olympiad Paper & Compiling Official Ledger...</p>
          <p className="text-xs text-[#667085]">Calculating teacher scores, topic analytics, and answer breakdowns</p>
        </div>
      </div>
    );
  }

  if (!attempt && !report) {
    return (
      <div className="min-h-screen bg-[#F4F7EE] flex items-center justify-center p-6 font-sans">
        <div className="bg-white border border-[#DDE4D7] rounded-2xl p-8 max-w-lg text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#172033]">Score Paper Not Found</h2>
          <p className="text-xs text-[#667085]">
            The requested examination attempt record could not be located in local storage or IndexedDB.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-10 px-6 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Examination Portal
          </Link>
        </div>
      </div>
    );
  }

  // Derive counts and metrics from report or attempt
  const totalMarks = report?.totalMarks ?? attempt?.maximumMarks ?? 60;
  const obtainedMarks = report?.obtainedMarks ?? attempt?.totalMarks ?? 0;
  const examTitle = report?.examTitle ?? attempt?.examTitle ?? "SOF IMO Examination";
  const studentName = report?.studentName ?? attempt?.student.name ?? "Candidate";
  const studentId = report?.studentId ?? attempt?.student.studentId ?? "STU-000";
  const grade = report?.classLevel ?? attempt?.student.grade ?? 6;
  const examCode = report?.examCode ?? attempt?.examCode ?? "IMO-G6-2025";
  const correctCount = report?.correctAnswers ?? attempt?.questionEvaluations.filter((q) => q.isCorrect).length ?? 0;
  const totalQuestions = report?.totalQuestions ?? attempt?.questionEvaluations.length ?? 50;
  const wrongCount = report?.wrongAnswers ?? Math.max(0, (attempt?.questionEvaluations.filter((q) => !q.isCorrect && q.studentAnswer !== null).length || 0));
  const unansweredCount = report?.unansweredQuestions ?? Math.max(0, totalQuestions - (correctCount + wrongCount));
  const accuracy = report?.accuracy ?? (correctCount + wrongCount > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0);
  const timeSpentMins = Math.round((report?.timeSpentSeconds ?? attempt?.totalTimeSpentSeconds ?? 0) / 60);

  const topicResults = report?.topicResults || [];
  const questionResults = report?.questionResults || [];

  return (
    <div className="min-h-screen bg-[#F4F7EE] flex flex-col justify-between py-6 px-3 sm:px-6 lg:px-8 font-sans print:bg-white print:p-0 select-none text-[#172033]">
      {/* Top Action Bar */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between text-xs text-[#667085] mb-5 print:hidden">
        <Link
          href="/"
          className="h-10 px-4 bg-white border border-[#DDE4D7] hover:bg-[#EEF5E7] text-[#172033] flex items-center gap-2 font-bold rounded-xl transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#667085]" /> Return to Portal
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/results"
            className="h-10 px-4 bg-white border border-[#DDE4D7] hover:bg-[#EEF5E7] text-[#4D741F] flex items-center gap-2 font-bold rounded-xl transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" /> All Results Ledger
          </Link>

          <button
            type="button"
            onClick={handlePrint}
            className="h-10 px-5 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl flex items-center gap-2 font-bold transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Download / Print Report
          </button>
        </div>
      </div>

      {/* Main Examination Result Surface */}
      <main className="max-w-5xl mx-auto w-full space-y-6">
        {/* SECTION 1: Paper Header & Teacher Red Pen Check (Requirements 19, 20, 21) */}
        <div className="bg-white border border-[#DDE4D7] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden print:border-none print:shadow-none">
          {/* Header */}
          <div className="border-b border-[#DDE4D7] pb-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#4D741F] text-white flex items-center justify-center font-black text-sm">
                <ShieldCheck className="w-5 h-5 text-[#F4C400]" />
              </span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#4D741F]">
                National Olympiad Digital Examination
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight">
              {examTitle}
            </h1>

            {/* Candidate Metadata Strip */}
            <div className="bg-[#F6F9F1] border border-[#DDE4D7] rounded-xl p-3.5 max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-left mt-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#667085] block">Student Name</span>
                <strong className="text-xs font-extrabold text-[#172033] truncate block">{studentName}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#667085] block">Roll Number</span>
                <strong className="text-xs font-mono font-bold text-[#4D741F] block">{studentId}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#667085] block">Class / Level</span>
                <strong className="text-xs font-bold text-[#172033] block">Class {grade}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#667085] block">Attempt No.</span>
                <strong className="text-xs font-mono font-bold text-[#667085] block">01 (Final)</strong>
              </div>
            </div>
          </div>

          {/* Teacher Evaluated Score (Red Pen Circle - Requirement 20) */}
          <div className="py-6 flex flex-col items-center justify-center">
            <span className="text-[11px] uppercase font-black tracking-widest text-[#C62828] mb-2">
              Teacher Evaluated Score
            </span>
            <RedPenScoreCircle
              scoreObtained={obtainedMarks}
              maxScore={totalMarks}
              scale={1.25}
            />

            {/* Below circle breakdown (Requirement 21) */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs font-bold text-[#172033]">
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
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-4 border-t border-[#DDE4D7] text-center">
            <div className="bg-[#F6F9F1] border border-[#DDE4D7] rounded-xl p-3">
              <span className="text-[10px] font-bold uppercase text-[#667085] block">Percentage</span>
              <strong className="text-lg font-mono font-black text-[#172033] block">
                {Math.round((obtainedMarks / Math.max(1, totalMarks)) * 100)}%
              </strong>
            </div>
            <div className="bg-[#F6F9F1] border border-[#DDE4D7] rounded-xl p-3">
              <span className="text-[10px] font-bold uppercase text-[#667085] block">Accuracy</span>
              <strong className="text-lg font-mono font-black text-[#4D741F] block">{accuracy}%</strong>
            </div>
            <div className="bg-[#F6F9F1] border border-[#DDE4D7] rounded-xl p-3">
              <span className="text-[10px] font-bold uppercase text-[#667085] block">Items Solved</span>
              <strong className="text-lg font-mono font-black text-[#172033] block">
                {correctCount}/{totalQuestions}
              </strong>
            </div>
            <div className="bg-[#F6F9F1] border border-[#DDE4D7] rounded-xl p-3">
              <span className="text-[10px] font-bold uppercase text-[#667085] block">Time Spent</span>
              <strong className="text-lg font-mono font-black text-[#172033] block">{timeSpentMins} min</strong>
            </div>
          </div>
        </div>

        {/* SECTION 2: Topic Performance Analytics (Requirement 22) */}
        {topicResults.length > 0 && (
          <div className="bg-white border border-[#DDE4D7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#DDE4D7] pb-3">
              <BarChart3 className="w-5 h-5 text-[#4D741F]" />
              <h2 className="text-base font-extrabold text-[#172033]">Topic-Wise Performance Breakdown</h2>
            </div>

            <div className="overflow-x-auto border border-[#DDE4D7] rounded-xl">
              <table className="w-full text-left text-xs font-semibold">
                <thead className="bg-[#F6F9F1] text-[#667085] border-b border-[#DDE4D7] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Topic / Chapter</th>
                    <th className="p-3 text-center">Correct</th>
                    <th className="p-3 text-center">Total</th>
                    <th className="p-3 text-center">Marks</th>
                    <th className="p-3 text-right">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE4D7] text-[#172033]">
                  {topicResults.map((t, idx) => (
                    <tr key={idx} className="hover:bg-[#F6F9F1]/60">
                      <td className="p-3 font-bold text-[#172033]">
                        {t.topic}
                        <span className="block text-[10px] font-medium text-[#667085]">{t.chapter}</span>
                      </td>
                      <td className="p-3 text-center font-mono text-emerald-700 font-bold">{t.correctQuestions}</td>
                      <td className="p-3 text-center font-mono">{t.totalQuestions}</td>
                      <td className="p-3 text-center font-mono font-bold text-[#4D741F]">
                        +{t.marksAwarded} / {t.maxMarks}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-[#F6F9F1] border border-[#DDE4D7] h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                t.accuracyPercentage >= 80
                                  ? "bg-[#4D741F]"
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

        {/* SECTION 3: Itemized Question-by-Question Review (Requirement 23) */}
        <div className="bg-white border border-[#DDE4D7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#DDE4D7] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#4D741F]" />
              <h2 className="text-base font-extrabold text-[#172033]">Itemized Question Analysis</h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#667085]">
              {questionResults.length || attempt?.questionEvaluations.length || 0} Questions Evaluated
            </span>
          </div>

          <div className="space-y-4">
            {questionResults.length > 0 ? (
              questionResults.map((q) => {
                const isCorrect = q.status === "CORRECT";
                const isUnanswered = q.status === "UNANSWERED";

                return (
                  <div
                    key={q.questionId}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCorrect
                        ? "bg-emerald-50/40 border-emerald-200"
                        : isUnanswered
                        ? "bg-[#F6F9F1] border-[#DDE4D7]"
                        : "bg-rose-50/40 border-rose-200"
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#172033] font-mono text-sm">
                          Q{String(q.questionNumber).padStart(2, "0")}
                        </span>
                        <span className="text-[#667085]">•</span>
                        <span className="font-bold text-[#172033]">{q.section}</span>
                        <span className="text-[#667085]">•</span>
                        <span className="text-[11px] font-medium text-[#667085]">{q.topic}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-emerald-800 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct (+{q.marksAwarded})
                          </span>
                        ) : isUnanswered ? (
                          <span className="inline-flex items-center gap-1 text-[#667085] font-bold bg-[#EEF5E7] px-2 py-0.5 rounded-md text-[11px]">
                            <MinusCircle className="w-3.5 h-3.5 text-[#667085]" /> Unanswered (0)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-800 font-extrabold bg-rose-100 px-2 py-0.5 rounded-md text-[11px]">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Incorrect ({q.marksAwarded})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Text */}
                    <p className="text-xs text-[#172033] font-semibold mb-3">{q.questionText}</p>

                    {/* Answers Comparison Box */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-[#DDE4D7]">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#667085] block">Candidate Answer:</span>
                        <span
                          className={`font-bold font-mono ${
                            isCorrect ? "text-emerald-700" : isUnanswered ? "text-[#667085]" : "text-rose-700"
                          }`}
                        >
                          {q.studentAnswerFormatted}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#667085] block">Correct Answer:</span>
                        <span className="font-bold font-mono text-[#4D741F]">{q.correctAnswerFormatted}</span>
                      </div>
                    </div>

                    {q.explanation && (
                      <div className="mt-2 text-[11px] text-[#667085] bg-[#F6F9F1] p-2.5 rounded-xl border border-[#DDE4D7]">
                        <strong className="text-[#172033] font-bold">Explanation: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-[#667085] text-center py-4">No detailed items recorded.</div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-[#667085] pb-8 print:hidden">
          Official Digital Examination Record • Evaluated by Central Olympiad Scoring Engine
        </div>
      </main>
    </div>
  );
}
