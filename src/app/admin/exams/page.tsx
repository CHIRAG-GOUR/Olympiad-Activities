"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { examRepository } from "@/repositories";
import { Exam } from "@/types/exam";
import {
  FileCheck2,
  Plus,
  Search,
  Clock,
  Award,
  Users,
  Play,
  Settings,
  ChevronRight,
  HelpCircle,
  FileText,
} from "lucide-react";

export default function ExamsListPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await examRepository.listExams();
        setExams(data);
      } catch (err) {
        console.error("Failed to load exams:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = exams.filter(
    (e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col font-sans select-none text-[#172033]">
      {/* 1. Header (Requirement 8) */}
      <div className="px-6 sm:px-8 py-6 border-b border-[#DDE4D7] bg-[#F6F9F1]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#4D741F]">
            <span>Examination Operations</span>
            <span className="text-[#667085]">•</span>
            <span>Test Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172033] mt-1">
            All Examinations
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            Schedule, configure, author, and deploy digital Olympiad examination papers for students.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/exams/new"
            className="h-9 px-4 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Examination</span>
          </Link>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6 flex-1">
        
        {/* 2. Search & Overview */}
        <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full min-w-[260px]">
            <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search examinations by title, code, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#F6F9F1]/60 border border-[#DDE4D7] rounded-xl text-[#172033] font-semibold focus:outline-none focus:border-[#4D741F] focus:bg-white"
            />
          </div>

          <span className="text-xs font-bold text-[#667085] px-2">
            Showing <strong className="text-[#4D741F]">{filtered.length}</strong> examinations
          </span>
        </div>

        {/* 3. Examination Cards Grid */}
        {filtered.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-16 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF5E7] text-[#4D741F] flex items-center justify-center mx-auto border border-[#DDE4D7]">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-[#172033]">
                {exams.length === 0 ? "No Examinations Published Yet" : "No Matching Examinations"}
              </h3>
              <p className="text-xs text-[#667085] max-w-sm mx-auto">
                {exams.length === 0
                  ? "Create your first digital Olympiad examination paper from questions in the Question Bank."
                  : "No examination matches your current search query."}
              </p>
            </div>
            {exams.length === 0 && (
              <div className="pt-2">
                <Link
                  href="/admin/exams/new"
                  className="h-9 px-4 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Examination</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((exam) => (
              <div
                key={exam.id}
                className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#4D741F] transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-[11px] text-[#4D741F] bg-[#EEF5E7] px-2 py-0.5 rounded-md border border-[#DDE4D7]">
                      {exam.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#F6F9F1] text-[#355415] border border-[#DDE4D7] text-[10px] font-extrabold uppercase">
                      ● {exam.status || "Active"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-[#172033] leading-snug">{exam.title}</h3>
                    {exam.subtitle && (
                      <p className="text-[11px] text-[#4D741F] mt-0.5 font-bold">{exam.subtitle}</p>
                    )}
                  </div>

                  <p className="text-xs text-[#667085] leading-relaxed line-clamp-2 font-medium">
                    {exam.description || "Official Olympiad digital examination."}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#DDE4D7] text-xs text-[#667085]">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Clock className="w-3.5 h-3.5 text-[#4D741F]" />
                      <span>{exam.durationMinutes} mins</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold">
                      <Award className="w-3.5 h-3.5 text-[#5F8A28]" />
                      <span>{exam.totalMarks || 60} Marks</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold">
                      <FileText className="w-3.5 h-3.5 text-[#172033]" />
                      <span>{exam.questionIds.length || 50} Qs</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#DDE4D7] flex items-center justify-between gap-2">
                  <Link
                    href={`/exam/${exam.id}`}
                    className="h-9 px-3 text-xs font-bold text-[#355415] bg-[#EEF5E7] hover:bg-[#DDE4D7] rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-[#355415] text-[#355415]" />
                    <span>Launch Exam</span>
                  </Link>

                  <Link
                    href={`/admin/exams/${exam.id}`}
                    className="h-9 px-4 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-bold flex items-center justify-center transition-all shadow-xs"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
