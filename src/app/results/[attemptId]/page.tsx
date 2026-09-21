"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { OlympiadStore } from "@/services/firebase/firestore";
import { ExamAttempt } from "@/types/attempt";
import { RedPenScoreCircle } from "@/components/examination/RedPenScoreCircle";
import { ArrowLeft, Printer, CheckCircle2, Home, Award, Clock, Target, ShieldCheck, FileSpreadsheet } from "lucide-react";

export default function ExamResultScorePage({ params }: { params: Promise<{ attemptId: string }> }) {
  const resolvedParams = use(params);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await OlympiadStore.getAttemptById(resolvedParams.attemptId);
      setAttempt(data);
      setLoading(false);
    }
    load();
  }, [resolvedParams.attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-olympiad-bg flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-olympiad-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[14px] text-navy-900 font-bold">Generating Official Score Paper...</p>
          <p className="text-[12px] text-olympiad-textMuted">Evaluating candidate manipulatives and calculating teacher score</p>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-olympiad-bg flex items-center justify-center p-6">
        <div className="bg-white border border-olympiad-border rounded-lg p-10 max-w-lg text-center space-y-5 shadow-subtle">
          <h2 className="text-xl font-bold text-navy-900">Score Paper Not Found</h2>
          <p className="text-[14px] text-olympiad-textMuted">
            The requested examination attempt record could not be located in the ledger.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-[46px] px-6 bg-olympiad-deep text-white rounded-md text-[14px] font-bold shadow-xs hover:bg-navy-900"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Examination Portal
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF7ED] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Top action bar */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between text-[13px] text-slate-600 mb-6 print:hidden">
        <Link
          href="/"
          className="h-[42px] px-4 bg-white border-2 border-[#FDE68A] hover:bg-[#FEF3C7] text-slate-800 flex items-center gap-2 font-bold rounded-xl transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#D97706]" /> Return to Examination Portal
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/results"
            className="h-[42px] px-4 bg-white border-2 border-[#D4E0C2] hover:bg-[#F4F7EE] text-[#3E5519] flex items-center gap-2 font-bold rounded-xl transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#547322]" /> Admin Ledger
          </Link>

          <button
            type="button"
            onClick={handlePrint}
            className="h-[42px] px-5 bg-[#547322] hover:bg-[#435C1B] text-white rounded-xl flex items-center gap-2 font-extrabold transition-colors shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Score Paper
          </button>
        </div>
      </div>

      {/* Main Examination Paper Result Surface */}
      <main className="max-w-4xl mx-auto w-full my-auto">
        <div className="bg-[#FFFDF5] border-2 border-[#FDE68A] rounded-2xl p-8 sm:p-12 lg:p-14 shadow-lg text-center space-y-8 relative overflow-hidden">
          {/* Subtle paper header */}
          <div className="space-y-3 border-b-2 border-[#FDE68A] pb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#0B4F8A] text-white flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-[#F59E0B]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L3 6V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V6L12 2Z" fill="#0B4F8A" stroke="#FFD84D" strokeWidth="1.5" />
                  <path d="M12 6L14 10H18L15 13L16 17L12 14.5L8 17L9 13L6 10H10L12 6Z" fill="#F4C400" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#B45309]">
                  National Olympiad Examination Council
                </div>
                <div className="text-[13px] font-extrabold text-slate-800">
                  Official Candidate Performance Evaluation Record
                </div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-2">
              {attempt.examTitle}
            </h1>

            {/* Candidate Metadata Strip */}
            <div className="bg-[#FEF3C7]/80 border-2 border-[#FDE68A] rounded-xl p-4 max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div>
                <span className="text-[11px] uppercase font-bold text-[#92400E] block">Candidate</span>
                <span className="text-[14px] font-extrabold text-slate-900 truncate block">{attempt.student.name}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-[#92400E] block">Roll Number</span>
                <span className="text-[13px] font-mono font-extrabold text-slate-900 block">{attempt.student.studentId}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-[#92400E] block">Grade / Level</span>
                <span className="text-[13px] font-extrabold text-slate-900 block">Grade {attempt.student.grade}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-[#92400E] block">Exam Code</span>
                <span className="text-[13px] font-mono font-extrabold text-[#B45309] block">{attempt.examCode}</span>
              </div>
            </div>
          </div>

          {/* THE RED-PEN CIRCLED SCORE (Primary Focus) */}
          <div className="py-2 flex flex-col items-center justify-center">
            <div className="text-[12px] uppercase font-extrabold tracking-widest text-[#C62828] mb-2">
              Teacher Evaluated Score
            </div>
            <RedPenScoreCircle
              scoreObtained={attempt.totalMarks}
              maxScore={attempt.maximumMarks}
              scale={1.2}
            />
          </div>

          {/* Detailed Performance Statistics Cards */}
          {(() => {
            const correctCount = attempt.questionEvaluations.filter((q) => q.isCorrect).length;
            const totalCount = attempt.questionEvaluations.length;
            const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : attempt.percentage;

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
                <div className="bg-white border-2 border-[#FDE68A] rounded-xl p-4 text-center shadow-xs">
                  <span className="text-[11px] font-extrabold uppercase text-[#92400E] block">Percentage</span>
                  <strong className="text-[22px] font-extrabold font-mono text-slate-900 mt-0.5 block">{attempt.percentage}%</strong>
                </div>
                <div className="bg-white border-2 border-[#FDE68A] rounded-xl p-4 text-center shadow-xs">
                  <span className="text-[11px] font-extrabold uppercase text-[#92400E] block">Accuracy</span>
                  <strong className="text-[22px] font-extrabold font-mono text-emerald-700 mt-0.5 block">{accuracy}%</strong>
                </div>
                <div className="bg-white border-2 border-[#FDE68A] rounded-xl p-4 text-center shadow-xs">
                  <span className="text-[11px] font-extrabold uppercase text-[#92400E] block">Correct Items</span>
                  <strong className="text-[22px] font-extrabold font-mono text-slate-900 mt-0.5 block">
                    {correctCount}/{totalCount}
                  </strong>
                </div>
                <div className="bg-white border-2 border-[#FDE68A] rounded-xl p-4 text-center shadow-xs">
                  <span className="text-[11px] font-extrabold uppercase text-[#92400E] block">Time Taken</span>
                  <strong className="text-[22px] font-extrabold font-mono text-slate-900 mt-0.5 block">
                    {Math.round(attempt.totalTimeSpentSeconds / 60)} min
                  </strong>
                </div>
              </div>
            );
          })()}

          {/* Supporting Ledger Verification */}
          <div className="space-y-2 pt-4 border-t-2 border-[#FDE68A] text-xs text-slate-500">
            <div className="flex items-center justify-center gap-2 text-emerald-700 font-extrabold text-[14px]">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Official Evaluation Verified & Stored
            </div>
            <div className="text-[12px] font-mono text-slate-500 font-semibold">
              Record Hash: #{attempt.id.slice(-10).toUpperCase()} • Submitted:{" "}
              {new Date(attempt.submittedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
            <Link
              href="/"
              className="w-full sm:w-auto h-[46px] px-6 bg-[#547322] hover:bg-[#435C1B] text-white rounded-xl text-[14px] font-extrabold flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Home className="w-4 h-4" /> Examination Portal Home
            </Link>
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto h-[46px] px-6 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 rounded-xl text-[14px] font-extrabold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Printer className="w-4 h-4 text-slate-950" /> Print Official Paper
            </button>
          </div>
        </div>
      </main>

      <footer className="text-center text-[12px] text-slate-500 pt-6">
        Official Digital Examination Record • Olympiad Examination Council • Academic Standard
      </footer>
    </div>
  );
}
