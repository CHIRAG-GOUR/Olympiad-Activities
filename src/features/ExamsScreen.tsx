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
  LayoutList,
  LayoutGrid,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Lock,
  Unlock,
  SlidersHorizontal,
  ShieldCheck,
  Check,
  RotateCcw,
  Boxes,
  Eye,
  EyeOff,
  Filter,
} from "lucide-react";
import { ExamLockService } from "@/services/exam/ExamLockService";

type MainViewTab = "access_control" | "catalogue";
type SubjectTabKey = "math" | "english" | "all";
type ClassFilterKey = "all" | "6" | "7" | "8";

export default function ExamsScreen() {
  const { activeRole } = useAuth();
  const roleBase = ROLE_PREFIX[activeRole];
  const [exams, setExams] = useState<Exam[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Navigation tabs
  const [mainTab, setMainTab] = useState<MainViewTab>("access_control");
  const [classFilter, setClassFilter] = useState<ClassFilterKey>("all");
  const [activeSubjectTab, setActiveSubjectTab] = useState<SubjectTabKey>("all");
  const [layoutMode, setLayoutMode] = useState<"list" | "grid">("list");
  const [loading, setLoading] = useState(true);
  const [lockVersion, setLockVersion] = useState(0);

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

  const handleToggleClass = async (examId: string, classNum: number, defaultGrade?: number) => {
    await ExamLockService.toggleExamClass(examId, classNum, defaultGrade || 6);
    setLockVersion((v) => v + 1);
  };

  const handleSetAllClasses = async (examId: string, classes: number[]) => {
    await ExamLockService.setVisibleClasses(examId, classes);
    setLockVersion((v) => v + 1);
  };

  // Metrics calculation
  const unlockedCount = useMemo(() => {
    return exams.filter((e) => !ExamLockService.isExamLocked(e.id)).length;
  }, [exams, lockVersion]);
  const lockedCount = Math.max(0, exams.length - unlockedCount);

  const class6Count = useMemo(() => {
    return exams.filter((e) => ExamLockService.isExamVisibleToClass(e.id, 6, Number(e.grade) || 6) && !ExamLockService.isExamLocked(e.id)).length;
  }, [exams, lockVersion]);

  const class7Count = useMemo(() => {
    return exams.filter((e) => ExamLockService.isExamVisibleToClass(e.id, 7, Number(e.grade) || 6) && !ExamLockService.isExamLocked(e.id)).length;
  }, [exams, lockVersion]);

  const class8Count = useMemo(() => {
    return exams.filter((e) => ExamLockService.isExamVisibleToClass(e.id, 8, Number(e.grade) || 6) && !ExamLockService.isExamLocked(e.id)).length;
  }, [exams, lockVersion]);

  // Subject splits
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

  // Filtered list
  const filteredExams = useMemo(() => {
    let pool = exams;
    if (activeSubjectTab === "math") pool = mathExams;
    else if (activeSubjectTab === "english") pool = englishExams;

    return pool.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.subtitle && e.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const visibleClasses = ExamLockService.getVisibleClasses(e.id, Number(e.grade) || 6);
      const matchesClass =
        classFilter === "all" ||
        visibleClasses.includes(Number(classFilter));

      return matchesSearch && matchesClass;
    });
  }, [exams, mathExams, englishExams, activeSubjectTab, searchTerm, classFilter, lockVersion]);

  return (
    <div className="space-y-6 animate-rise-in font-sans text-[#182338]">
      {/* 1. Header Banner */}
      <div className="bg-white/85 backdrop-blur-sm border border-slate-200/90 shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_2px_10px_-4px_rgba(38,45,90,0.10)] rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#2468B2]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Staff Administration & Lock Controller</span>
            <span className="text-[#667085]">•</span>
            <span>Classes 6 – 8 Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#182338] mt-1">
            Examinations & Class Access Control
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            Control which examination papers are locked or unlocked for test candidates, and configure visibility per class (Class 6, Class 7, Class 8).
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href={`${roleBase}/exams/new`}
            className="h-11 px-4 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Exam</span>
          </Link>
        </div>
      </div>

      {/* 2. Real-Time Access & Class Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Papers</span>
          <span className="text-xl font-black text-slate-900 flex items-center gap-1.5 mt-0.5 font-mono">
            <FileText className="w-4 h-4 text-indigo-600" />
            {exams.length}
          </span>
          <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">In examination bank</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 shadow-2xs">
          <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Unlocked (Active)</span>
          <span className="text-xl font-black text-emerald-900 flex items-center gap-1.5 mt-0.5 font-mono">
            <Unlock className="w-4 h-4 text-emerald-600" />
            {unlockedCount}
          </span>
          <span className="text-[10px] font-semibold text-emerald-700 block mt-0.5">Open for candidates</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 shadow-2xs">
          <span className="block text-[10px] font-bold text-blue-800 uppercase tracking-wider">Class 6 Open</span>
          <span className="text-xl font-black text-blue-900 flex items-center gap-1.5 mt-0.5 font-mono">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            {class6Count}
          </span>
          <span className="text-[10px] font-semibold text-blue-700 block mt-0.5">Visible to Class 6</span>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 shadow-2xs">
          <span className="block text-[10px] font-bold text-indigo-800 uppercase tracking-wider">Class 7 Open</span>
          <span className="text-xl font-black text-indigo-900 flex items-center gap-1.5 mt-0.5 font-mono">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            {class7Count}
          </span>
          <span className="text-[10px] font-semibold text-indigo-700 block mt-0.5">Visible to Class 7</span>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 shadow-2xs">
          <span className="block text-[10px] font-bold text-purple-800 uppercase tracking-wider">Class 8 Open</span>
          <span className="text-xl font-black text-purple-900 flex items-center gap-1.5 mt-0.5 font-mono">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            {class8Count}
          </span>
          <span className="text-[10px] font-semibold text-purple-700 block mt-0.5">Visible to Class 8</span>
        </div>
      </div>

      {/* 3. Primary Mode Navigation Tabs */}
      <div className="bg-white border border-[#E1E7EF] rounded-2xl p-2 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Access Control vs Catalogue Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMainTab("access_control")}
            className={`h-11 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all cursor-pointer border ${
              mainTab === "access_control"
                ? "bg-[#2468B2] text-white border-[#2468B2] shadow-sm ring-2 ring-[#2468B2]/20"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Class Access & Lock Control (Classes 6 – 8)</span>
          </button>

          <button
            type="button"
            onClick={() => setMainTab("catalogue")}
            className={`h-11 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all cursor-pointer border ${
              mainTab === "catalogue"
                ? "bg-[#0F172A] text-white border-[#0F172A] shadow-sm ring-2 ring-slate-900/20"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Catalogue View</span>
          </button>
        </div>

        {/* Right: Class Filter Pill Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase px-2">Filter Class:</span>
          {(["all", "6", "7", "8"] as ClassFilterKey[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setClassFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                classFilter === c
                  ? "bg-white text-[#2468B2] shadow-2xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {c === "all" ? "All (6–8)" : `Class ${c}`}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Filter Bar & Search */}
      <div className="bg-white border border-[#E1E7EF] rounded-2xl p-3.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveSubjectTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeSubjectTab === "all"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-white"
            }`}
          >
            All Subjects ({exams.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubjectTab("math")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeSubjectTab === "math"
                ? "bg-[#2468B2] text-white border-[#2468B2]"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-white"
            }`}
          >
            Mathematics ({mathExams.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubjectTab("english")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeSubjectTab === "english"
                ? "bg-purple-700 text-white border-purple-700"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-white"
            }`}
          >
            English ({englishExams.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            style={{ paddingLeft: "2.25rem" }}
            placeholder="Search papers by code, title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pr-3 text-xs bg-[#F4F7FB]/80 border border-[#E1E7EF] rounded-xl text-[#182338] font-semibold focus:outline-none focus:border-[#2468B2] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* 5. Access Control Matrix View */}
      {mainTab === "access_control" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Managing Candidate Access for {filteredExams.length} Examination Papers
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Click class pills [6, 7, 8] or lock switches to update permissions instantly.
            </span>
          </div>

          <div className="space-y-3">
            {filteredExams.map((exam, idx) => {
              const isLocked = ExamLockService.isExamLocked(exam.id);
              const visibleClasses = ExamLockService.getVisibleClasses(exam.id, Number(exam.grade) || 6);
              const count = exam.questionIds?.length || exam.totalQuestions || 50;

              return (
                <div
                  key={exam.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isLocked
                      ? "bg-slate-50/50 border-slate-200/90"
                      : "bg-white border-blue-200/90 shadow-sm"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Left: Info */}
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-50 to-sky-100 border border-indigo-200 text-[#2468B2] flex flex-col items-center justify-center font-mono shadow-2xs">
                        <span className="text-[8px] font-bold text-slate-500 uppercase leading-none">Paper</span>
                        <span className="text-sm font-black leading-tight">{(idx + 1).toString().padStart(2, "0")}</span>
                      </div>

                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#2468B2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                            {exam.code}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold font-mono">
                            {count} Qs · {exam.totalMarks || 60} Marks
                          </span>
                          {exam.id === "exam_imo_2022_g6_setb" && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-black flex items-center gap-1">
                              <Boxes className="w-3 h-3 text-amber-700" />
                              3D Dice Lab Q1
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {exam.title}
                          </h3>
                          {exam.subtitle && (
                            <p className="text-xs font-semibold text-[#2468B2]">{exam.subtitle}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Class Visibility Selector (6, 7, 8) */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-1.5 shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Visible to Classes:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {[6, 7, 8].map((classNum) => {
                          const isAssigned = visibleClasses.includes(classNum);
                          return (
                            <button
                              key={classNum}
                              type="button"
                              onClick={() => handleToggleClass(exam.id, classNum, Number(exam.grade) || 6)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 border ${
                                isAssigned
                                  ? "bg-[#2468B2] text-white border-[#1C5190] shadow-2xs"
                                  : "bg-white text-slate-400 border-slate-200 hover:text-slate-700 hover:border-slate-300"
                              }`}
                              title={`Toggle visibility for Class ${classNum}`}
                            >
                              {isAssigned && <Check className="w-3 h-3 stroke-[3]" />}
                              <span>Class {classNum}</span>
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => handleSetAllClasses(exam.id, [6, 7, 8])}
                          className="px-2 py-1.5 rounded-lg text-[10px] font-bold text-slate-500 hover:text-slate-900 bg-slate-200/60 hover:bg-slate-200 transition-all cursor-pointer"
                          title="Assign to all classes 6, 7, and 8"
                        >
                          All (6-8)
                        </button>
                      </div>
                    </div>

                    {/* Right: Lock Toggle & Actions */}
                    <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                      {/* Lock Status Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleLock(exam.id)}
                        className={`h-11 px-4 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer border shadow-2xs ${
                          isLocked
                            ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/80"
                            : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100/80 ring-2 ring-emerald-500/20"
                        }`}
                      >
                        {isLocked ? (
                          <>
                            <Lock className="w-4 h-4 text-rose-600" />
                            <span>LOCKED (Hidden)</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-4 h-4 text-emerald-600" />
                            <span>UNLOCKED (Open)</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={`/exam/${exam.id}`}
                        className="h-11 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
                        title="Preview examination as candidate"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </Link>

                      <Link
                        href={`${roleBase}/exams/${exam.id}`}
                        className="h-11 px-3.5 rounded-xl bg-[#2468B2] hover:bg-[#1C5190] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
                      >
                        <span>Edit</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Catalogue Card Grid View */}
      {mainTab === "catalogue" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExams.map((exam, idx) => {
            const isLocked = ExamLockService.isExamLocked(exam.id);
            const visibleClasses = ExamLockService.getVisibleClasses(exam.id, Number(exam.grade) || 6);
            const count = exam.questionIds?.length || exam.totalQuestions || 50;

            return (
              <div
                key={exam.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-4 hover:border-[#2468B2] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-xs text-[#2468B2] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                      {exam.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleLock(exam.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 border cursor-pointer ${
                        isLocked
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      {isLocked ? <Lock className="w-3 h-3 text-rose-600" /> : <Unlock className="w-3 h-3 text-emerald-600" />}
                      <span>{isLocked ? "Locked" : "Open"}</span>
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">{exam.title}</h3>
                    {exam.subtitle && (
                      <p className="text-xs font-semibold text-[#2468B2] mt-0.5">{exam.subtitle}</p>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {exam.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#2468B2]" />
                      {exam.durationMinutes} mins
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      {count} questions
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                    <span className="text-slate-400">Classes:</span>
                    {visibleClasses.map((c) => (
                      <span key={c} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono">
                        Cl-{c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Link
                    href={`/exam/${exam.id}`}
                    className="flex-1 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Test</span>
                  </Link>
                  <Link
                    href={`${roleBase}/exams/${exam.id}`}
                    className="flex-1 h-9 rounded-xl bg-[#2468B2] hover:bg-[#1C5190] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition-all"
                  >
                    <span>Manage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
