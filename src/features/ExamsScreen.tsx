"use client";

import { useAuth } from "@/context/AuthContext";
import { ROLE_PREFIX } from "@/lib/auth/sections";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { examRepository, userRepository } from "@/repositories";
import { examRoute, examDetailRoute } from "@/lib/routes";
import { logError, userMessageFor } from "@/lib/logger";
import { Exam } from "@/types/exam";
import { UserProfile } from "@/lib/auth/rbac";
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
  Users,
  Table as TableIcon,
  Sparkles,
} from "lucide-react";
import { ExamLockService, MAX_ATTEMPT_CHOICES } from "@/services/exam/ExamLockService";

import { studentCode } from "@/lib/students/roster";

/** The classes a paper may be assigned to: its own class plus any it was opened to. */
const classesFor = (exam: Exam) => {
  const own = Number(exam.grade) || 6;
  return Array.from(new Set([own, ...ExamLockService.getVisibleClasses(exam.id, own)])).sort((a, b) => a - b);
};

type MainViewTab = "table" | "access_control" | "catalogue";
type SubjectTabKey = "all" | "math" | "english";
type ClassFilterKey = "all" | "6" | "7" | "8";

export default function ExamsScreen() {
  const { user, activeRole } = useAuth();
  const roleBase = ROLE_PREFIX[activeRole];
  const isTeacher = activeRole === "TEACHER";
  const [exams, setExams] = useState<Exam[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Navigation tabs
  const [mainTab, setMainTab] = useState<MainViewTab>("table");
  const [classFilter, setClassFilter] = useState<ClassFilterKey>("all");
  const [activeSubjectTab, setActiveSubjectTab] = useState<SubjectTabKey>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [loading, setLoading] = useState(true);
  const [lockVersion, setLockVersion] = useState(0);

  // Alignment Modal State
  const [aligningExam, setAligningExam] = useState<Exam | null>(null);
  const [onboardedStudents, setOnboardedStudents] = useState<UserProfile[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentFilterClass, setStudentFilterClass] = useState<string>("all");
  const [studentFilterSection, setStudentFilterSection] = useState<string>("all");
  const [studentSearchTerm, setStudentSearchTerm] = useState<string>("");
  const [isSavingAlignment, setIsSavingAlignment] = useState(false);
  /** Sittings each assigned student may take; null = unlimited. */
  const [alignMaxAttempts, setAlignMaxAttempts] = useState<number | null>(null);
  const [alignmentSuccess, setAlignmentSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      // The papers and the student roster load independently: a roster that cannot be
      // read must not hide the papers, and vice versa.
      const [exData, uData] = await Promise.allSettled([
        examRepository.listExams(),
        userRepository.listUsers(),
      ]);
      if (exData.status === "fulfilled") setExams(exData.value);
      else logError("EXAM_LOAD_FAILED", { operation: "listExams" }, exData.reason);
      if (uData.status === "fulfilled") setOnboardedStudents(uData.value.filter((u) => u.role === "STUDENT"));
      else {
        logError("FIRESTORE_QUERY_FAILED", { operation: "listUsers" }, uData.reason);
        setActionError("The student list could not be loaded, so exams cannot be added to students right now. Please refresh.");
      }
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    const unsub = ExamLockService.subscribe(() => {
      setLockVersion((v) => v + 1);
    });
    return unsub;
  }, []);

  const [actionError, setActionError] = useState<string | null>(null);

  /** Lock/class changes that fail to reach the server are rolled back and reported. */
  const runLockChange = async (change: () => Promise<unknown>) => {
    setActionError(null);
    try {
      await change();
    } catch (err) {
      setActionError(
        `That change was not saved, so candidates still see the previous setting. ${userMessageFor(err, "the server").replace(" be loaded", " be reached")}`
      );
    } finally {
      setLockVersion((v) => v + 1);
    }
  };

  const handleToggleLock = (examId: string) => runLockChange(() => ExamLockService.toggleExamLocked(examId));

  const handleToggleClass = (examId: string, classNum: number, defaultGrade?: number) =>
    runLockChange(() => ExamLockService.toggleExamClass(examId, classNum, defaultGrade || 6));

  const handleSetAllClasses = (examId: string, classes: number[]) =>
    runLockChange(() => ExamLockService.setVisibleClasses(examId, classes));

  // Alignment Handlers
  const handleOpenAlignModal = (exam: Exam) => {
    setAligningExam(exam);
    // Matched by uid or email, so students assigned under an older id still show as ticked.
    setSelectedStudentIds(
      onboardedStudents.filter((s) => ExamLockService.isStudentAssigned(exam.id, s)).map((s) => s.id)
    );
    setStudentFilterClass(String(exam.grade || 6));
    setStudentFilterSection("all");
    setStudentSearchTerm("");
    setAlignMaxAttempts(ExamLockService.getMaxAttempts(exam.id));
    setAlignmentSuccess(false);
  };

  const handleToggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleSelectAllFilteredStudents = (targetStudents: UserProfile[]) => {
    const ids = targetStudents.map((s) => s.id);
    setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const handleDeselectAllFilteredStudents = (targetStudents: UserProfile[]) => {
    const idsToRemove = new Set(targetStudents.map((s) => s.id));
    setSelectedStudentIds((prev) => prev.filter((id) => !idsToRemove.has(id)));
  };

  const handleSaveAlignment = async () => {
    if (!aligningExam) return;
    setIsSavingAlignment(true);
    setActionError(null);
    try {
      // Each student is saved with their class, so the paper reaches exactly them.
      const byId = new Map(onboardedStudents.map((s) => [s.id, s]));
      const chosen = selectedStudentIds
        .map((id) => byId.get(id))
        .filter((s): s is UserProfile => Boolean(s))
        .map((s) => ({
          id: s.id,
          email: s.email,
          name: s.name,
          grade: Number(s.grade) || Number(aligningExam.grade) || 6,
          ...(s.section ? { section: s.section } : {}),
        }));
      await ExamLockService.assignStudents(aligningExam.id, chosen, alignMaxAttempts);
      setAlignmentSuccess(true);
      setTimeout(() => {
        setAligningExam(null);
        setAlignmentSuccess(false);
      }, 1200);
    } catch (err) {
      setActionError(
        `The exam was not added, so students do not see it yet. ${userMessageFor(err, "the server").replace(" be loaded", " be reached")}`
      );
    } finally {
      setIsSavingAlignment(false);
      setLockVersion((v) => v + 1);
    }
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

      const isLocked = ExamLockService.isExamLocked(e.id);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "unlocked" && !isLocked) ||
        (statusFilter === "locked" && isLocked);

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [exams, mathExams, englishExams, activeSubjectTab, searchTerm, classFilter, statusFilter, lockVersion]);

  // Only students of the paper's class(es) can be assigned to it.
  const alignClasses = useMemo(() => (aligningExam ? classesFor(aligningExam) : []), [aligningExam, lockVersion]);
  const modalFilteredStudents = useMemo(() => {
    return onboardedStudents.filter((s) => {
      const grade = Number(s.grade) || 6;
      if (!alignClasses.includes(grade)) return false;
      const matchesClass = studentFilterClass === "all" || String(grade) === studentFilterClass;
      const matchesSection = studentFilterSection === "all" || (s.section || "") === studentFilterSection;
      const matchesSearch =
        s.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        studentCode(s).toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        (s.email && s.email.toLowerCase().includes(studentSearchTerm.toLowerCase())) ||
        (s.schoolName && s.schoolName.toLowerCase().includes(studentSearchTerm.toLowerCase()));
      return matchesClass && matchesSection && matchesSearch;
    });
  }, [onboardedStudents, studentFilterClass, studentFilterSection, studentSearchTerm, alignClasses]);

  /** Sections present among the students of the paper's class(es). */
  const alignSections = useMemo(
    () =>
      Array.from(
        new Set(
          onboardedStudents
            .filter((s) => alignClasses.includes(Number(s.grade) || 6) && s.section)
            .map((s) => s.section as string)
        )
      ).sort(),
    [onboardedStudents, alignClasses]
  );

  return (
    <div className="space-y-6 animate-rise-in font-sans text-[#182338]">
      {actionError && (
        <div role="alert" className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-[13px] font-semibold text-rose-800 flex items-start justify-between gap-3">
          <span>{actionError}</span>
          <button type="button" onClick={() => setActionError(null)} className="shrink-0 text-rose-700 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="bg-white/85 backdrop-blur-sm border border-slate-200/90 shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_2px_10px_-4px_rgba(38,45,90,0.10)] rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#2468B2]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isTeacher ? "Faculty Paper & Alignment Controller" : "Staff Administration & Lock Controller"}</span>
            <span className="text-[#667085]">•</span>
            <span>Classwise &amp; Subjectwise Papers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#182338] mt-1">
            Question Papers &amp; Student Alignment
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            View question papers in table format, filter strictly by class and subject, and align any paper to onboarded student candidates.
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
        <div className="flex flex-wrap items-center gap-2">
          {/* Table Format Mode */}
          <button
            type="button"
            onClick={() => setMainTab("table")}
            className={`h-10 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer border ${
              mainTab === "table"
                ? "bg-[#2468B2] text-white border-[#2468B2] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>Table Format (Filters &amp; Alignment)</span>
          </button>

          {/* Access Control Matrix Mode */}
          <button
            type="button"
            onClick={() => setMainTab("access_control")}
            className={`h-10 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer border ${
              mainTab === "access_control"
                ? "bg-[#182338] text-white border-[#182338] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Class Access Matrix</span>
          </button>

          {/* Catalogue Card View */}
          <button
            type="button"
            onClick={() => setMainTab("catalogue")}
            className={`h-10 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer border ${
              mainTab === "catalogue"
                ? "bg-[#0F172A] text-white border-[#0F172A] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Catalogue Cards</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-semibold px-2">
          Showing <strong className="text-[#2468B2]">{filteredExams.length}</strong> of {exams.length} papers
        </span>
      </div>

      {/* 4. Dropdown & Search Toolbar */}
      <div className="bg-white border border-[#E1E7EF] rounded-2xl p-4 shadow-subtle flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2.5 flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search paper title, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] font-semibold focus:outline-none focus:border-[#2468B2] focus:bg-white"
            />
          </div>

          {/* Subject Dropdown */}
          <select
            value={activeSubjectTab}
            onChange={(e) => setActiveSubjectTab(e.target.value as SubjectTabKey)}
            className="h-9 px-3 text-xs font-bold bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] focus:outline-none focus:border-[#2468B2] cursor-pointer"
          >
            <option value="all">All Subjects (Math &amp; English)</option>
            <option value="math">Mathematics (IMO)</option>
            <option value="english">English (IEO)</option>
          </select>

          {/* Class Dropdown */}
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value as ClassFilterKey)}
            className="h-9 px-3 text-xs font-bold bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] focus:outline-none focus:border-[#2468B2] cursor-pointer"
          >
            <option value="all">All Classes (6, 7, 8)</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-9 px-3 text-xs font-bold bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] focus:outline-none focus:border-[#2468B2] cursor-pointer"
          >
            <option value="all">All Access Statuses</option>
            <option value="unlocked">Unlocked (Open for Students)</option>
            <option value="locked">Locked (Restricted)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setSearchTerm("");
            setActiveSubjectTab("all");
            setClassFilter("all");
            setStatusFilter("all");
          }}
          className="text-xs text-slate-500 hover:text-[#2468B2] font-bold cursor-pointer self-end lg:self-center"
        >
          Reset Filters
        </button>
      </div>

      {/* 5. TABLE FORMAT VIEW (Requirement: Tables format for papers with dropdowns/filters & alignment) */}
      {mainTab === "table" && (
        <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl shadow-subtle overflow-hidden">
          {filteredExams.length === 0 ? (
            <div className="py-16 px-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF2FC] text-[#2468B2] flex items-center justify-center mx-auto border border-[#E1E7EF]">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#182338]">No Matching Examination Papers</h3>
                <p className="text-xs text-[#667085] max-w-md mx-auto">
                  Try adjusting your class, subject, or search filters above.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[1040px] text-left text-xs font-semibold">
                <thead className="bg-[#F4F7FB] text-[#667085] border-b border-[#E1E7EF] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-3.5 w-[240px]">Examination Paper</th>
                    <th className="py-3 px-3 w-[130px]">Subject</th>
                    <th className="py-3 px-2 w-[80px] text-center">Class</th>
                    <th className="py-3 px-2 w-[110px] text-center">Questions</th>
                    <th className="py-3 px-2 w-[100px] text-center">Duration</th>
                    <th className="py-3 px-2.5 w-[140px] text-center">Access Status</th>
                    <th className="py-3 px-2.5 w-[150px] text-center">Assigned Students</th>
                    <th className="py-3 px-3.5 w-[210px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E7EF] text-[#182338]">
                  {filteredExams.map((exam) => {
                    const isLocked = ExamLockService.isExamLocked(exam.id);
                    const visibleClasses = ExamLockService.getVisibleClasses(exam.id, Number(exam.grade) || 6);
                    const assignedStudents = ExamLockService.getAssignedStudents(exam.id);
                    const count = exam.questionIds?.length || exam.totalQuestions || 50;
                    const isEnglish = (exam.title || "").toLowerCase().includes("eng") || (exam.code || "").startsWith("IEO");

                    return (
                      <tr key={exam.id} className="hover:bg-white/70 transition-colors">
                        <td className="py-3 px-3.5">
                          <div className="font-bold text-xs text-[#182338] line-clamp-1" title={exam.title}>
                            {exam.title}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[10px] text-[#2468B2] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                              {exam.code}
                            </span>
                            {exam.subtitle && (
                              <span className="text-[10px] text-slate-500 truncate max-w-[150px]">
                                {exam.subtitle}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              isEnglish
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-blue-50 text-[#2468B2] border border-blue-200"
                            }`}
                          >
                            {isEnglish ? "English (IEO)" : "Mathematics (IMO)"}
                          </span>
                        </td>

                        <td className="py-3 px-2 text-center">
                          <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-slate-100 text-slate-800 border border-slate-200 inline-block">
                            Class {exam.grade || 6}
                          </span>
                        </td>

                        <td className="py-3 px-2 text-center font-mono font-bold text-xs text-slate-800">
                          {count} Questions
                        </td>

                        <td className="py-3 px-2 text-center font-mono text-xs text-slate-600">
                          {exam.durationMinutes} mins
                        </td>

                        <td className="py-3 px-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleLock(exam.id)}
                            className={`px-2.5 py-1 rounded-full text-[10.5px] font-black uppercase flex items-center justify-center gap-1 mx-auto border transition-all cursor-pointer ${
                              isLocked
                                ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                                : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                            }`}
                            title="Click to toggle lock state"
                          >
                            {isLocked ? <Lock className="w-3 h-3 text-rose-600" /> : <Unlock className="w-3 h-3 text-emerald-600" />}
                            <span>{isLocked ? "Locked" : "Unlocked"}</span>
                          </button>
                        </td>

                        <td className="py-3 px-2.5 text-center">
                          {assignedStudents.length > 0 ? (
                            <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{assignedStudents.length} Assigned</span>
                            </span>
                          ) : isLocked ? (
                            <span className="text-[10px] text-slate-500 font-medium">Not assigned</span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-medium">
                              All Visible (Cl {visibleClasses.join(",")})
                            </span>
                          )}
                          <span className="block text-[10px] text-slate-500 font-medium mt-0.5">
                            {ExamLockService.getMaxAttempts(exam.id) === null
                              ? "Unlimited attempts"
                              : `${ExamLockService.getMaxAttempts(exam.id)} attempt${ExamLockService.getMaxAttempts(exam.id) === 1 ? "" : "s"}`}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {/* Align to Students Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenAlignModal(exam)}
                              className="h-7 px-2.5 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                              title="Align this examination paper to specific onboarded students"
                            >
                              <Users className="w-3 h-3" />
                              <span>Add to Students</span>
                            </button>

                            <Link
                              href={examRoute(exam.id)}
                              className="h-7 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1"
                              title="Preview paper as candidate"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Preview</span>
                            </Link>

                            <Link
                              href={examDetailRoute(roleBase, exam.id)}
                              className="h-7 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1"
                            >
                              <span>Edit</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 6. CLASS ACCESS CONTROL MATRIX VIEW */}
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

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-xs text-[#2468B2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                            {exam.code}
                          </span>
                          <span className="font-bold text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            Class {exam.grade || 6}
                          </span>
                          <span className="text-xs text-slate-500">
                            {count} Questions &bull; {exam.durationMinutes} mins
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-slate-900 mt-1 leading-snug">
                          {exam.title}
                        </h3>

                        {exam.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            {exam.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Middle: Class Selector Matrix */}
                    <div className="flex items-center gap-2 shrink-0 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase px-1">Allowed Classes:</span>
                      {[6, 7, 8].map((c) => {
                        const active = visibleClasses.includes(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleToggleClass(exam.id, c, Number(exam.grade) || 6)}
                            className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer border ${
                              active
                                ? "bg-[#2468B2] text-white border-[#2468B2] shadow-2xs"
                                : "bg-white text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-100"
                            }`}
                            title={`Toggle visibility for Class ${c}`}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
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

                      <button
                        type="button"
                        onClick={() => handleOpenAlignModal(exam)}
                        className="h-11 px-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2468B2] border border-blue-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Add to Students</span>
                      </button>

                      <Link
                        href={examRoute(exam.id)}
                        className="h-11 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. CATALOGUE CARD GRID VIEW */}
      {mainTab === "catalogue" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExams.map((exam) => {
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
                  <button
                    type="button"
                    onClick={() => handleOpenAlignModal(exam)}
                    className="flex-1 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2468B2] border border-blue-200 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Add to Students</span>
                  </button>
                  <Link
                    href={examRoute(exam.id)}
                    className="flex-1 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 8. ALIGN PAPER TO ONBOARDED STUDENTS MODAL */}
      {aligningExam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 animate-rise-in max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EAF2FC] text-[#2468B2] flex items-center justify-center border border-blue-200">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#2468B2] uppercase tracking-wider">
                    Add Exam to Students
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {aligningExam.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Code: {aligningExam.code} &bull; Class {alignClasses.join(", ")} students only
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAligningExam(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Actions & Filters Bar */}
            <div className="space-y-3 shrink-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search candidate name or roll ID..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-[#2468B2]"
                  />
                </div>

                {/* Class Filter */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {(alignClasses.length > 1 ? ["all", ...alignClasses.map(String)] : alignClasses.map(String)).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setStudentFilterClass(c)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        studentFilterClass === c
                          ? "bg-white text-[#2468B2] shadow-2xs border border-slate-200"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {c === "all" ? "All" : `Class ${c}`}
                    </button>
                  ))}
                </div>
              </div>

              {alignSections.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap" role="group" aria-label="Filter by section">
                  <span className="text-[11px] font-bold text-slate-500 mr-1">Section:</span>
                  {["all", ...alignSections].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setStudentFilterSection(sec)}
                      aria-pressed={studentFilterSection === sec}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer border ${
                        studentFilterSection === sec
                          ? "bg-[#2468B2] text-white border-[#2468B2]"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {sec === "all" ? "All" : sec}
                    </button>
                  ))}
                </div>
              )}

              {/* Attempts allowed */}
              <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <label htmlFor="align-max-attempts" className="text-xs font-bold text-slate-700">
                  Attempts allowed per student
                </label>
                <select
                  id="align-max-attempts"
                  value={alignMaxAttempts === null ? "unlimited" : String(alignMaxAttempts)}
                  onChange={(e) => setAlignMaxAttempts(e.target.value === "unlimited" ? null : Number(e.target.value))}
                  className="h-8 px-2.5 text-xs font-bold bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#2468B2] cursor-pointer"
                >
                  {Array.from({ length: MAX_ATTEMPT_CHOICES }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "attempt" : "attempts"}
                    </option>
                  ))}
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>

              {/* Bulk Toggle Buttons */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectAllFilteredStudents(modalFilteredStudents)}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#2468B2] border border-blue-200 font-bold hover:bg-blue-100 cursor-pointer"
                  >
                    Select All ({modalFilteredStudents.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeselectAllFilteredStudents(modalFilteredStudents)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    Deselect Filtered
                  </button>
                </div>

                <span className="font-bold text-slate-600">
                  <strong className="text-[#2468B2]">{selectedStudentIds.length}</strong> candidates selected
                </span>
              </div>
            </div>

            {/* Students Selection List */}
            <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100 max-h-[360px]">
              {modalFilteredStudents.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 font-medium">
                  No Class {alignClasses.join(" / ")} students match this search.
                </div>
              ) : (
                modalFilteredStudents.map((s) => {
                  const isChecked = selectedStudentIds.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isChecked ? "bg-blue-50/60" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleStudentSelection(s.id)}
                          className="w-4 h-4 rounded text-[#2468B2] border-slate-300 focus:ring-[#2468B2] cursor-pointer"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-slate-900 block truncate">{s.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            {studentCode(s)} &bull; Class {Number(s.grade) || 6}
                            {s.section ? `-${s.section}` : ""}
                            {s.email ? <> &bull; {s.email}</> : null}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                          isChecked
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {isChecked ? "Selected" : "Not added"}
                      </span>
                    </label>
                  );
                })
              )}
            </div>

            {/* Footer with Save Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                {alignmentSuccess ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Exam added. It is on the selected students&apos; dashboards now.</span>
                  </span>
                ) : (
                  <span>Selected students see this exam on their dashboard as soon as you add it.</span>
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAligningExam(null)}
                  className="h-10 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSavingAlignment}
                  onClick={handleSaveAlignment}
                  className="h-10 px-5 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
                >
                  {isSavingAlignment ? (
                    <span>Adding...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>
                        Add Exam{selectedStudentIds.length > 0 ? ` (${selectedStudentIds.length} student${selectedStudentIds.length === 1 ? "" : "s"})` : ""}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
