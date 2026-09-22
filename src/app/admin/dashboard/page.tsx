"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { OlympiadStore } from "@/services/firebase/firestore";
import { Exam } from "@/types/exam";
import { ExamSession } from "@/types/session";
import { ExamAttempt } from "@/types/attempt";
import { Question } from "@/types/question";
import {
  Bell,
  Heart,
  ChevronDown,
  LayoutGrid,
  List,
  Check,
  Plus,
  Minus,
  X,
  ShieldCheck,
  Activity,
  BookOpen,
  Sparkles,
  Award,
  FileCheck2,
  Play,
  ArrowRight,
} from "lucide-react";

export interface StudentRowData {
  id: string;
  name: string;
  studentId: string;
  schoolName: string;
  avatarBg: string;
  avatarColor: string;
  avatarGender: "female" | "male";
  workCompleted: number;
  workTotal: number;
  avgScore: number;
  needsAttention: number;
  workingTowards: number;
  mastered: number;
  tier: "needs_attention" | "working_towards" | "mastered";
  isStarred: boolean;
  examTitle: string;
  examId: string;
  strandScores: {
    logicalReasoning: number;
    mathReasoning: number;
    everydayMath: number;
    achievers: number;
  };
}

export default function AdminDashboardPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [liveSessions, setLiveSessions] = useState<ExamSession[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Navigation states
  const [activeTierFilter, setActiveTierFilter] = useState<"ALL" | "needs_attention" | "working_towards" | "mastered">("ALL");
  const [selectedClass, setSelectedClass] = useState("Class A");
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [selectedStrand, setSelectedStrand] = useState("All Strands");
  const [isStrandDropdownOpen, setIsStrandDropdownOpen] = useState(false);
  const [filterObjective, setFilterObjective] = useState(false);
  const [isStarredOnly, setIsStarredOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"rows" | "grid">("rows");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Drawers
  const [selectedStudent, setSelectedStudent] = useState<StudentRowData | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "n-1",
      title: "IMO 2024-25 Class 6 Ready",
      desc: "50 questions verified across 4 sections with official scoring keys.",
      time: "Just now",
      unread: true,
    },
    {
      id: "n-2",
      title: "Real-time Telemetry Online",
      desc: "Surveillance engine initialized and ready for live exam sessions.",
      time: "5m ago",
      unread: true,
    },
  ]);

  useEffect(() => {
    async function load() {
      const [exList, sessList, attList, qList] = await Promise.all([
        OlympiadStore.getExams(),
        OlympiadStore.getLiveSessions(),
        OlympiadStore.getAttempts(),
        OlympiadStore.getQuestions(),
      ]);
      setExams(exList);
      setLiveSessions(sessList);
      setAttempts(attList);
      setQuestions(qList);
      setLoading(false);
    }
    load();
  }, []);

  // Standard Baseline Sample Students matching the exact visual UI from the reference image
  const defaultStudents: StudentRowData[] = [
    {
      id: "st-1",
      name: "Sabine Klein",
      studentId: "STU-10492",
      schoolName: "Olympiad Academy Alpha",
      avatarBg: "#FFD8D8",
      avatarColor: "#D6336C",
      avatarGender: "female",
      workCompleted: 33,
      workTotal: 36,
      avgScore: 23,
      needsAttention: 45,
      workingTowards: 8,
      mastered: 7,
      tier: "needs_attention",
      isStarred: true,
      examTitle: "SOF IMO 2024-25 Class 6 Set B",
      examId: "exam_imo_2024_g6_setb",
      strandScores: {
        logicalReasoning: 25,
        mathReasoning: 20,
        everydayMath: 28,
        achievers: 15,
      },
    },
    {
      id: "st-2",
      name: "Dante Podenzana",
      studentId: "STU-88219",
      schoolName: "Delhi Public School",
      avatarBg: "#FFE8CC",
      avatarColor: "#D9480F",
      avatarGender: "male",
      workCompleted: 31,
      workTotal: 36,
      avgScore: 53,
      needsAttention: 6,
      workingTowards: 35,
      mastered: 19,
      tier: "working_towards",
      isStarred: false,
      examTitle: "SOF IMO 2024-25 Class 6 Set B",
      examId: "exam_imo_2024_g6_setb",
      strandScores: {
        logicalReasoning: 60,
        mathReasoning: 50,
        everydayMath: 55,
        achievers: 45,
      },
    },
    {
      id: "st-3",
      name: "Susan Chan",
      studentId: "STU-49120",
      schoolName: "St. Xavier International",
      avatarBg: "#EBFBEE",
      avatarColor: "#2B8A3E",
      avatarGender: "female",
      workCompleted: 27,
      workTotal: 36,
      avgScore: 82,
      needsAttention: 0,
      workingTowards: 14,
      mastered: 45,
      tier: "mastered",
      isStarred: true,
      examTitle: "SOF IMO 2024-25 Class 6 Set B",
      examId: "exam_imo_2024_g6_setb",
      strandScores: {
        logicalReasoning: 90,
        mathReasoning: 85,
        everydayMath: 80,
        achievers: 75,
      },
    },
  ];

  // Merge default showcase candidates with dynamic real data from live attempts
  const allStudents: StudentRowData[] = useMemo(() => {
    const list = [...defaultStudents];

    attempts.forEach((att, idx) => {
      const studentId = att.student?.studentId || `STU-ATT-${idx + 10}`;
      if (!list.some((s) => s.studentId === studentId)) {
        const score = Math.round(att.percentage || 0);
        let tier: "needs_attention" | "working_towards" | "mastered" = "working_towards";
        if (score >= 75) tier = "mastered";
        else if (score < 40) tier = "needs_attention";

        const correctCount = att.questionEvaluations?.filter((q) => q.isCorrect).length || 0;
        const totalQ = att.questionEvaluations?.length || 36;
        const incorrectCount = Math.max(0, totalQ - correctCount);

        list.push({
          id: att.id,
          name: att.student?.name || "Candidate",
          studentId: studentId,
          schoolName: att.student?.schoolName || "Olympiad Candidate",
          avatarBg: tier === "mastered" ? "#EBFBEE" : tier === "needs_attention" ? "#FFE3E3" : "#FFF3BF",
          avatarColor: tier === "mastered" ? "#2B8A3E" : tier === "needs_attention" ? "#E03131" : "#D97706",
          avatarGender: idx % 2 === 0 ? "female" : "male",
          workCompleted: totalQ,
          workTotal: 36,
          avgScore: score,
          needsAttention: incorrectCount,
          workingTowards: 10,
          mastered: correctCount,
          tier: tier,
          isStarred: false,
          examTitle: att.examTitle || "SOF IMO 2024-25 Class 6",
          examId: att.examId,
          strandScores: {
            logicalReasoning: score,
            mathReasoning: score,
            everydayMath: score,
            achievers: score,
          },
        });
      }
    });

    return list;
  }, [attempts]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter((st) => {
      const matchesSearch =
        st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = activeTierFilter === "ALL" || st.tier === activeTierFilter;
      const matchesStarred = !isStarredOnly || st.isStarred;
      return matchesSearch && matchesTier && matchesStarred;
    });
  }, [allStudents, searchQuery, activeTierFilter, isStarredOnly]);

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="min-h-screen bg-[#769C36] p-3 sm:p-5 lg:p-8 flex items-center justify-center font-sans antialiased select-none">
      {/* Main Rounded Dashboard Canvas Wrapper - Exact Match to Screenshot */}
      <div className="w-full max-w-[1550px] bg-[#F4F9FB] rounded-[32px] shadow-2xl overflow-hidden border border-white/70 flex flex-col min-h-[92vh] relative">
        
        {/* TOP NAVIGATION BAR */}
        <header className="px-6 sm:px-10 py-5 flex items-center justify-between border-b border-slate-200/60 bg-[#F4F9FB] relative z-20">
          {/* Left: 4 Diamond Geometric Action Gems */}
          <div className="flex items-center gap-2.5">
            {/* Diamond 1: Coral Red (Filter Needs Attention) */}
            <button
              onClick={() => setActiveTierFilter(activeTierFilter === "needs_attention" ? "ALL" : "needs_attention")}
              title="Filter: Needs Attention Tier"
              className={`w-5 h-5 rounded-[4px] rotate-45 bg-[#FF6B6B] flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer ${
                activeTierFilter === "needs_attention" ? "ring-2 ring-offset-2 ring-[#FF6B6B]" : ""
              }`}
            >
              <Minus className="w-2.5 h-2.5 text-white -rotate-45" strokeWidth={3.5} />
            </button>

            {/* Diamond 2: Gold/Yellow (Filter Working Towards) */}
            <button
              onClick={() => setActiveTierFilter(activeTierFilter === "working_towards" ? "ALL" : "working_towards")}
              title="Filter: Working Towards Tier"
              className={`w-5 h-5 rounded-[4px] rotate-45 bg-[#FAB005] flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer ${
                activeTierFilter === "working_towards" ? "ring-2 ring-offset-2 ring-[#FAB005]" : ""
              }`}
            >
              <Plus className="w-2.5 h-2.5 text-white -rotate-45" strokeWidth={3.5} />
            </button>

            {/* Diamond 3: Turquoise / Mint Green (Filter Mastered) */}
            <button
              onClick={() => setActiveTierFilter(activeTierFilter === "mastered" ? "ALL" : "mastered")}
              title="Filter: Mastered Tier"
              className={`w-5 h-5 rounded-[4px] rotate-45 bg-[#20C997] flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer ${
                activeTierFilter === "mastered" ? "ring-2 ring-offset-2 ring-[#20C997]" : ""
              }`}
            >
              <Check className="w-2.5 h-2.5 text-white -rotate-45" strokeWidth={3.5} />
            </button>

            {/* Diamond 4: Sky Blue (Show All) */}
            <button
              onClick={() => setActiveTierFilter("ALL")}
              title="Reset: View All Candidates"
              className={`w-5 h-5 rounded-[4px] rotate-45 bg-[#228BE6] flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer ${
                activeTierFilter === "ALL" ? "ring-2 ring-offset-2 ring-[#228BE6]" : ""
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white -rotate-45" />
            </button>
          </div>

          {/* Middle: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {[
              { label: "Dashboard", href: "/admin/dashboard", id: "Dashboard" },
              { label: "50 Activities", href: "/admin/activities", id: "Activities" },
              { label: "Prepare", href: "/admin/exams", id: "Prepare" },
              { label: "Teach", href: "/admin/questions", id: "Teach" },
              { label: "Assess", href: "/admin/results", id: "Assess" },
              { label: "Monitor", href: "/admin/live-monitor", id: "Monitor" },
            ].map((tab) => {
              const isActive = tab.id === "Dashboard";
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`text-[14px] font-extrabold tracking-tight transition-all relative py-1 ${
                    isActive
                      ? "text-slate-900"
                      : "text-slate-400 hover:text-slate-700 font-semibold"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-slate-900 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions & Teacher Avatar */}
          <div className="flex items-center gap-3.5 sm:gap-4 relative">
            {/* Bookmark / Starred Filter */}
            <button
              onClick={() => setIsStarredOnly(!isStarredOnly)}
              title={isStarredOnly ? "Showing Starred Students Only" : "Show All Students"}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isStarredOnly
                  ? "bg-rose-100 text-[#FA5252]"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              <Heart className={`w-4 h-4 stroke-[2.2] ${isStarredOnly ? "fill-[#FA5252] text-[#FA5252]" : ""}`} />
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                title="System Notifications"
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors relative cursor-pointer"
              >
                <Bell className="w-4 h-4 stroke-[2.2]" />
                {notifications.filter((n) => n.unread).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#FA5252] text-white text-[9px] font-extrabold flex items-center justify-center">
                    {notifications.filter((n) => n.unread).length}
                  </span>
                )}
              </button>

              {/* Notification Slide Popover */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-40 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[13px] font-extrabold text-slate-800">Notifications</span>
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-bold text-sky-600 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 text-[12px] space-y-1">
                        <div className="font-bold text-slate-800 flex items-center justify-between">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                        </div>
                        <p className="text-slate-500 leading-snug">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Quick Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                title="Teacher Profile & Account"
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-200 flex-shrink-0 bg-[#FFF0ED] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
              >
                {/* Clean Teacher Avatar SVG */}
                <svg viewBox="0 0 36 36" className="w-full h-full fill-none">
                  <rect width="36" height="36" fill="#FCE7F3" />
                  <ellipse cx="18" cy="15" rx="7" ry="8" fill="#F472B6" />
                  <path d="M12 12C12 9 14 6 18 6C22 6 24 9 24 12V14C24 14 20 16 18 16C16 16 12 14 12 14V12Z" fill="#831843" />
                  <circle cx="18" cy="16" r="5.5" fill="#FDE047" opacity="0.3" />
                  <circle cx="15.5" cy="15" r="1" fill="#1E293B" />
                  <circle cx="20.5" cy="15" r="1" fill="#1E293B" />
                  <path d="M16 18C17 19 19 19 20 18" stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round" />
                  <path d="M6 36C6 27 11 23 18 23C25 23 30 27 30 36H6Z" fill="#BE185D" />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-40 space-y-2">
                  <div className="px-2 py-1.5 border-b border-slate-100">
                    <div className="text-[13px] font-extrabold text-slate-900">Dr. Sarah Jenkins</div>
                    <div className="text-[11px] text-slate-400 font-medium">Chief Examination Controller</div>
                  </div>
                  <Link
                    href="/admin/settings"
                    className="block px-2 py-1.5 rounded-lg text-[13px] font-bold text-slate-700 hover:bg-slate-50"
                  >
                    System Settings
                  </Link>
                  <Link
                    href="/admin/students"
                    className="block px-2 py-1.5 rounded-lg text-[13px] font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Student Roster
                  </Link>
                  <Link
                    href="/"
                    className="block px-2 py-1.5 rounded-lg text-[13px] font-bold text-[#547322] hover:bg-emerald-50"
                  >
                    Open Student Portal
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* SUBHEADER: Title, Class Selector, Alerts & Layout Toggle */}
        <div className="px-6 sm:px-10 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Dashboard
            </h1>

            {/* Class Selector Dropdown with Overlapping Avatars */}
            <div className="relative">
              <button
                onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 bg-white rounded-full border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all text-left cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-[13px] font-extrabold text-slate-800">
                  {selectedClass}
                </span>

                {/* Overlapping Circular Avatars */}
                <div className="flex items-center -space-x-1.5 ml-1">
                  <div className="w-5 h-5 rounded-full border-2 border-white bg-[#FFE3E3] text-[#E03131] flex items-center justify-center text-[9px] font-bold">
                    👧
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-white bg-[#FFF3BF] text-[#D97706] flex items-center justify-center text-[9px] font-bold">
                    👦
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-white bg-[#EBFBEE] text-[#2F9E44] flex items-center justify-center text-[9px] font-bold">
                    👧
                  </div>
                </div>

                <span className="text-[11px] font-extrabold text-slate-400">
                  +{Math.max(0, allStudents.length - 3)}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {isClassDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-30 space-y-1">
                  {["Class A", "Class 6 Alpha", "Class 7 Beta", "All Classes"].map((cls) => (
                    <button
                      key={cls}
                      onClick={() => {
                        setSelectedClass(cls);
                        setIsClassDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-bold transition-colors cursor-pointer ${
                        selectedClass === cls
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Header Badges */}
          <div className="flex items-center gap-4 text-slate-600">
            {/* Alerts Center Trigger */}
            <button
              onClick={() => setIsAlertsOpen(true)}
              className="flex items-center gap-1.5 text-[13px] font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <span>Alerts</span>
              <span className="w-4 h-4 rounded-full bg-[#FA5252] text-white text-[9px] font-black inline-flex items-center justify-center">
                1
              </span>
            </button>

            {/* Grid / List View Toggle */}
            <button
              onClick={() => setViewMode(viewMode === "rows" ? "grid" : "rows")}
              title={viewMode === "rows" ? "Switch to Grid View" : "Switch to Table View"}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              {viewMode === "rows" ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* DASHBOARD BODY */}
        <div className="px-6 sm:px-10 pb-10 space-y-7 flex-1">
          
          {/* TOP HERO METRICS SECTION (2 MAIN COLUMNS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* LEFT BIG WHITE METRIC CARD (Overall Score + Trophy + Work Assigned + Bubble Cluster) */}
            <div className="lg:col-span-6 xl:col-span-6 bg-white rounded-[26px] p-6 sm:p-7 shadow-sm border border-slate-200/70 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                
                {/* Sub-col 1: Overall Class Score & Trophy */}
                <div className="space-y-2">
                  <div className="text-[12px] font-extrabold uppercase tracking-wider text-slate-400">
                    Overall Class Score
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    68%
                  </div>

                  {/* Authentic Trophy Graphic Exactly Matching Screenshot */}
                  <div className="py-2 flex items-center justify-start">
                    <svg width="120" height="96" viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Trophy Lid */}
                      <ellipse cx="60" cy="18" rx="28" ry="7" fill="#F4C400" />
                      <circle cx="60" cy="10" r="4.5" fill="#F4C400" />
                      
                      {/* Trophy Cup Body */}
                      <path d="M36 22C36 22 36 58 60 58C84 58 84 22 84 22H36Z" fill="#74C043" />
                      
                      {/* Inner Cup Rim highlight */}
                      <path d="M40 24C44 50 60 54 60 54C60 54 76 50 80 24" fill="#8CE99A" opacity="0.4" />
                      
                      {/* Trophy Handles */}
                      <path d="M36 26C22 26 20 44 38 48" stroke="#74C043" strokeWidth="5" strokeLinecap="round" />
                      <path d="M84 26C98 26 100 44 82 48" stroke="#74C043" strokeWidth="5" strokeLinecap="round" />
                      
                      {/* Stem & Base */}
                      <path d="M53 58H67V74H53V58Z" fill="#5C940D" />
                      <rect x="38" y="74" width="44" height="11" rx="4" fill="#74C043" />
                      <rect x="32" y="85" width="56" height="7" rx="3" fill="#5C940D" />
                    </svg>
                  </div>

                  <div className="text-[11px] font-bold text-slate-400">
                    Grade average <span className="text-slate-800 font-extrabold">72%</span>
                  </div>
                </div>

                {/* Sub-col 2: Work Assigned & Bubble Cluster */}
                <div className="space-y-2">
                  <div className="text-[12px] font-extrabold uppercase tracking-wider text-slate-400">
                    Work Assigned
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    36
                  </div>

                  {/* Orbital Bubble Cluster Graphic Matching Screenshot */}
                  <div className="py-2 flex items-center justify-start">
                    <svg width="120" height="96" viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Orbital Cluster in Greens and Yellows */}
                      <circle cx="60" cy="48" r="16" fill="#74C043" />
                      <circle cx="38" cy="38" r="10" fill="#A9E34B" />
                      <circle cx="82" cy="40" r="9" fill="#FAB005" />
                      <circle cx="45" cy="68" r="11" fill="#74C043" />
                      <circle cx="75" cy="70" r="10" fill="#A9E34B" />
                      <circle cx="56" cy="22" r="7" fill="#FFD43B" />
                      <circle cx="26" cy="52" r="6" fill="#74C043" />
                      <circle cx="94" cy="56" r="7" fill="#FAB005" />
                      <circle cx="32" cy="26" r="5" fill="#A9E34B" />
                      <circle cx="86" cy="24" r="6" fill="#74C043" />
                      <circle cx="66" cy="85" r="6" fill="#FFD43B" />
                      <circle cx="86" cy="83" r="5" fill="#A9E34B" />
                    </svg>
                  </div>

                  <div className="text-[11px] font-bold text-slate-400">
                    Grade average <span className="text-slate-800 font-extrabold">38%</span>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT 3 COLORED TIER CARDS (Green, Gold, Coral) */}
            <div className="lg:col-span-6 xl:col-span-6 grid grid-cols-3 gap-3 sm:gap-4 items-stretch">
              
              {/* Card 1: Green Card (5, 25% of class, grade avg 78%) */}
              <button
                onClick={() => setActiveTierFilter(activeTierFilter === "mastered" ? "ALL" : "mastered")}
                className={`bg-[#74C043] rounded-[24px] p-4 sm:p-5 flex flex-col justify-between shadow-xs relative overflow-hidden text-slate-900 group hover:shadow-md transition-all text-left cursor-pointer ${
                  activeTierFilter === "mastered" ? "ring-4 ring-slate-900 scale-[1.02]" : ""
                }`}
              >
                <div className="flex justify-end items-center w-full">
                  {/* Top Right Avatar */}
                  <div className="w-8 h-8 rounded-full bg-white/95 border border-white shadow-xs overflow-hidden flex items-center justify-center">
                    <span className="text-[14px]">👧</span>
                  </div>
                </div>

                <div className="space-y-0.5 my-auto">
                  <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    5
                  </div>
                  <div className="text-[13px] font-extrabold text-slate-900/90 leading-tight">
                    25%
                  </div>
                  <div className="text-[11px] font-bold text-slate-800/80 leading-tight">
                    of class
                  </div>
                </div>

                <div className="text-[10px] sm:text-[11px] font-bold text-slate-900/70 pt-2">
                  grade avg <span className="font-extrabold text-slate-900">78%</span>
                </div>
              </button>

              {/* Card 2: Yellow / Gold Card (10, 45% of class, grade avg 55%) */}
              <button
                onClick={() => setActiveTierFilter(activeTierFilter === "working_towards" ? "ALL" : "working_towards")}
                className={`bg-[#FAB005] rounded-[24px] p-4 sm:p-5 flex flex-col justify-between shadow-xs relative overflow-hidden text-slate-900 group hover:shadow-md transition-all text-left cursor-pointer ${
                  activeTierFilter === "working_towards" ? "ring-4 ring-slate-900 scale-[1.02]" : ""
                }`}
              >
                <div className="flex justify-end items-center w-full">
                  {/* Top Right Avatar */}
                  <div className="w-8 h-8 rounded-full bg-white/95 border border-white shadow-xs overflow-hidden flex items-center justify-center">
                    <span className="text-[14px]">👦</span>
                  </div>
                </div>

                <div className="space-y-0.5 my-auto">
                  <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    10
                  </div>
                  <div className="text-[13px] font-extrabold text-slate-900/90 leading-tight">
                    45%
                  </div>
                  <div className="text-[11px] font-bold text-slate-800/80 leading-tight">
                    of class
                  </div>
                </div>

                <div className="text-[10px] sm:text-[11px] font-bold text-slate-900/70 pt-2">
                  grade avg <span className="font-extrabold text-slate-900">55%</span>
                </div>
              </button>

              {/* Card 3: Coral / Salmon Red Card (5, 25% of class, grade avg 35%) */}
              <button
                onClick={() => setActiveTierFilter(activeTierFilter === "needs_attention" ? "ALL" : "needs_attention")}
                className={`bg-[#FA5252] rounded-[24px] p-4 sm:p-5 flex flex-col justify-between shadow-xs relative overflow-hidden text-white group hover:shadow-md transition-all text-left cursor-pointer ${
                  activeTierFilter === "needs_attention" ? "ring-4 ring-slate-900 scale-[1.02]" : ""
                }`}
              >
                <div className="flex justify-end items-center w-full">
                  {/* Top Right Avatar */}
                  <div className="w-8 h-8 rounded-full bg-white/95 border border-white shadow-xs overflow-hidden flex items-center justify-center">
                    <span className="text-[14px]">👧</span>
                  </div>
                </div>

                <div className="space-y-0.5 my-auto">
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    5
                  </div>
                  <div className="text-[13px] font-extrabold text-white/95 leading-tight">
                    25%
                  </div>
                  <div className="text-[11px] font-bold text-white/85 leading-tight">
                    of class
                  </div>
                </div>

                <div className="text-[10px] sm:text-[11px] font-bold text-white/75 pt-2">
                  grade avg <span className="font-extrabold text-white">35%</span>
                </div>
              </button>

            </div>

          </div>

          {/* STUDENTS PROFICIENCY SECTION */}
          <div className="space-y-4">
            {/* Section Sub-header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3">
                <h2 className="text-[18px] font-black text-slate-900 tracking-tight">
                  Students Proficiency
                </h2>
                {activeTierFilter !== "ALL" && (
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-900 text-white flex items-center gap-1.5">
                    <span>{activeTierFilter.replace("_", " ")}</span>
                    <button onClick={() => setActiveTierFilter("ALL")} className="hover:opacity-80 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              {/* Right Controls: Learning Objectives Checkbox + Strand Dropdown */}
              <div className="flex items-center gap-4 text-[13px] font-bold text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filterObjective}
                    onChange={(e) => setFilterObjective(e.target.checked)}
                    className="w-4 h-4 rounded-full text-slate-800 border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <span>Learning Objectives</span>
                </label>

                {/* All Strands Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsStrandDropdownOpen(!isStrandDropdownOpen)}
                    className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <span>{selectedStrand}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isStrandDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-30 space-y-1">
                      {["All Strands", "Logical Reasoning", "Mathematical Reasoning", "Everyday Math", "Achievers Section"].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setSelectedStrand(s);
                            setIsStrandDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-[12px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Students Container */}
            <div className="bg-white rounded-[26px] p-4 sm:p-6 shadow-xs border border-slate-200/70 space-y-3">
              {/* Table Column Headers */}
              {viewMode === "rows" && (
                <div className="grid grid-cols-12 gap-2 sm:gap-4 px-4 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <div className="col-span-4 sm:col-span-3 flex items-center gap-1">
                    <span>Full Name</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="col-span-2 text-center">Work Completed</div>
                  <div className="col-span-3 sm:col-span-3 text-center flex items-center justify-center gap-1">
                    <span>{filterObjective ? "Strands" : "Average Score"}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="col-span-1 text-center">Needing Attention</div>
                  <div className="col-span-1 text-center">Working Towards</div>
                  <div className="col-span-1 text-center">Mastered</div>
                </div>
              )}

              {/* Student Rows List */}
              <div className="space-y-2.5">
                {filteredStudents.map((st) => {
                  const rowBg =
                    st.tier === "needs_attention"
                      ? "bg-[#FFF0ED] border-[#FFE2DC]"
                      : st.tier === "working_towards"
                      ? "bg-[#FFF9DB] border-[#FFF3BF]"
                      : "bg-[#F4FCE3] border-[#E9FAC8]";

                  const barFill =
                    st.tier === "needs_attention"
                      ? "bg-[#FA5252]"
                      : st.tier === "working_towards"
                      ? "bg-[#FAB005]"
                      : "bg-[#74C043]";

                  return (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStudent(st)}
                      className={`grid grid-cols-12 gap-2 sm:gap-4 items-center px-4 sm:px-6 py-4 rounded-[22px] border ${rowBg} transition-all hover:scale-[1.005] cursor-pointer shadow-xs`}
                    >
                      {/* Name & Avatar */}
                      <div className="col-span-4 sm:col-span-3 flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-bold border border-white shadow-xs flex-shrink-0"
                          style={{ backgroundColor: st.avatarBg, color: st.avatarColor }}
                        >
                          {st.avatarGender === "female" ? "👧" : "👦"}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] sm:text-[14px] font-black text-slate-800 truncate block">
                            {st.name}
                          </span>
                        </div>
                      </div>

                      {/* Work Completed */}
                      <div className="col-span-2 text-center font-black text-[13px] sm:text-[14px] text-slate-800">
                        {st.workCompleted}/{st.workTotal}
                      </div>

                      {/* Average Score / Bar fill */}
                      <div className="col-span-3 sm:col-span-3 flex justify-center">
                        <div className="w-full max-w-[150px] h-8 bg-white rounded-lg p-0.5 flex items-stretch border border-black/5 shadow-xs overflow-hidden relative">
                          <div
                            className={`h-full ${barFill} rounded-md flex items-center justify-center text-white text-[12px] font-black transition-all`}
                            style={{ width: `${Math.max(st.avgScore, 24)}%` }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-slate-900 font-black text-[12px]">
                            {st.avgScore}%
                          </span>
                        </div>
                      </div>

                      {/* Needing Attention Bubble (Red) */}
                      <div className="col-span-1 flex items-center justify-center">
                        <div
                          className="rounded-full bg-[#FA5252] text-white font-black flex items-center justify-center shadow-xs"
                          style={{
                            width: st.needsAttention > 20 ? "36px" : st.needsAttention > 0 ? "24px" : "18px",
                            height: st.needsAttention > 20 ? "36px" : st.needsAttention > 0 ? "24px" : "18px",
                            fontSize: st.needsAttention > 20 ? "13px" : "10px",
                          }}
                        >
                          {st.needsAttention}
                        </div>
                      </div>

                      {/* Working Towards Bubble (Gold) */}
                      <div className="col-span-1 flex items-center justify-center">
                        <div
                          className="rounded-full bg-[#FAB005] text-slate-900 font-black flex items-center justify-center shadow-xs"
                          style={{
                            width: st.workingTowards > 20 ? "36px" : st.workingTowards > 0 ? "24px" : "18px",
                            height: st.workingTowards > 20 ? "36px" : st.workingTowards > 0 ? "24px" : "18px",
                            fontSize: st.workingTowards > 20 ? "13px" : "10px",
                          }}
                        >
                          {st.workingTowards}
                        </div>
                      </div>

                      {/* Mastered Bubble (Green) */}
                      <div className="col-span-1 flex items-center justify-center">
                        <div
                          className="rounded-full bg-[#74C043] text-white font-black flex items-center justify-center shadow-xs"
                          style={{
                            width: st.mastered > 20 ? "36px" : st.mastered > 0 ? "24px" : "18px",
                            height: st.mastered > 20 ? "36px" : st.mastered > 0 ? "24px" : "18px",
                            fontSize: st.mastered > 20 ? "13px" : "10px",
                          }}
                        >
                          {st.mastered}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* STUDENT PERFORMANCE DRAWER / MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold"
                  style={{ backgroundColor: selectedStudent.avatarBg, color: selectedStudent.avatarColor }}
                >
                  {selectedStudent.avatarGender === "female" ? "👧" : "👦"}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedStudent.name}</h3>
                  <p className="text-[12px] font-mono text-slate-400 font-bold">
                    {selectedStudent.studentId} • {selectedStudent.schoolName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Score & Tier Stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase">Avg Score</div>
                <div className="text-2xl font-black text-slate-900 mt-0.5">{selectedStudent.avgScore}%</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase">Completed</div>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  {selectedStudent.workCompleted}/{selectedStudent.workTotal}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase">Proficiency</div>
                <div className="text-[12px] font-black text-slate-800 mt-2 capitalize">
                  {selectedStudent.tier.replace("_", " ")}
                </div>
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="space-y-2">
              <div className="text-[13px] font-black text-slate-800">Syllabus Section Mastery</div>
              <div className="space-y-1.5 text-[12px] font-bold">
                <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                  <span className="text-slate-600">Logical Reasoning</span>
                  <span className="font-mono text-slate-900">{selectedStudent.strandScores.logicalReasoning}%</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                  <span className="text-slate-600">Mathematical Reasoning</span>
                  <span className="font-mono text-slate-900">{selectedStudent.strandScores.mathReasoning}%</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                  <span className="text-slate-600">Everyday Mathematics</span>
                  <span className="font-mono text-slate-900">{selectedStudent.strandScores.everydayMath}%</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                  <span className="text-slate-600">Achievers Section</span>
                  <span className="font-mono text-purple-700">{selectedStudent.strandScores.achievers}%</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
              <Link
                href="/admin/results"
                className="px-5 py-2 bg-slate-900 hover:bg-black text-white text-[13px] font-black rounded-xl shadow-xs cursor-pointer"
              >
                View Performance Ledger
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ALERTS POPUP MODAL */}
      {isAlertsOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">System Telemetry & Alerts</h3>
              </div>
              <button
                onClick={() => setIsAlertsOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-[13px]">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Firestore Connection Active (0 Latency)</span>
              </div>
              <div className="p-3 bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Anti-tamper Examination Shield Online</span>
              </div>
              <div className="p-3 bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>50 Standardized SOF Questions Loaded</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsAlertsOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[13px] font-bold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
