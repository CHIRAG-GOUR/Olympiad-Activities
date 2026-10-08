"use client";

import { resultRoute } from "@/lib/routes";
import { useAuth } from "@/context/AuthContext";
import { ROLE_PREFIX } from "@/lib/auth/sections";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { attemptRepository, reportRepository, examRepository } from "@/repositories";
import { ExamAttempt } from "@/types/attempt";
import { ExamReport } from "@/types/report";
import { Exam } from "@/types/exam";
import {
  Search,
  Award,
  FileText,
  Filter,
  Calendar,
  Layers,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ArrowRight,
  Printer,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { invalidate } from "@/repositories/cache";
import { selectAttempts, type CountPolicy } from "@/lib/results/analysis";
import { ResultsAnalysisPanel } from "./ResultsAnalysisPanel";
import { FileSpreadsheet } from "lucide-react";

export default function ResultsScreen() {
  // Links resolve into the route group the active role actually owns.
  const { activeRole } = useAuth();
  const roleBase = ROLE_PREFIX[activeRole];
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [reports, setReports] = useState<ExamReport[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<"all" | "math" | "english">("all");
  const [selectedExamId, setSelectedExamId] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  /** With retakes, which of a student's attempts count in the analysis and export. */
  const [countPolicy, setCountPolicy] = useState<CountPolicy>("latest");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const loadData = async (forceInvalidate = false) => {
    if (forceInvalidate) {
      invalidate("attempts:", "reports:");
    }
    const [attList, repList, exList] = await Promise.allSettled([
      attemptRepository.listAttempts(),
      reportRepository.listReports(),
      examRepository.listExams(),
    ]);
    if (attList.status === "fulfilled") setAttempts(attList.value);
    if (repList.status === "fulfilled") setReports(repList.value);
    if (exList.status === "fulfilled") setExams(exList.value);
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData(false);
    // Real-time synchronization every 8 seconds so teachers & admins see newly submitted student attempts immediately
    const interval = setInterval(() => {
      loadData(true);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadData(true);
  };

  // Filtered List with Strict Classwise and Subjectwise sorting
  const filteredAttempts = attempts.filter((att) => {
    const matchesSearch =
      att.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (att.student.schoolName && att.student.schoolName.toLowerCase().includes(searchTerm.toLowerCase()));

    const title = (att.examTitle || "").toLowerCase();
    const matchesSubject =
      selectedSubject === "all" ||
      (selectedSubject === "math" && (title.includes("math") || title.includes("imo") || !title.includes("eng"))) ||
      (selectedSubject === "english" && (title.includes("eng") || title.includes("ieo")));

    const matchesExam = selectedExamId === "all" || att.examId === selectedExamId;
    const matchesClass = selectedClass === "all" || String(att.student.grade) === selectedClass;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "passed" && att.isPassed) ||
      (selectedStatus === "failed" && !att.isPassed);

    return matchesSearch && matchesSubject && matchesExam && matchesClass && matchesStatus;
  });

  /** Attempts that count under the policy, within the current filters. */
  const countedAttempts = useMemo(() => selectAttempts(filteredAttempts, countPolicy), [filteredAttempts, countPolicy]);

  /** Question wording comes from the stored reports; attempts carry only ids. */
  const questionText = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of reports) for (const q of r.questionResults || []) if (q.questionText && !map.has(q.questionId)) map.set(q.questionId, q.questionText);
    return map;
  }, [reports]);

  const selectedExam = exams.find((e) => e.id === selectedExamId);

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const { downloadResultsWorkbook } = await import("@/lib/results/exportExcel");
      await downloadResultsWorkbook({
        attempts: countedAttempts,
        exams,
        questionText,
        policy: countPolicy,
        fileLabel: selectedExam ? `${selectedExam.code || selectedExam.title} Results` : "Olympiad Results",
      });
    } catch (err) {
      console.error("Results export failed:", err);
      setExportError("The Excel file could not be created. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-rise-in font-sans text-[#182338]">
      {/* 1. HEADER (Requirement 17) */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/80 shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_2px_10px_-4px_rgba(38,45,90,0.10)] rounded-2xl px-6 sm:px-7 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#2468B2]">
            <span>Evaluation Ledger</span>
            <span className="text-[#667085]">•</span>
            <span>Classwise & Subjectwise Official Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#182338] mt-1">
            Results & Score Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            Review completed examinations, score certificates, and detailed diagnostic reports sorted strictly by subject and class.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting || countedAttempts.length === 0}
            className="h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            title="Download the filtered results, question analysis and section averages as an Excel file"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{exporting ? "Preparing…" : "Download Excel"}</span>
          </button>
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="h-9 px-3.5 bg-white/80 hover:bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-60"
            title="Refresh attempts and reports ledger from Firebase"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#2468B2] ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Syncing…" : "Refresh"}</span>
          </button>
          <Link
            href={`${roleBase}/live-monitor`}
            className="h-9 px-4 bg-white/70 backdrop-blur-sm border border-white/90 hover:bg-white/95 text-[#1C5190] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-subtle transition-all"
          >
            <span>Live Monitor Feed</span>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* 2. SUBJECT SELECTION TABS & COMPACT PROFESSIONAL FILTERS */}
        <div className="space-y-3">
          {/* Subject Switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedSubject("all")}
              className={`h-9 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedSubject === "all"
                  ? "bg-[#182338] text-white border-[#182338] shadow-xs"
                  : "bg-white text-[#667085] border-[#E1E7EF] hover:bg-slate-50"
              }`}
            >
              All Subjects
            </button>
            <button
              type="button"
              onClick={() => setSelectedSubject("math")}
              className={`h-9 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                selectedSubject === "math"
                  ? "bg-[#2468B2] text-white border-[#2468B2] shadow-xs"
                  : "bg-white text-[#2468B2] border-[#E1E7EF] hover:bg-blue-50"
              }`}
            >
              <span>Mathematics (IMO)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedSubject("english")}
              className={`h-9 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                selectedSubject === "english"
                  ? "bg-[#9333EA] text-white border-[#9333EA] shadow-xs"
                  : "bg-white text-[#9333EA] border-[#E1E7EF] hover:bg-purple-50"
              }`}
            >
              <span>English (IEO)</span>
            </button>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-4 shadow-subtle flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-3 flex-wrap">
              {/* Search Input */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search candidate name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-xs bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] font-semibold focus:outline-none focus:border-[#2468B2] focus:bg-white"
                />
              </div>

              {/* Subject Dropdown Filter */}
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as any)}
                className="h-9 px-3 text-xs font-bold bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] focus:outline-none focus:border-[#2468B2] cursor-pointer"
              >
                <option value="all">All Subjects (Math &amp; English)</option>
                <option value="math">Mathematics (IMO)</option>
                <option value="english">English (IEO)</option>
              </select>

              {/* Class Filter (Classes 1 - 12) */}
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="h-9 px-3 text-xs font-bold bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] focus:outline-none focus:border-[#2468B2] cursor-pointer"
              >
                <option value="all">All Classes (Grades 1–12)</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                  <option key={g} value={String(g)}>
                    Class {g}
                  </option>
                ))}
              </select>

              {/* Exam Filter */}
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="h-9 px-3 text-xs font-bold bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] focus:outline-none focus:border-[#2468B2] cursor-pointer max-w-[200px]"
              >
                <option value="all">All Examinations</option>
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.title}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-9 px-3 text-xs font-bold bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] focus:outline-none focus:border-[#2468B2] cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="passed">Passed Tier</option>
                <option value="failed">Review Needed</option>
              </select>

              {/* Which attempt counts when a student retook the paper */}
              <select
                value={countPolicy}
                onChange={(e) => setCountPolicy(e.target.value as CountPolicy)}
                className="h-9 px-3 text-xs font-bold bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] focus:outline-none focus:border-[#2468B2] cursor-pointer"
                title="Which attempts count in the analysis and Excel export"
              >
                <option value="latest">Count latest attempt</option>
                <option value="best">Count best attempt</option>
                <option value="all">Count all attempts</option>
              </select>
            </div>

            <div className="text-xs text-[#667085] font-semibold text-right">
              Showing <strong className="text-[#2468B2] font-bold">{filteredAttempts.length}</strong> sorted records
            </div>
          </div>
        </div>

        {exportError && (
          <div role="alert" className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-800">
            {exportError}
          </div>
        )}

        {/* Class analysis for one paper */}
        {selectedExam ? (
          <ResultsAnalysisPanel
            attempts={countedAttempts.filter((a) => a.examId === selectedExam.id)}
            examTitle={selectedExam.title}
            questionText={questionText}
          />
        ) : (
          countedAttempts.length > 0 && (
            <div className="p-3.5 rounded-xl border border-[#E1E7EF] bg-white text-xs text-[#667085] font-semibold">
              Choose an examination in the filter above to see question-by-question analysis: which questions the class missed most, average time per question, and section averages.
            </div>
          )
        )}

        {/* 3. RESULT TABLE (Requirements 18, 24) */}
        <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl shadow-subtle overflow-hidden">
          {filteredAttempts.length === 0 ? (
            /* EMPTY STATE (Requirement 24) */
            <div className="py-16 px-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF2FC] text-[#2468B2] flex items-center justify-center mx-auto border border-[#E1E7EF]">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#182338]">No Results Yet</h3>
                <p className="text-xs text-[#667085] max-w-md mx-auto">
                  Student results will appear here once an examination has been completed and evaluated.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href={`${roleBase}/exams`}
                  className="inline-flex items-center gap-2 h-10 px-5 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl text-xs font-bold shadow-subtle transition-all"
                >
                  <span>View Active Examinations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[1020px] text-left text-xs font-semibold">
                <thead className="bg-[#F4F7FB] text-[#667085] border-b border-[#E1E7EF] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-[170px]">Student</th>
                    <th className="py-3 px-3 min-w-[190px]">Examination</th>
                    <th className="py-3 px-2 w-[70px] text-center">Class</th>
                    <th className="py-3 px-2 w-[80px] text-center">Score</th>
                    <th className="py-3 px-2 w-[80px] text-center">Accuracy</th>
                    <th className="py-3 px-2 w-[70px] text-center text-emerald-700">Correct</th>
                    <th className="py-3 px-2 w-[70px] text-center text-rose-700">Wrong</th>
                    <th className="py-3 px-2 w-[85px] text-center text-[#667085]">Unanswered</th>
                    <th className="py-3 px-2.5 w-[100px] text-center">Submitted</th>
                    <th className="py-3 px-3 w-[95px] text-right">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E7EF] text-[#182338]">
                  {filteredAttempts.map((att) => {
                    const totalQ = att.questionEvaluations.length || 50;
                    const correctQ = att.questionEvaluations.filter((q) => q.isCorrect).length;
                    const attemptedQ = att.questionEvaluations.filter((q) => q.studentAnswer !== null).length;
                    const wrongQ = Math.max(0, attemptedQ - correctQ);
                    const unansweredQ = Math.max(0, totalQ - attemptedQ);

                    return (
                      <tr key={att.id} className="hover:bg-white/70 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-xs text-[#182338] truncate max-w-[160px]" title={att.student.name}>{att.student.name}</div>
                          <div className="text-[10px] font-mono text-[#667085] truncate max-w-[160px]" title={att.student.studentId}>
                            {att.student.studentId}{att.student.schoolName ? ` • ${att.student.schoolName}` : ""}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-bold text-[#182338] line-clamp-1 text-xs" title={att.examTitle}>{att.examTitle}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                                (att.examTitle || "").toLowerCase().includes("eng") || (att.examTitle || "").toLowerCase().includes("ieo")
                                  ? "bg-[#FAF5FF] text-[#9333EA] border border-[#F3E8FF]"
                                  : "bg-[#EEF4FF] text-[#2468B2] border border-[#D0E1FD]"
                              }`}
                            >
                              {(att.examTitle || "").toLowerCase().includes("eng") || (att.examTitle || "").toLowerCase().includes("ieo")
                                ? "English (IEO)"
                                : "Math (IMO)"}
                            </span>
                            <span className="text-[10px] font-mono text-[#667085] truncate">{att.examCode}</span>
                          </div>
                        </td>

                        <td className="py-3 px-2 text-center">
                          <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-slate-100 text-slate-800 border border-slate-200 inline-block whitespace-nowrap">
                            Class {att.student.grade || 6}
                          </span>
                        </td>

                        <td className="py-3 px-2 text-center font-mono font-bold text-xs text-[#2468B2]">
                          {att.scoreDisplay}
                        </td>

                        <td className="py-3 px-2 text-center font-mono font-bold text-xs text-[#1C5190]">
                          {att.percentage}%
                        </td>

                        <td className="py-3 px-2 text-center font-mono font-bold text-xs text-emerald-700">
                          {correctQ}
                        </td>

                        <td className="py-3 px-2 text-center font-mono font-bold text-xs text-rose-700">
                          {wrongQ}
                        </td>

                        <td className="py-3 px-2 text-center font-mono font-semibold text-xs text-[#667085]">
                          {unansweredQ}
                        </td>

                        <td className="py-3 px-2.5 text-center font-mono text-[11px] text-[#667085] whitespace-nowrap">
                          {new Date(att.submittedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>

                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <Link
                            href={resultRoute(att.id)}
                            className="inline-flex items-center gap-1 h-7 px-2.5 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-lg text-[11px] font-bold transition-all shadow-subtle shrink-0"
                          >
                            <FileText className="w-3 h-3" />
                            <span>View</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
