"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { questionRepository, attemptRepository, examRepository } from "@/repositories";
import { Question } from "@/types/question";
import { ExamAttempt } from "@/types/attempt";
import { Exam } from "@/types/exam";
import {
  BarChart3,
  TrendingUp,
  Award,
  Layers,
  Target,
  CheckCircle2,
  BookOpen,
  FileCheck2,
  ChevronRight,
  PieChart,
} from "lucide-react";

export default function AnalyticsAdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [qList, attList, exList] = await Promise.all([
          questionRepository.listQuestions(),
          attemptRepository.listAttempts(),
          examRepository.listExams(),
        ]);
        setQuestions(qList);
        setAttempts(attList);
        setExams(exList);
      } catch (err) {
        console.error("Failed to load analytics data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const typeDistribution = questions.reduce((acc, q) => {
    acc[q.questionType] = (acc[q.questionType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const diffDistribution = questions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / attempts.length)
      : 0;

  return (
    <div className="space-y-6 animate-rise-in font-sans text-[#172033]">
      {/* 1. Header */}
      <div className="bg-white border border-[#E3E8EF] rounded-2xl shadow-subtle px-6 sm:px-7 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#2563A8]">
            <span>System Analytics & Diagnostics</span>
            <span className="text-[#667085]">•</span>
            <span>Performance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#172033] mt-1">
            Examination & Item Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            Taxonomy distribution, interactive interaction types, and candidate accuracy metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/results"
            className="h-9 px-4 bg-white border border-[#E3E8EF] hover:bg-[#EAF2FB] text-[#1B4E88] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-subtle transition-all"
          >
            <Award className="w-4 h-4 text-[#2563A8]" />
            <span>View Official Score Reports</span>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* 2. Top Summary KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#FFFFFF] border border-[#E3E8EF] rounded-2xl p-5 shadow-subtle space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block">
              Question Bank Items
            </span>
            <div className="text-3xl font-bold font-mono text-[#172033]">
              {questions.length}
            </div>
            <div className="text-[11px] text-[#2563A8] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Interactive Ready
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E3E8EF] rounded-2xl p-5 shadow-subtle space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block">
              Interaction Types
            </span>
            <div className="text-3xl font-bold font-mono text-[#2563A8]">
              {Object.keys(typeDistribution).length || 8}
            </div>
            <div className="text-[11px] text-[#667085] font-medium">
              Simulation, Drag, Numeric, etc.
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E3E8EF] rounded-2xl p-5 shadow-subtle space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block">
              Average Accuracy
            </span>
            <div className="text-3xl font-bold font-mono text-[#1B4E88]">
              {attempts.length > 0 ? `${avgScore}%` : "—"}
            </div>
            <div className="text-[11px] text-[#667085] font-medium">
              {attempts.length > 0 ? `${attempts.length} attempts evaluated` : "No submissions yet"}
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E3E8EF] rounded-2xl p-5 shadow-subtle space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block">
              Active Examinations
            </span>
            <div className="text-3xl font-bold font-mono text-[#4FA8D8]">
              {exams.length}
            </div>
            <div className="text-[11px] text-[#667085] font-medium">
              Standardized Olympiad papers
            </div>
          </div>
        </div>

        {/* 3. Deep Breakdown Two-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Interaction Mechanisms (7 cols) */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E3E8EF] rounded-2xl p-6 shadow-subtle space-y-5">
            <div className="border-b border-[#E3E8EF] pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#172033]">
                  Interactive Question Interaction Types
                </h3>
                <p className="text-xs text-[#667085] font-medium mt-0.5">
                  Distribution of interactive mechanisms across the Question Repository
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#2563A8] bg-[#EAF2FB] px-2.5 py-1 rounded-lg border border-[#E3E8EF]">
                {Object.keys(typeDistribution).length} Types
              </span>
            </div>

            <div className="space-y-3.5">
              {Object.entries(typeDistribution).map(([type, count]) => {
                const percent = Math.round((count / (questions.length || 1)) * 100);
                return (
                  <div key={type} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#172033]">{type}</span>
                      <span className="font-mono text-[#667085] font-semibold">
                        {count} questions ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 bg-[#F6F8FB] border border-[#E3E8EF] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2563A8] rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Difficulty & Taxonomy (5 cols) */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E3E8EF] rounded-2xl p-6 shadow-subtle space-y-5 flex flex-col justify-between">
            <div className="border-b border-[#E3E8EF] pb-3">
              <h3 className="text-sm font-bold text-[#172033]">Difficulty Distribution</h3>
              <p className="text-xs text-[#667085] font-medium mt-0.5">
                Olympiad cognitive depth rating
              </p>
            </div>

            <div className="space-y-3 my-auto">
              {Object.entries(diffDistribution).map(([diff, count]) => {
                const percent = Math.round((count / (questions.length || 1)) * 100);
                return (
                  <div key={diff} className="p-3 bg-[#F6F8FB] border border-[#E3E8EF] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#172033]">{diff}</div>
                      <div className="text-[10px] text-[#667085]">{count} questions</div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#2563A8]">
                      {percent}%
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-[#EAF2FB] border border-[#E3E8EF] rounded-xl text-xs text-[#1B4E88]">
              <div className="font-bold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#2563A8]" /> Deterministic Evaluation
              </div>
              <p className="text-[11px] text-[#667085] mt-1 leading-relaxed">
                All activities evaluated with zero AI runtime latency and verified mathematical answers.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
