"use client";

import { useAuth } from "@/context/AuthContext";
import { ROLE_PREFIX } from "@/lib/auth/sections";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { examRepository } from "@/repositories";
import { Exam } from "@/types/exam";
import {
  Calculator,
  BookOpen,
  Layers,
  Search,
  Clock,
  Award,
  FileText,
  Play,
  Plus,
  FileCheck2,
  Sparkles,
  LayoutList,
  LayoutGrid,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Lock,
  Unlock,
} from "lucide-react";
import { ExamLockService } from "@/services/exam/ExamLockService";

type SubjectTabKey = "math" | "english" | "all";

export default function ExamsScreen() {
  const { activeRole } = useAuth();
  const roleBase = ROLE_PREFIX[activeRole];
  const [exams, setExams] = useState<Exam[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [activeTab, setActiveTab] = useState<SubjectTabKey>("math");
  const [layoutMode, setLayoutMode] = useState<"list" | "grid">("list");
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

  const [lockVersion, setLockVersion] = useState(0);

  useEffect(() => {
    const unsub = ExamLockService.subscribe(() => {
      setLockVersion((v) => v + 1);
    });
    return unsub;
  }, []);

  const handleToggleLock = async (examId: string) => {
    await ExamLockService.toggleExamLocked(examId);
    setLockVersion((v) => v + 1);
  };

  const unlockedCount = useMemo(() => {
    return exams.filter((e) => !ExamLockService.isExamLocked(e.id)).length;
  }, [exams, lockVersion]);
  const lockedCount = Math.max(0, exams.length - unlockedCount);

  // Split exams by subject
  const mathExams = useMemo(() => {
    return exams.filter((e) => {
      const sId = (e.subjectId || "").toLowerCase();
      const sName = (e.subjectName || "").toLowerCase();
      const code = (e.code || "").toLowerCase();
      const title = (e.title || "").toLowerCase();
      return (
        sId.includes("math") ||
        sName.includes("math") ||
        code.includes("imo") ||
        title.includes("mathematics") ||
        title.includes("imo") ||
        (!sId.includes("eng") && !sName.includes("english"))
      );
    });
  }, [exams]);

  const englishExams = useMemo(() => {
    return exams.filter((e) => {
      const sId = (e.subjectId || "").toLowerCase();
      const sName = (e.subjectName || "").toLowerCase();
      const code = (e.code || "").toLowerCase();
      const title = (e.title || "").toLowerCase();
      return (
        sId.includes("eng") ||
        sName.includes("english") ||
        code.includes("ieo") ||
        title.includes("english") ||
        title.includes("ieo")
      );
    });
  }, [exams]);

  // Current tab collection
  const currentTabExams = useMemo(() => {
    if (activeTab === "math") return mathExams;
    if (activeTab === "english") return englishExams;
    return exams;
  }, [activeTab, mathExams, englishExams, exams]);

  // Search & Class filter
  const filtered = useMemo(() => {
    return currentTabExams.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.subtitle && e.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesClass =
        selectedClass === "all" ||
        String(e.grade || 6) === selectedClass ||
        e.title.toLowerCase().includes(`class ${selectedClass}`) ||
        e.title.toLowerCase().includes(`grade ${selectedClass}`);

      return matchesSearch && matchesClass;
    });
  }, [currentTabExams, searchTerm, selectedClass]);

  return (
    <div className="space-y-6 animate-rise-in font-sans text-[#182338]">
      {/* 1. Header */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/80 shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_2px_10px_-4px_rgba(38,45,90,0.10)] rounded-2xl px-6 sm:px-7 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#2468B2]">
            <span>Examination Operations</span>
            <span className="text-[#667085]">•</span>
            <span>Grade 6 Olympiad Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#182338] mt-1">
            Examinations Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            Browse, manage, configure, and launch Grade 6 Olympiad examination papers organized by academic subject.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`${roleBase}/exams/new`}
            className="h-10 px-4 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Examination</span>
          </Link>
        </div>
      </div>

      {/* Access Control Notice for Teachers & Super Admins */}
      <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#2468B2] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-[#182338]">
                Student Access & Lock Management
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <Unlock className="w-3 h-3 text-emerald-600" />
                {unlockedCount} Unlocked for Students
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                <Lock className="w-3 h-3 text-rose-600" />
                {lockedCount} Locked
              </span>
            </div>
            <p className="text-xs text-[#667085] mt-1 font-medium leading-relaxed">
              As Teacher or Super Admin, you control which examination students can see and sit. By default, the <strong>2022-23 Mathematics Olympiad (Rotating 3D Dice Lab)</strong> is unlocked for test candidates. Use the Lock / Unlock button on any card below to control candidate access.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Subject Tabs Navigation */}
      <div className="bg-white border border-[#E1E7EF] rounded-2xl p-2 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Maths Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("math")}
            style={
              activeTab === "math"
                ? { backgroundColor: "#2468B2", color: "#FFFFFF", borderColor: "#2468B2" }
                : { backgroundColor: "#FFFFFF", color: "#475569", borderColor: "#E1E7EF" }
            }
            className={`h-11 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all cursor-pointer border ${
              activeTab === "math"
                ? "shadow-sm ring-2 ring-[#2468B2]/20"
                : "hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Calculator
              className="w-4 h-4"
              style={{ color: activeTab === "math" ? "#FFFFFF" : "#2468B2" }}
            />
            <span style={{ color: activeTab === "math" ? "#FFFFFF" : "#1E293B" }}>Mathematics</span>
            <span
              className="px-2 py-0.5 rounded-full text-[11px] font-mono font-black"
              style={
                activeTab === "math"
                  ? { backgroundColor: "rgba(255, 255, 255, 0.22)", color: "#FFFFFF" }
                  : { backgroundColor: "#EEF4FF", color: "#2468B2", border: "1px solid #D0E1FD" }
              }
            >
              {mathExams.length}
            </span>
          </button>

          {/* English Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("english")}
            style={
              activeTab === "english"
                ? { backgroundColor: "#9333EA", color: "#FFFFFF", borderColor: "#9333EA" }
                : { backgroundColor: "#FFFFFF", color: "#475569", borderColor: "#E1E7EF" }
            }
            className={`h-11 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all cursor-pointer border ${
              activeTab === "english"
                ? "shadow-sm ring-2 ring-[#9333EA]/20"
                : "hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <BookOpen
              className="w-4 h-4"
              style={{ color: activeTab === "english" ? "#FFFFFF" : "#9333EA" }}
            />
            <span style={{ color: activeTab === "english" ? "#FFFFFF" : "#1E293B" }}>English</span>
            <span
              className="px-2 py-0.5 rounded-full text-[11px] font-mono font-black"
              style={
                activeTab === "english"
                  ? { backgroundColor: "rgba(255, 255, 255, 0.22)", color: "#FFFFFF" }
                  : { backgroundColor: "#FAF5FF", color: "#9333EA", border: "1px solid #F3E8FF" }
              }
            >
              {englishExams.length}
            </span>
          </button>

          {/* All Subjects Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            style={
              activeTab === "all"
                ? { backgroundColor: "#0F172A", color: "#FFFFFF", borderColor: "#0F172A" }
                : { backgroundColor: "#FFFFFF", color: "#475569", borderColor: "#E1E7EF" }
            }
            className={`h-11 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all cursor-pointer border ${
              activeTab === "all"
                ? "shadow-sm ring-2 ring-slate-900/20"
                : "hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Layers
              className="w-4 h-4"
              style={{ color: activeTab === "all" ? "#FFFFFF" : "#64748B" }}
            />
            <span style={{ color: activeTab === "all" ? "#FFFFFF" : "#1E293B" }}>All Subjects</span>
            <span
              className="px-2 py-0.5 rounded-full text-[11px] font-mono font-black"
              style={
                activeTab === "all"
                  ? { backgroundColor: "rgba(255, 255, 255, 0.22)", color: "#FFFFFF" }
                  : { backgroundColor: "#F1F5F9", color: "#475569", border: "1px solid #E2E8F0" }
              }
            >
              {exams.length}
            </span>
          </button>
        </div>

        {/* Class Filter Dropdown & View Mode Toggle */}
        <div className="flex items-center gap-2 px-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
            <GraduationCap className="w-3.5 h-3.5 text-[#2468B2]" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#182338] focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">All Classes</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                <option key={g} value={String(g)}>
                  Class {g}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => setLayoutMode("list")}
              className={`p-1.5 rounded-md transition-all ${
                layoutMode === "list" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
              title="1-by-1 List View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("grid")}
              className={`p-1.5 rounded-md transition-all ${
                layoutMode === "grid" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Search Bar within active tab */}
      <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full min-w-[260px]">
          <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            style={{ paddingLeft: "2.5rem" }}
            placeholder={
              activeTab === "math"
                ? "Search Mathematics papers by title, code, or set..."
                : activeTab === "english"
                ? "Search English papers..."
                : "Search all examinations by title, code, or subject..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pr-3 text-xs sm:text-[13px] bg-[#F4F7FB]/70 border border-[#E1E7EF] rounded-xl text-[#182338] font-semibold focus:outline-none focus:border-[#2468B2] focus:bg-white transition-all"
          />
        </div>

        <div className="text-xs font-bold text-[#667085] px-2 flex items-center gap-2">
          <span>
            Showing <strong className="text-[#2468B2]">{filtered.length}</strong> {activeTab === "math" ? "Mathematics" : activeTab === "english" ? "English" : ""} examinations
          </span>
        </div>
      </div>

      {/* 4. Tab Content */}
      {activeTab === "english" && englishExams.length === 0 ? (
        /* Empty / Prepared State for English */
        <div className="bg-white border-2 border-dashed border-purple-200 rounded-2xl p-12 sm:p-16 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto border border-purple-100 shadow-xs">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>English Olympiad (IEO) • Grade 6</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Ready for English Examination Papers
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The English Olympiad subject taxonomy (Word and Structure Knowledge, Reading Comprehension, Spoken & Written Expression, and Achievers Section) is initialized.
            </p>
          </div>
          <div className="pt-3">
            <Link
              href={`${roleBase}/exams/new`}
              className="h-10 px-5 bg-[#9333EA] hover:bg-[#7E22CE] text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create First English Paper</span>
            </Link>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        /* Empty / No Matches State */
        <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-16 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF2FC] text-[#2468B2] flex items-center justify-center mx-auto border border-[#E1E7EF]">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#182338]">
              No Matching Examinations
            </h3>
            <p className="text-xs text-[#667085] max-w-sm mx-auto">
              No examination matches your current search criteria in this subject tab.
            </p>
          </div>
        </div>
      ) : layoutMode === "list" ? (
        /* ── 1-BY-1 SPREAD LIST (Default Requested Layout) ── */
        <div className="space-y-4">
          {filtered.map((exam, idx) => {
            const isLocked = ExamLockService.isExamLocked(exam.id);
            return (
              <div
                key={exam.id}
                className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                  isLocked ? "border-slate-300/80 bg-slate-50/30" : "border-[#E1E7EF] hover:border-[#2468B2]"
                }`}
              >
                {/* Left Column: Numbering + Main Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Paper Number Badge */}
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-indigo-50 to-sky-100 border border-indigo-200 text-[#2468B2] flex flex-col items-center justify-center font-mono shadow-2xs">
                    <span className="text-[9px] font-bold text-slate-500 uppercase leading-none">Paper</span>
                    <span className="text-base font-black leading-tight">{(idx + 1).toString().padStart(2, "0")}</span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-[11px] text-[#2468B2] bg-[#EAF2FC] px-2.5 py-0.5 rounded-md border border-indigo-100">
                        {exam.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold font-mono">
                        Class {exam.grade || 6}
                      </span>
                      {isLocked ? (
                        <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase flex items-center gap-1">
                          <Lock className="w-3 h-3 text-rose-500" />
                          Locked for Students
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase flex items-center gap-1">
                          <Unlock className="w-3 h-3 text-emerald-600" />
                          Unlocked & Visible
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold uppercase">
                        {exam.status || "Published"}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#182338] leading-snug">
                        {exam.title}
                      </h3>
                      {exam.subtitle && (
                        <p className="text-xs font-bold text-[#2468B2] mt-0.5">{exam.subtitle}</p>
                      )}
                    </div>

                    {exam.description && (
                      <p className="text-xs text-[#667085] leading-relaxed line-clamp-2 font-medium max-w-3xl">
                        {exam.description}
                      </p>
                    )}

                    {/* Section Breakdown Pills */}
                    {exam.sections && exam.sections.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {exam.sections.map((sec) => (
                          <span
                            key={sec.id}
                            className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-slate-50 border border-slate-200 text-slate-600"
                          >
                            {sec.title} ({sec.questionIds.length}Q)
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Metrics & Action Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#E1E7EF]">
                  {/* Metrics */}
                  <div className="flex items-center gap-4 text-xs text-[#667085] pr-2">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Clock className="w-4 h-4 text-[#2468B2]" />
                      <span>{exam.durationMinutes}m</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>{exam.totalMarks || 60}M</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>{exam.questionIds.length || exam.totalQuestions || 50}Q</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Lock / Unlock Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleLock(exam.id)}
                      className={`h-10 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border shadow-2xs ${
                        isLocked
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                          : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                      }`}
                      title={isLocked ? "Unlock this paper for students" : "Lock this paper from students"}
                    >
                      {isLocked ? (
                        <>
                          <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Unlock Paper</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-rose-600" />
                          <span>Lock Paper</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/exam/${exam.id}`}
                      className="h-10 px-3.5 text-xs font-bold text-[#1C5190] bg-[#EAF2FC] hover:bg-[#D4E5F9] rounded-xl flex items-center gap-1.5 transition-all border border-indigo-100"
                    >
                      <Play className="w-3.5 h-3.5 fill-[#1C5190] text-[#1C5190]" />
                      <span>Launch</span>
                    </Link>

                    <Link
                      href={`${roleBase}/exams/${exam.id}`}
                      className="h-10 px-3.5 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl text-xs font-bold flex items-center justify-center transition-all shadow-xs"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── GRID VIEW (Optional fallback) ── */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((exam, idx) => {
            const isLocked = ExamLockService.isExamLocked(exam.id);
            return (
              <div
                key={exam.id}
                className={`bg-[#FFFFFF] border rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#2468B2] transition-all space-y-4 ${
                  isLocked ? "border-slate-300/80 bg-slate-50/30" : "border-[#E1E7EF]"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                        #{(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="font-mono font-bold text-[11px] text-[#2468B2] bg-[#EAF2FC] px-2 py-0.5 rounded-md border border-[#E1E7EF]">
                        {exam.code}
                      </span>
                    </div>
                    {isLocked ? (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase flex items-center gap-1">
                        <Lock className="w-3 h-3 text-rose-500" />
                        Locked
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase flex items-center gap-1">
                        <Unlock className="w-3 h-3 text-emerald-600" />
                        Unlocked
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#182338] leading-snug">{exam.title}</h3>
                    {exam.subtitle && (
                      <p className="text-[11px] text-[#2468B2] mt-0.5 font-bold">{exam.subtitle}</p>
                    )}
                  </div>

                  <p className="text-xs text-[#667085] leading-relaxed line-clamp-2 font-medium">
                    {exam.description || "Official Olympiad digital examination."}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E1E7EF] text-xs text-[#667085]">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Clock className="w-3.5 h-3.5 text-[#2468B2]" />
                      <span>{exam.durationMinutes} mins</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>{exam.totalMarks || 60} Marks</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold">
                      <FileText className="w-3.5 h-3.5 text-[#182338]" />
                      <span>{exam.questionIds.length || 50} Qs</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E1E7EF] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleLock(exam.id)}
                    className={`h-9 px-3 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border shadow-2xs ${
                      isLocked
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                        : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <Unlock className="w-3 h-3 text-emerald-600" />
                        <span>Unlock</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-rose-600" />
                        <span>Lock</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/exam/${exam.id}`}
                      className="h-9 px-3 text-xs font-bold text-[#1C5190] bg-[#EAF2FC] hover:bg-[#E1E7EF] rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-[#1C5190] text-[#1C5190]" />
                      <span>Launch</span>
                    </Link>

                    <Link
                      href={`${roleBase}/exams/${exam.id}`}
                      className="h-9 px-3.5 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl text-xs font-bold flex items-center justify-center transition-all shadow-xs"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
