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
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#0B4F8A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-900 font-bold">Evaluating Olympiad Paper & Compiling Official Ledger...</p>
          <p className="text-xs text-slate-500">Calculating teacher scores, topic analytics, and answer breakdowns</p>
        </div>
      </div>
    );
  }

  if (!attempt && !report) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6 font-sans">
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-8 max-w-lg text-center space-y-4 shadow-xl">
          <h2 className="text-xl font-bold text-slate-900">Score Paper Not Found</h2>
          <p className="text-xs text-slate-600">
            The requested examination attempt record could not be located in local storage or IndexedDB.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-10 px-6 bg-[#0B4F8A] text-white rounded-lg text-xs font-bold shadow hover:bg-[#083863]"
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
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col justify-between py-6 px-3 sm:px-6 lg:px-8 font-sans print:bg-white print:p-0">
      {/* Top Action Bar */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between text-xs text-slate-600 mb-5 print:hidden">
        <Link
          href="/"
          className="h-10 px-4 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 flex items-center gap-2 font-bold rounded-lg transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" /> Return to Portal
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/results"
            className="h-10 px-4 bg-white border border-slate-300 hover:bg-slate-100 text-[#0B4F8A] flex items-center gap-2 font-bold rounded-lg transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" /> All Results Ledger
          </Link>

          <button
            type="button"
            onClick={handlePrint}
            className="h-10 px-5 bg-[#0B4F8A] hover:bg-[#083863] text-white rounded-lg flex items-center gap-2 font-black transition-colors shadow cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Download / Print Report
          </button>
        </div>
      </div>

      {/* Main Examination Result Surface */}
      <main className="max-w-5xl mx-auto w-full space-y-6">
        {/* SECTION 1: Paper Header & Teacher Red Pen Check (Requirements 14, 15) */}
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-10 shadow-lg relative overflow-hidden print:border-none print:shadow-none">
          {/* Header */}
          <div className="border-b-2 border-slate-200 pb-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#0B4F8A] text-white flex items-center justify-center font-black text-sm">
                &Omega;
              </span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#0B4F8A]">
                National Olympiad Digital Examination
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {examTitle}
            </h1>

            {/* Candidate Metadata Strip */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-left mt-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Student Name</span>
                <strong className="text-xs font-extrabold text-slate-900 truncate block">{studentName}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Roll Number</span>
                <strong className="text-xs font-mono font-bold text-[#0B4F8A] block">{studentId}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Class / Level</span>
                <strong className="text-xs font-bold text-slate-900 block">Class {grade}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Attempt No.</span>
                <strong className="text-xs font-mono font-bold text-slate-700 block">01 (Final)</strong>
              </div>
            </div>
          </div>

          {/* Teacher Evaluated Score (Red Pen Circle) */}
          <div className="py-6 flex flex-col items-center justify-center">
            <span className="text-[11px] uppercase font-black tracking-widest text-[#C62828] mb-2">
              Teacher Evaluated Score
            </span>
            <RedPenScoreCircle
              scoreObtained={obtainedMarks}
              maxScore={totalMarks}
              scale={1.25}
            />

            {/* Below circle breakdown (Requirement 15) */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs font-bold text-slate-700">
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
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span>Unanswered:</span>
                <strong className="font-mono text-slate-600 font-extrabold">{unansweredCount}</strong>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2 border-t border-slate-200 text-center">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Percentage</span>
              <strong className="text-lg font-mono font-black text-slate-900 block">
                {Math.round((obtainedMarks / Math.max(1, totalMarks)) * 100)}%
              </strong>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Accuracy</span>
              <strong className="text-lg font-mono font-black text-emerald-700 block">{accuracy}%</strong>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Items Solved</span>
              <strong className="text-lg font-mono font-black text-slate-900 block">
                {correctCount}/{totalQuestions}
              </strong>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Time Spent</span>
              <strong className="text-lg font-mono font-black text-slate-900 block">{timeSpentMins} min</strong>
            </div>
          </div>
        </div>

        {/* SECTION 2: Topic Performance Analytics (Requirement 16) */}
        {topicResults.length > 0 && (
          <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-md space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <BarChart3 className="w-5 h-5 text-[#0B4F8A]" />
              <h2 className="text-base font-black text-slate-900">Topic-Wise Performance Breakdown</h2>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs font-semibold">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Topic / Chapter</th>
                    <th className="p-3 text-center">Correct</th>
                    <th className="p-3 text-center">Total</th>
                    <th className="p-3 text-center">Marks</th>
                    <th className="p-3 text-right">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {topicResults.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">
                        {t.topic}
                        <span className="block text-[10px] font-medium text-slate-500">{t.chapter}</span>
                      </td>
                      <td className="p-3 text-center font-mono text-emerald-700 font-bold">{t.correctQuestions}</td>
                      <td className="p-3 text-center font-mono">{t.totalQuestions}</td>
                      <td className="p-3 text-center font-mono font-bold text-[#0B4F8A]">
                        +{t.marksAwarded} / {t.maxMarks}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                t.accuracyPercentage >= 80
                                  ? "bg-emerald-600"
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

        {/* SECTION 3: Itemized Question-by-Question Review (Requirements 17, 18) */}
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#0B4F8A]" />
              <h2 className="text-base font-black text-slate-900">Itemized Question Analysis</h2>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
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
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isCorrect
                        ? "bg-emerald-50/40 border-emerald-200"
                        : isUnanswered
                        ? "bg-slate-50 border-slate-200"
                        : "bg-rose-50/40 border-rose-200"
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 font-mono text-sm">
                          Q{String(q.questionNumber).padStart(2, "0")}
                        </span>
                        <span className="text-slate-400">|</span>
                        <span className="font-bold text-slate-600">{q.section}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-[11px] font-medium text-slate-500">{q.topic}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-emerald-800 font-extrabold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct (+{q.marksAwarded})
                          </span>
                        ) : isUnanswered ? (
                          <span className="inline-flex items-center gap-1 text-slate-600 font-bold bg-slate-200 px-2 py-0.5 rounded text-[11px]">
                            <MinusCircle className="w-3.5 h-3.5 text-slate-500" /> Unanswered (0)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-800 font-extrabold bg-rose-100 px-2 py-0.5 rounded text-[11px]">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Incorrect ({q.marksAwarded})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Text */}
                    <p className="text-xs text-slate-800 font-semibold mb-3">{q.questionText}</p>

                    {/* Answers Comparison Box */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white/80 p-3 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Candidate Answer:</span>
                        <span
                          className={`font-bold font-mono ${
                            isCorrect ? "text-emerald-700" : isUnanswered ? "text-slate-500" : "text-rose-700"
                          }`}
                        >
                          {q.studentAnswerFormatted}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Correct Answer:</span>
                        <span className="font-bold font-mono text-[#0B4F8A]">{q.correctAnswerFormatted}</span>
                      </div>
                    </div>

                    {q.explanation && (
                      <div className="mt-2 text-[11px] text-slate-600 bg-slate-100/70 p-2 rounded border border-slate-200">
                        <strong className="text-slate-800 font-bold">Explanation: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-500 text-center py-4">No detailed items recorded.</div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 pb-8 print:hidden">
          Official Digital Examination Record • Evaluated by Central Olympiad Scoring Engine
        </div>
      </main>
    </div>
  );
}
