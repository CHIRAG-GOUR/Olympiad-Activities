"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OlympiadStore } from "@/services/firebase/firestore";
import { ExamAttempt } from "@/types/attempt";
import {
  Search,
  CheckCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  FileCheck,
  Award,
  AlertCircle,
  UserCheck,
  Layers,
  BarChart3,
  Filter,
  Printer,
  Download,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from "lucide-react";

// Default realistic cohort attempts if ledger is freshly cleared
const INITIAL_COHORT_ATTEMPTS: ExamAttempt[] = [
  {
    id: "att_001",
    examId: "exam_imo_2024_g6_setb",
    examCode: "IMO-2024-G6-SETB",
    examTitle: "SOF International Mathematics Olympiad (Class 6 - Set B)",
    subjectName: "Mathematics & Logical Reasoning",
    student: {
      name: "Aarav Patel",
      studentId: "STU-88214",
      schoolName: "Delhi Public School, R.K. Puram",
      grade: 6,
    },
    device: { browser: "Chrome 124", os: "Windows 11", ip: "192.168.1.104", device: "Desktop (Windows)" },
    totalMarks: 58,
    maximumMarks: 60,
    scoreDisplay: "58/60",
    percentage: 97,
    isPassed: true,
    questionEvaluations: [],
    sectionScores: [
      { sectionTitle: "Logical Reasoning", marksAwarded: 15, maxMarks: 15, accuracyPercent: 100, questionsTotal: 15, questionsCorrect: 15 },
      { sectionTitle: "Mathematical Reasoning", marksAwarded: 19, maxMarks: 20, accuracyPercent: 95, questionsTotal: 20, questionsCorrect: 19 },
      { sectionTitle: "Everyday Mathematics", marksAwarded: 10, maxMarks: 10, accuracyPercent: 100, questionsTotal: 10, questionsCorrect: 10 },
      { sectionTitle: "Achievers Section", marksAwarded: 14, maxMarks: 15, accuracyPercent: 93, questionsTotal: 5, questionsCorrect: 4 },
    ],
    totalTimeSpentSeconds: 2760,
    timeLimitSeconds: 3600,
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    submittedAt: new Date(Date.now() - 840000).toISOString(),
    submissionType: "normal",
  },
  {
    id: "att_002",
    examId: "exam_imo_2024_g6_setb",
    examCode: "IMO-2024-G6-SETB",
    examTitle: "SOF International Mathematics Olympiad (Class 6 - Set B)",
    subjectName: "Mathematics & Logical Reasoning",
    student: {
      name: "Ananya Sharma",
      studentId: "STU-91024",
      schoolName: "The Mother's International School",
      grade: 6,
    },
    device: { browser: "Safari 17", os: "macOS Sonoma", ip: "192.168.1.112", device: "Desktop (Mac)" },
    totalMarks: 56,
    maximumMarks: 60,
    scoreDisplay: "56/60",
    percentage: 93,
    isPassed: true,
    questionEvaluations: [],
    sectionScores: [
      { sectionTitle: "Logical Reasoning", marksAwarded: 14, maxMarks: 15, accuracyPercent: 93, questionsTotal: 15, questionsCorrect: 14 },
      { sectionTitle: "Mathematical Reasoning", marksAwarded: 19, maxMarks: 20, accuracyPercent: 95, questionsTotal: 20, questionsCorrect: 19 },
      { sectionTitle: "Everyday Mathematics", marksAwarded: 9, maxMarks: 10, accuracyPercent: 90, questionsTotal: 10, questionsCorrect: 9 },
      { sectionTitle: "Achievers Section", marksAwarded: 14, maxMarks: 15, accuracyPercent: 93, questionsTotal: 5, questionsCorrect: 4 },
    ],
    totalTimeSpentSeconds: 3120,
    timeLimitSeconds: 3600,
    startedAt: new Date(Date.now() - 4200000).toISOString(),
    submittedAt: new Date(Date.now() - 1080000).toISOString(),
    submissionType: "normal",
  },
  {
    id: "att_003",
    examId: "exam_imo_2024_g6_setb",
    examCode: "IMO-2024-G6-SETB",
    examTitle: "SOF International Mathematics Olympiad (Class 6 - Set B)",
    subjectName: "Mathematics & Logical Reasoning",
    student: {
      name: "Rohan Gupta",
      studentId: "STU-74312",
      schoolName: "DAV Public School, Sector 14",
      grade: 6,
    },
    device: { browser: "Edge 123", os: "Windows 10", ip: "192.168.1.118", device: "Desktop (Windows)" },
    totalMarks: 54,
    maximumMarks: 60,
    scoreDisplay: "54/60",
    percentage: 90,
    isPassed: true,
    questionEvaluations: [],
    sectionScores: [
      { sectionTitle: "Logical Reasoning", marksAwarded: 13, maxMarks: 15, accuracyPercent: 87, questionsTotal: 15, questionsCorrect: 13 },
      { sectionTitle: "Mathematical Reasoning", marksAwarded: 18, maxMarks: 20, accuracyPercent: 90, questionsTotal: 20, questionsCorrect: 18 },
      { sectionTitle: "Everyday Mathematics", marksAwarded: 10, maxMarks: 10, accuracyPercent: 100, questionsTotal: 10, questionsCorrect: 10 },
      { sectionTitle: "Achievers Section", marksAwarded: 13, maxMarks: 15, accuracyPercent: 87, questionsTotal: 5, questionsCorrect: 4 },
    ],
    totalTimeSpentSeconds: 3400,
    timeLimitSeconds: 3600,
    startedAt: new Date(Date.now() - 4800000).toISOString(),
    submittedAt: new Date(Date.now() - 1400000).toISOString(),
    submissionType: "normal",
  },
  {
    id: "att_004",
    examId: "exam_imo_2024_g6_setb",
    examCode: "IMO-2024-G6-SETB",
    examTitle: "SOF International Mathematics Olympiad (Class 6 - Set B)",
    subjectName: "Mathematics & Logical Reasoning",
    student: {
      name: "Meera Iyer",
      studentId: "STU-65209",
      schoolName: "National Public School, Indiranagar",
      grade: 6,
    },
    device: { browser: "Chrome 124", os: "macOS Sequoia", ip: "192.168.1.120", device: "Desktop (Mac)" },
    totalMarks: 52,
    maximumMarks: 60,
    scoreDisplay: "52/60",
    percentage: 87,
    isPassed: true,
    questionEvaluations: [],
    sectionScores: [
      { sectionTitle: "Logical Reasoning", marksAwarded: 14, maxMarks: 15, accuracyPercent: 93, questionsTotal: 15, questionsCorrect: 14 },
      { sectionTitle: "Mathematical Reasoning", marksAwarded: 17, maxMarks: 20, accuracyPercent: 85, questionsTotal: 20, questionsCorrect: 17 },
      { sectionTitle: "Everyday Mathematics", marksAwarded: 9, maxMarks: 10, accuracyPercent: 90, questionsTotal: 10, questionsCorrect: 9 },
      { sectionTitle: "Achievers Section", marksAwarded: 12, maxMarks: 15, accuracyPercent: 80, questionsTotal: 5, questionsCorrect: 4 },
    ],
    totalTimeSpentSeconds: 2980,
    timeLimitSeconds: 3600,
    startedAt: new Date(Date.now() - 5400000).toISOString(),
    submittedAt: new Date(Date.now() - 2420000).toISOString(),
    submissionType: "normal",
  },
  {
    id: "att_005",
    examId: "exam_imo_2024_g6_setb",
    examCode: "IMO-2024-G6-SETB",
    examTitle: "SOF International Mathematics Olympiad (Class 6 - Set B)",
    subjectName: "Mathematics & Logical Reasoning",
    student: {
      name: "Siddharth Verma",
      studentId: "STU-58901",
      schoolName: "Modern School, Barakhamba Road",
      grade: 6,
    },
    device: { browser: "Chrome 124", os: "Windows 11", ip: "192.168.1.125", device: "Desktop (Windows)" },
    totalMarks: 50,
    maximumMarks: 60,
    scoreDisplay: "50/60",
    percentage: 83,
    isPassed: true,
    questionEvaluations: [],
    sectionScores: [
      { sectionTitle: "Logical Reasoning", marksAwarded: 13, maxMarks: 15, accuracyPercent: 87, questionsTotal: 15, questionsCorrect: 13 },
      { sectionTitle: "Mathematical Reasoning", marksAwarded: 16, maxMarks: 20, accuracyPercent: 80, questionsTotal: 20, questionsCorrect: 16 },
      { sectionTitle: "Everyday Mathematics", marksAwarded: 9, maxMarks: 10, accuracyPercent: 90, questionsTotal: 10, questionsCorrect: 9 },
      { sectionTitle: "Achievers Section", marksAwarded: 12, maxMarks: 15, accuracyPercent: 80, questionsTotal: 5, questionsCorrect: 4 },
    ],
    totalTimeSpentSeconds: 3250,
    timeLimitSeconds: 3600,
    startedAt: new Date(Date.now() - 6000000).toISOString(),
    submittedAt: new Date(Date.now() - 2750000).toISOString(),
    submissionType: "normal",
  },
  {
    id: "att_006",
    examId: "exam_imo_2024_g6_setb",
    examCode: "IMO-2024-G6-SETB",
    examTitle: "SOF International Mathematics Olympiad (Class 6 - Set B)",
    subjectName: "Mathematics & Logical Reasoning",
    student: {
      name: "Kavya Menon",
      studentId: "STU-42190",
      schoolName: "Chinmaya Vidyalaya",
      grade: 6,
    },
    device: { browser: "Firefox 125", os: "Linux Ubuntu", ip: "192.168.1.130", device: "Desktop (Linux)" },
    totalMarks: 45,
    maximumMarks: 60,
    scoreDisplay: "45/60",
    percentage: 75,
    isPassed: true,
    questionEvaluations: [],
    sectionScores: [
      { sectionTitle: "Logical Reasoning", marksAwarded: 12, maxMarks: 15, accuracyPercent: 80, questionsTotal: 15, questionsCorrect: 12 },
      { sectionTitle: "Mathematical Reasoning", marksAwarded: 15, maxMarks: 20, accuracyPercent: 75, questionsTotal: 20, questionsCorrect: 15 },
      { sectionTitle: "Everyday Mathematics", marksAwarded: 8, maxMarks: 10, accuracyPercent: 80, questionsTotal: 10, questionsCorrect: 8 },
      { sectionTitle: "Achievers Section", marksAwarded: 10, maxMarks: 15, accuracyPercent: 67, questionsTotal: 5, questionsCorrect: 3 },
    ],
    totalTimeSpentSeconds: 3450,
    timeLimitSeconds: 3600,
    startedAt: new Date(Date.now() - 7200000).toISOString(),
    submittedAt: new Date(Date.now() - 3750000).toISOString(),
    submissionType: "normal",
  },
];

export default function ResultsAdminPage() {
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  const [activeScoreToggle, setActiveScoreToggle] = useState<"top" | "lowest">("top");
  const [statusCarouselIndex, setStatusCarouselIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const classesList = ["Class 6-B (SOF IMO 2024-25)", "Class 6-A (Morning Cohort)", "Class 6-C (Olympiad Scholars)"];

  useEffect(() => {
    async function load() {
      const data = await OlympiadStore.getAttempts();
      if (data.length > 0) {
        setAttempts(data);
      } else {
        setAttempts(INITIAL_COHORT_ATTEMPTS);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = attempts.filter(
    (a) =>
      a.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.student.schoolName && a.student.schoolName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Total students & breakdown counts for the donut and summary
  const totalStudents = 40; // Cohort size representation
  const evaluatedCount = attempts.length > 0 ? attempts.length : 40;
  const distinctionCount = 23; // 60%
  const proficientCount = 11; // 20%
  const foundationalCount = 6; // 16%
  const incompleteCount = 2; // 4%

  const assessmentsTimeline = [
    {
      id: "sec_1",
      title: "Assessment 1: Logical Reasoning",
      status: "completed",
      statusLabel: "Well done!",
      sublabel: "All candidates scored!",
      avgScore: "88%",
      isOverdue: false,
    },
    {
      id: "sec_2",
      title: "Assessment 2: Mathematical Reasoning",
      status: "action_needed",
      statusLabel: "Overdue scoring",
      sublabel: "Manual review pending",
      avgScore: "74%",
      isOverdue: true,
    },
    {
      id: "sec_3",
      title: "Assessment 3: Everyday Mathematics",
      status: "completed",
      statusLabel: "Well done!",
      sublabel: "All candidates scored!",
      avgScore: "82%",
      isOverdue: false,
    },
    {
      id: "sec_4",
      title: "Assessment 4: Achievers Section",
      status: "completed",
      statusLabel: "Well done!",
      sublabel: "All candidates scored!",
      avgScore: "60%",
      isOverdue: false,
    },
    {
      id: "sec_5",
      title: "Assessment 5: Certification Ledger",
      status: "action_needed",
      statusLabel: "Overdue scoring",
      sublabel: "Release certification",
      avgScore: "84%",
      isOverdue: true,
    },
  ];

  const sectionAverages = [
    { name: "Logical Reasoning (Q1–Q15)", avgScore: 88, maxMarks: 15, avgMarks: 13.2, color: "#10b981" },
    { name: "Everyday Mathematics (Q36–Q45)", avgScore: 82, maxMarks: 10, avgMarks: 8.2, color: "#06b6d4" },
    { name: "Mathematical Reasoning (Q16–Q35)", avgScore: 74, maxMarks: 20, avgMarks: 14.8, color: "#f59e0b" },
    { name: "Achievers Section (Q46–Q50)", avgScore: 60, maxMarks: 15, avgMarks: 9.0, color: "#a855f7" },
  ];

  const lowestAverages = [
    { name: "Achievers Section (High Order Thinking)", avgScore: 60, maxMarks: 15, avgMarks: 9.0, color: "#ef4444" },
    { name: "Spatial Folding & Symmetry (Q7, Q10)", avgScore: 64, maxMarks: 2, avgMarks: 1.28, color: "#f97316" },
    { name: "Composite Geometry Mensuration (Q24, Q50)", avgScore: 68, maxMarks: 4, avgMarks: 2.72, color: "#eab308" },
    { name: "Mathematical Reasoning (Geometry Lines)", avgScore: 74, maxMarks: 20, avgMarks: 14.8, color: "#3b82f6" },
  ];

  const handleNextClass = () => {
    setSelectedClassIndex((prev) => (prev + 1) % classesList.length);
  };

  const handlePrevClass = () => {
    setSelectedClassIndex((prev) => (prev - 1 + classesList.length) % classesList.length);
  };

  return (
    <div className="flex-1 flex flex-col w-full min-w-0 bg-[#f4f7f6] font-sans pb-16">
      {/* Top Banner with Signature Olympiad Forest Green Gradient */}
      <div className="w-full bg-gradient-to-r from-[#547322] via-[#4D691F] to-[#3E5519] text-white px-6 sm:px-10 py-6 shadow-md border-b border-[#435C1B]">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[12px] uppercase font-extrabold tracking-widest text-[#FFE066]">
              National Olympiad Examination Authority
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
              Dashboard & Examination Performance Reports
            </h1>
          </div>

          {/* Teacher Profile / Faculty Badge */}
          <div className="flex items-center gap-3.5 bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-white text-[#547322] flex items-center justify-center font-bold text-sm shadow-xs overflow-hidden border-2 border-white">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
                alt="Teacher Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span>SR</span>
            </div>
            <div className="text-left">
              <div className="text-[13px] font-extrabold text-white leading-tight">
                Welcome, Dr. Sunita Rao
              </div>
              <div className="text-[11px] font-medium text-white/80">
                Lead Mathematics & Science Examiner
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* =========================================================================
            CARD 1: ASSESSMENTS STATUS (Horizontal Progress Pipeline)
            ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-extrabold text-slate-800 tracking-tight">
              Assessments status
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatusCarouselIndex((prev) => Math.max(0, prev - 1))}
                disabled={statusCarouselIndex === 0}
                className="w-8 h-8 rounded-lg border border-teal-500/30 text-teal-600 hover:bg-teal-50 flex items-center justify-center transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setStatusCarouselIndex((prev) => Math.min(1, prev + 1))}
                disabled={statusCarouselIndex === 1}
                className="w-8 h-8 rounded-lg border border-teal-500/30 text-teal-600 hover:bg-teal-50 flex items-center justify-center transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Connected Pipeline Nodes */}
          <div className="relative pt-2 pb-4 overflow-x-auto">
            <div className="min-w-[850px] flex items-start justify-between relative">
              {/* Connecting Horizontal Line */}
              <div className="absolute top-[20px] left-[60px] right-[60px] h-[2px] bg-slate-200 -z-0" />

              {assessmentsTimeline.map((item, idx) => {
                const isGreen = !item.isOverdue;

                return (
                  <div key={item.id} className="flex-1 flex flex-col items-center text-center px-2 relative z-10">
                    {/* Top Pill / Badge */}
                    <div
                      className={`h-[34px] px-4 rounded-full border-2 text-[13px] font-bold flex items-center gap-2 bg-white shadow-xs transition-all ${
                        isGreen
                          ? "border-teal-500 text-slate-800"
                          : "border-red-400 text-slate-800"
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isGreen ? "bg-teal-500" : "bg-red-500"
                        }`}
                      />
                      <span>Assessment {idx + 1}</span>
                    </div>

                    {/* Status Circle Icon */}
                    <div className="my-4">
                      {isGreen ? (
                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                          <CheckCircle className="w-5 h-5 fill-white text-emerald-500" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm">
                          <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Status Text */}
                    <div className="space-y-0.5 mb-3">
                      <div className="text-[13px] font-bold text-slate-700">{item.statusLabel}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{item.sublabel}</div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      className={`h-[32px] px-5 rounded-lg text-[12px] font-bold transition-all shadow-xs cursor-pointer ${
                        isGreen
                          ? "bg-teal-50 text-teal-700 border border-teal-300/80 hover:bg-teal-100"
                          : "bg-red-50 text-red-700 border border-red-300/80 hover:bg-red-100"
                      }`}
                    >
                      {isGreen ? `Score ${item.avgScore}` : "Score"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 2: PARTICIPATION AND SCORE TIER ANALYSIS (Donut Chart & Key Metrics)
            ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <h2 className="text-[18px] font-extrabold text-slate-800 tracking-tight">
              Participation and Score Tier analysis
            </h2>

            {/* Class Switcher */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevClass}
                className="w-7 h-7 rounded-lg border border-teal-500/30 text-teal-600 hover:bg-teal-50 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-[14px] text-slate-700 px-2 min-w-[200px] text-center">
                {classesList[selectedClassIndex]}
              </span>
              <button
                type="button"
                onClick={handleNextClass}
                className="w-7 h-7 rounded-lg border border-teal-500/30 text-teal-600 hover:bg-teal-50 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Big Total & Trend Breakdown */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <div className="space-y-1">
                <div className="text-5xl sm:text-6xl font-extrabold font-mono text-slate-900 tracking-tight">
                  {totalStudents}
                </div>
                <div className="text-[14px] text-slate-400 font-semibold">
                  Total number of enrolled candidates
                </div>
              </div>

              {/* 3 Metric Cards with Delta Arrows */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold font-mono text-slate-800">23</span>
                    <span className="text-[12px] font-bold text-emerald-600 flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 inline mr-0.5" /> 15.2%
                    </span>
                  </div>
                  <div className="text-[12px] font-medium text-slate-500 leading-snug">
                    Full Distinction Tier (&gt;80%)
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold font-mono text-slate-800">11</span>
                    <span className="text-[12px] font-bold text-emerald-600 flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 inline mr-0.5" /> 10.6%
                    </span>
                  </div>
                  <div className="text-[12px] font-medium text-slate-500 leading-snug">
                    Proficient Standard (60–79%)
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold font-mono text-slate-800">6</span>
                    <span className="text-[12px] font-bold text-rose-500 flex items-center">
                      <TrendingDown className="w-3.5 h-3.5 inline mr-0.5" /> 5.6%
                    </span>
                  </div>
                  <div className="text-[12px] font-medium text-slate-500 leading-snug">
                    Needs Focus / Review (&lt;60%)
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Legend & Exact Donut Chart */}
            <div className="lg:col-span-6 flex flex-col sm:flex-row items-center justify-center gap-8">
              {/* Donut Legend */}
              <div className="space-y-3.5 text-[13px] font-semibold text-slate-700">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#f87171]" />
                  <span>Foundational (&lt;40%)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#4ade80]" />
                  <span>Healthy / Distinction</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#fbc02d]" />
                  <span>NI - Proficient Tier</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#dc2626]" />
                  <span>Intervention Required</span>
                </div>
              </div>

              {/* Dynamic SVG Donut Chart */}
              <div className="relative w-[210px] h-[210px] flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="18" />

                  {/* Slice 1: Proficient (60%) -> Gold */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#fbc02d"
                    strokeWidth="18"
                    strokeDasharray={`${60 * 2.387} ${100 * 2.387}`}
                    strokeDashoffset="0"
                  />

                  {/* Slice 2: Foundational (20%) -> Coral/Pink */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#f87171"
                    strokeWidth="18"
                    strokeDasharray={`${20 * 2.387} ${100 * 2.387}`}
                    strokeDashoffset={`-${60 * 2.387}`}
                  />

                  {/* Slice 3: Distinction (16%) -> Green */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#4ade80"
                    strokeWidth="18"
                    strokeDasharray={`${16 * 2.387} ${100 * 2.387}`}
                    strokeDashoffset={`-${80 * 2.387}`}
                  />

                  {/* Slice 4: Intervention (4%) -> Crimson */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#dc2626"
                    strokeWidth="18"
                    strokeDasharray={`${4 * 2.387} ${100 * 2.387}`}
                    strokeDashoffset={`-${96 * 2.387}`}
                  />
                </svg>

                {/* Donut Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[17px] font-extrabold font-mono text-slate-800 tracking-wider">
                    SCORE
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">TIERS</span>
                </div>

                {/* Percentage Callout Badges */}
                <span className="absolute right-2 top-8 text-[11px] font-extrabold font-mono text-white bg-slate-900/60 px-1.5 py-0.5 rounded">
                  60%
                </span>
                <span className="absolute left-4 top-4 text-[11px] font-extrabold font-mono text-white bg-slate-900/60 px-1.5 py-0.5 rounded">
                  20%
                </span>
                <span className="absolute left-2 bottom-6 text-[11px] font-extrabold font-mono text-white bg-slate-900/60 px-1.5 py-0.5 rounded">
                  16%
                </span>
                <span className="absolute right-8 bottom-3 text-[11px] font-extrabold font-mono text-white bg-slate-900/60 px-1.5 py-0.5 rounded">
                  4%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM GRID: AVG SCORES PER SECTION + TOP CANDIDATE PERFORMERS
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Card 3: Avg scores per section */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-extrabold text-slate-800 tracking-tight">
                Avg scores per section
              </h2>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveScoreToggle("top")}
                  className={`h-[30px] px-3 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                    activeScoreToggle === "top"
                      ? "bg-emerald-500 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Top 4
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScoreToggle("lowest")}
                  className={`h-[30px] px-3 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                    activeScoreToggle === "lowest"
                      ? "bg-rose-500 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Lowest 4
                </button>
              </div>
            </div>

            {/* Benchmark Bars */}
            <div className="space-y-4 pt-1">
              {(activeScoreToggle === "top" ? sectionAverages : lowestAverages).map((sec, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-bold text-slate-800">{sec.name}</span>
                    <span className="font-mono font-extrabold text-slate-900">
                      {sec.avgScore}% ({sec.avgMarks} / {sec.maxMarks} M)
                    </span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${sec.avgScore}%`,
                        backgroundColor: sec.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Top 5 Candidates Leaderboard */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-extrabold text-slate-800 tracking-tight">
                Top 5 candidates across assessments
              </h2>
              <span className="text-[12px] font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                Olympiad Rank Tier
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {attempts.slice(0, 5).map((att, i) => (
                <div key={att.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-extrabold text-[12px] ${
                        i === 0
                          ? "bg-amber-400 text-slate-900"
                          : i === 1
                          ? "bg-slate-300 text-slate-900"
                          : i === 2
                          ? "bg-amber-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      #{i + 1}
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-slate-900">{att.student.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {att.student.schoolName || "Olympiad Academy"} • {att.student.studentId}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-mono font-extrabold text-[15px] text-emerald-700">
                        {att.scoreDisplay}
                      </div>
                      <div className="text-[11px] font-bold text-slate-400 font-mono">
                        {att.percentage}% Accuracy
                      </div>
                    </div>

                    <Link
                      href={`/results/${att.id}`}
                      className="h-[32px] px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[12px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-rose-500" />
                      <span>Paper</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            FULL EXAMINATION EVALUATION LEDGER & SEARCH
            ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-extrabold text-slate-800 tracking-tight">
                Official Candidate Score Ledger
              </h2>
              <p className="text-[13px] text-slate-400 mt-0.5">
                Complete audit trail of all evaluated examination attempts and teacher-marked score papers
              </p>
            </div>

            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate name, roll ID or school..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-[44px] pl-10 pr-4 text-[13px] bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-500 text-slate-900 font-semibold placeholder:text-slate-400 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-[14px] border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-[12px] uppercase tracking-wider">
                  <th className="py-4 px-6">Candidate</th>
                  <th className="py-4 px-6">Roll ID</th>
                  <th className="py-4 px-6">Institution</th>
                  <th className="py-4 px-6">Evaluated Score</th>
                  <th className="py-4 px-6">Accuracy</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6">Submission Time</th>
                  <th className="py-4 px-6 text-right">Official Paper</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[14px] text-slate-400">
                      No candidate attempts match the query.
                    </td>
                  </tr>
                ) : (
                  filtered.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/60 transition-colors h-[68px]">
                      <td className="py-4 px-6 font-bold text-slate-900 text-[14px]">
                        {att.student.name}
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-700 text-[13px]">
                        {att.student.studentId}
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-[13px] truncate max-w-[220px]">
                        {att.student.schoolName || "Olympiad Academy"}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono font-extrabold text-[14px] text-rose-600 bg-rose-50 px-3 py-1 rounded-md border border-rose-200 inline-block">
                          {att.scoreDisplay}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-900 text-[13px]">
                        {att.percentage}%
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-mono text-[13px]">
                        {Math.round((att.totalTimeSpentSeconds || 2400) / 60)} mins
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-mono text-[13px]">
                        {new Date(att.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/results/${att.id}`}
                          className="inline-flex items-center gap-1.5 h-[34px] px-3.5 bg-white border border-[#D4E0C2] hover:bg-[#F4F7EE] text-[12px] font-bold text-[#3E5519] rounded-lg shadow-xs transition-colors"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-[#C62828]" />
                          <span>View Paper</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
