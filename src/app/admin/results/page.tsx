"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";

export default function ResultsAdminPage() {
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [reports, setReports] = useState<ExamReport[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const [attList, repList, exList] = await Promise.all([
          attemptRepository.listAttempts(),
          reportRepository.listReports(),
          examRepository.listExams(),
        ]);
        setAttempts(attList);
        setReports(repList);
        setExams(exList);
      } catch (err) {
        console.error("Failed to load results ledger:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filtered List
  const filteredAttempts = attempts.filter((att) => {
    const matchesSearch =
      att.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (att.student.schoolName && att.student.schoolName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesExam = selectedExamId === "all" || att.examId === selectedExamId;
    const matchesClass = selectedClass === "all" || String(att.student.grade) === selectedClass;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "passed" && att.isPassed) ||
      (selectedStatus === "failed" && !att.isPassed);

    return matchesSearch && matchesExam && matchesClass && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col font-sans select-none text-[#172033]">
      {/* 1. HEADER (Requirement 17) */}
      <div className="px-6 sm:px-8 py-6 border-b border-[#DDE4D7] bg-[#F6F9F1]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#4D741F]">
            <span>Evaluation Ledger</span>
            <span className="text-[#667085]">•</span>
            <span>Official Examination Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172033] mt-1">
            Results & Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            Review completed examinations, student scores and detailed answer reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/live-monitor"
            className="h-9 px-4 bg-white border border-[#DDE4D7] hover:bg-[#EEF5E7] text-[#355415] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <span>Live Monitor Feed</span>
          </Link>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6 flex-1">
        
        {/* 2. COMPACT PROFESSIONAL FILTERS (Requirement 17) */}
        <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-xs bg-[#F6F9F1]/60 border border-[#DDE4D7] rounded-xl text-[#172033] font-semibold focus:outline-none focus:border-[#4D741F] focus:bg-white"
              />
            </div>

            {/* Exam Filter */}
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="h-9 px-3 text-xs font-bold bg-[#F6F9F1]/60 border border-[#DDE4D7] rounded-xl text-[#172033] focus:outline-none focus:border-[#4D741F] cursor-pointer"
            >
              <option value="all">All Examinations</option>
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title}
                </option>
              ))}
            </select>

            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-9 px-3 text-xs font-bold bg-[#F6F9F1]/60 border border-[#DDE4D7] rounded-xl text-[#172033] focus:outline-none focus:border-[#4D741F] cursor-pointer"
            >
              <option value="all">All Classes</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 px-3 text-xs font-bold bg-[#F6F9F1]/60 border border-[#DDE4D7] rounded-xl text-[#172033] focus:outline-none focus:border-[#4D741F] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="passed">Passed Tier</option>
              <option value="failed">Review Needed</option>
            </select>
          </div>

          <div className="text-xs text-[#667085] font-semibold text-right">
            Showing <strong className="text-[#4D741F] font-bold">{filteredAttempts.length}</strong> evaluated records
          </div>
        </div>

        {/* 3. RESULT TABLE (Requirements 18, 24) */}
        <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl shadow-xs overflow-hidden">
          {filteredAttempts.length === 0 ? (
            /* EMPTY STATE (Requirement 24) */
            <div className="py-16 px-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF5E7] text-[#4D741F] flex items-center justify-center mx-auto border border-[#DDE4D7]">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-[#172033]">No Results Yet</h3>
                <p className="text-xs text-[#667085] max-w-md mx-auto">
                  Student results will appear here once an examination has been completed and evaluated.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/admin/exams"
                  className="inline-flex items-center gap-2 h-10 px-5 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                >
                  <span>View Active Examinations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead className="bg-[#F6F9F1] text-[#667085] border-b border-[#DDE4D7] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Examination</th>
                    <th className="p-4 text-center">Class</th>
                    <th className="p-4 text-center">Score</th>
                    <th className="p-4 text-center">Accuracy</th>
                    <th className="p-4 text-center text-emerald-700">Correct</th>
                    <th className="p-4 text-center text-rose-700">Wrong</th>
                    <th className="p-4 text-center text-[#667085]">Unanswered</th>
                    <th className="p-4 text-center">Submitted</th>
                    <th className="p-4 text-right">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE4D7] text-[#172033]">
                  {filteredAttempts.map((att) => {
                    const totalQ = att.questionEvaluations.length || 50;
                    const correctQ = att.questionEvaluations.filter((q) => q.isCorrect).length;
                    const attemptedQ = att.questionEvaluations.filter((q) => q.studentAnswer !== null).length;
                    const wrongQ = Math.max(0, attemptedQ - correctQ);
                    const unansweredQ = Math.max(0, totalQ - attemptedQ);

                    return (
                      <tr key={att.id} className="hover:bg-[#F6F9F1]/60 transition-colors">
                        <td className="p-4">
                          <div className="font-extrabold text-sm text-[#172033]">{att.student.name}</div>
                          <div className="text-[11px] font-mono text-[#667085] mt-0.5">
                            {att.student.studentId} • {att.student.schoolName || "Registered Candidate"}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-bold text-[#172033]">{att.examTitle}</div>
                          <div className="text-[11px] font-mono text-[#4D741F]">{att.examCode}</div>
                        </td>

                        <td className="p-4 text-center font-bold text-[#172033]">
                          Class {att.student.grade || 6}
                        </td>

                        <td className="p-4 text-center font-mono font-black text-sm text-[#4D741F]">
                          {att.scoreDisplay}
                        </td>

                        <td className="p-4 text-center font-mono font-bold text-[#355415]">
                          {att.percentage}%
                        </td>

                        <td className="p-4 text-center font-mono font-bold text-emerald-700">
                          {correctQ}
                        </td>

                        <td className="p-4 text-center font-mono font-bold text-rose-700">
                          {wrongQ}
                        </td>

                        <td className="p-4 text-center font-mono font-semibold text-[#667085]">
                          {unansweredQ}
                        </td>

                        <td className="p-4 text-center font-mono text-xs text-[#667085]">
                          {new Date(att.submittedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>

                        <td className="p-4 text-right">
                          <Link
                            href={`/results/${att.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4D741F] hover:bg-[#355415] text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
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
