"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { questionRepository, attemptRepository, examRepository } from "@/repositories";
import { OlympiadStore } from "@/services/firebase/firestore";
import { Question } from "@/types/question";
import { ExamAttempt } from "@/types/attempt";
import { Exam } from "@/types/exam";
import { ExamSession } from "@/types/session";
import {
  Award,
  Target,
  CheckCircle2,
  Clock,
  RadioTower,
  Users,
  Search,
  BookOpen,
  Calculator,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Activity,
  RefreshCw,
} from "lucide-react";

export default function AnalyticsAdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [liveSessions, setLiveSessions] = useState<ExamSession[]>([]);
  const [questionCountByExam, setQuestionCountByExam] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [telemetrySearch, setTelemetrySearch] = useState("");

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [qList, attList, exList, storedSessions] = await Promise.all([
        questionRepository.listQuestions(),
        attemptRepository.listAttempts(),
        examRepository.listExams(),
        OlympiadStore.getLiveSessions(),
      ]);

      setQuestions(qList);
      setAttempts(attList);
      setExams(exList);

      const qMap: Record<string, number> = {};
      exList.forEach((e) => {
        qMap[e.id] = e.questionIds.length || e.totalQuestions || 50;
      });
      setQuestionCountByExam(qMap);

      // Load client-side IndexedDB sessions if available
      let idbSessions: ExamSession[] = [];
      try {
        const { idbClient } = await import("@/services/persistence/indexeddb");
        const { ExamPersistenceService } = await import("@/services/persistence/ExamPersistenceService");
        const raw = await idbClient.getAll<any>("sessions");
        idbSessions = raw.map((s): ExamSession => {
          const answeredCount = Object.keys(s.answers || {}).length;
          const totalQuestions = qMap[s.examId] || 50;
          const progress = Math.round((answeredCount / totalQuestions) * 100);
          const remaining = ExamPersistenceService.calculateTrueRemainingTime(s);
          return {
            id: s.sessionId,
            sessionId: s.sessionId,
            examId: s.examId,
            examTitle: s.examTitle,
            student: {
              name: s.studentName,
              studentId: s.studentId,
              schoolName: s.schoolName,
              grade: s.grade,
            },
            device: s.device || {
              ip: "—",
              browser: "Chrome",
              os: "Windows",
              device: "Desktop",
            },
            currentQuestionIndex: s.currentQuestionIndex || 0,
            currentQuestionId: s.currentQuestionId || "",
            totalQuestions,
            answeredCount,
            flaggedCount: (s.markedForReview || []).length,
            progressPercent: progress,
            startedAt: new Date(s.startedAt).toLocaleTimeString(),
            lastActiveAt: new Date(s.lastSavedAt).toLocaleTimeString(),
            connectionStatus: s.status === "submitted" ? "Completed" : "Connected",
            timeRemainingSeconds: remaining,
            isSubmitted: s.status === "submitted",
          };
        });
      } catch {}

      const sessionMap = new Map<string, ExamSession>();
      storedSessions.forEach((s) => sessionMap.set(s.sessionId, s));
      idbSessions.forEach((s) => sessionMap.set(s.sessionId, s));

      setLiveSessions(Array.from(sessionMap.values()));
    } catch (err) {
      console.error("Failed to load analytics data:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const typeDistribution = useMemo(() => {
    return questions.reduce((acc, q) => {
      acc[q.questionType] = (acc[q.questionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [questions]);

  const diffDistribution = useMemo(() => {
    return questions.reduce((acc, q) => {
      acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [questions]);

  // Classwise Distribution of Attempts & Students
  const classwiseStats = useMemo(() => {
    const map: Record<string, { totalAttempts: number; totalScore: number; passedCount: number }> = {};
    for (let c = 1; c <= 12; c++) {
      map[String(c)] = { totalAttempts: 0, totalScore: 0, passedCount: 0 };
    }
    attempts.forEach((a) => {
      const g = String(a.student.grade || 6);
      if (!map[g]) map[g] = { totalAttempts: 0, totalScore: 0, passedCount: 0 };
      map[g].totalAttempts += 1;
      map[g].totalScore += a.percentage || 0;
      if (a.isPassed) map[g].passedCount += 1;
    });
    return map;
  }, [attempts]);

  // Subjectwise Distribution of Attempts
  const subjectwiseStats = useMemo(() => {
    let mathsCount = 0;
    let mathsScore = 0;
    let englishCount = 0;
    let englishScore = 0;

    attempts.forEach((a) => {
      const title = (a.examTitle || "").toLowerCase();
      if (title.includes("english") || title.includes("ieo")) {
        englishCount += 1;
        englishScore += a.percentage || 0;
      } else {
        mathsCount += 1;
        mathsScore += a.percentage || 0;
      }
    });

    return {
      maths: {
        count: mathsCount,
        avg: mathsCount > 0 ? Math.round(mathsScore / mathsCount) : 0,
      },
      english: {
        count: englishCount,
        avg: englishCount > 0 ? Math.round(englishScore / englishCount) : 0,
      },
    };
  }, [attempts]);

  const avgScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / attempts.length)
      : 0;

  // Active / Live candidates filter
  const filteredLive = liveSessions.filter((s) => {
    const q = telemetrySearch.toLowerCase();
    return (
      s.student.name.toLowerCase().includes(q) ||
      s.examTitle.toLowerCase().includes(q) ||
      s.student.studentId.toLowerCase().includes(q) ||
      (s.student.schoolName && s.student.schoolName.toLowerCase().includes(q))
    );
  });

  const activeCandidatesCount = liveSessions.filter((s) => !s.isSubmitted).length;

  return (
    <div className="space-y-6 animate-rise-in font-sans text-[#182338]">
      {/* 1. Header */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/80 shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_2px_10px_-4px_rgba(38,45,90,0.10)] rounded-2xl px-6 sm:px-7 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#2468B2]">
            <span>System Analytics & Real-Time Oversight</span>
            <span className="text-[#667085]">•</span>
            <span>Live Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#182338] mt-1">
            Analytics & Live Candidate Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            Live student examination progress, real-time question tracking, classwise & subjectwise evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            disabled={isRefreshing}
            className="h-9 px-3.5 bg-white/70 backdrop-blur-sm border border-white/90 hover:bg-white/95 text-[#1C5190] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-subtle transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Sync Live Feed</span>
          </button>
          <Link
            href="/admin/results"
            className="h-9 px-4 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-subtle transition-all cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Score Reports</span>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* 2. LIVE CANDIDATE MONITORING TELEMETRY (User Requirement) */}
        <div className="bg-[#FFFFFF] border-2 border-[#2468B2]/20 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E1E7EF] pb-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#059669]"></span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#182338]">
                    Live Candidate Telemetry (Question-by-Question)
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                    {activeCandidatesCount} Active Right Now
                  </span>
                </div>
                <p className="text-xs text-[#667085] mt-0.5">
                  See who is actively online, which examination paper they are writing, and their exact current question index.
                </p>
              </div>
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter live candidates..."
                value={telemetrySearch}
                onChange={(e) => setTelemetrySearch(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs bg-[#F4F7FB] border border-[#E1E7EF] rounded-xl text-[#182338] font-medium focus:outline-none focus:border-[#2468B2]"
              />
            </div>
          </div>

          {filteredLive.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <RadioTower className="w-8 h-8 text-[#A0AEC0] mx-auto opacity-50" />
              <p className="text-xs font-bold text-[#182338]">No live candidates in session right now</p>
              <p className="text-[11px] text-[#667085] max-w-md mx-auto">
                When students begin taking an examination, their live state, current question number, and progress updates stream directly here in real-time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[980px] text-left text-xs font-semibold">
                <thead className="bg-[#F8FAFC] text-[#667085] border-b border-[#E1E7EF] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-[170px]">Candidate</th>
                    <th className="py-3 px-3 min-w-[180px]">Exam Paper</th>
                    <th className="py-3 px-2 w-[70px] text-center">Class</th>
                    <th className="py-3 px-2 w-[160px] text-center">Current Progress</th>
                    <th className="py-3 px-2 w-[85px] text-center">Answered</th>
                    <th className="py-3 px-2 w-[95px] text-center">Time Left</th>
                    <th className="py-3 px-2 w-[105px] text-center">Connection</th>
                    <th className="py-3 px-3 w-[95px] text-right">Oversight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E7EF] text-[#182338]">
                  {filteredLive.map((session) => {
                    const currentQ = (session.currentQuestionIndex || 0) + 1;
                    const totalQ = session.totalQuestions || 50;
                    const progressPercent = Math.min(100, Math.round((currentQ / totalQ) * 100));
                    const isMath = session.examTitle.toLowerCase().includes("math") || session.examTitle.toLowerCase().includes("imo");

                    const minutes = Math.floor((session.timeRemainingSeconds || 0) / 60);
                    const seconds = (session.timeRemainingSeconds || 0) % 60;
                    const timeFormatted = `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`;

                    return (
                      <tr key={session.sessionId} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-xs text-[#182338] truncate max-w-[160px]" title={session.student.name}>{session.student.name}</div>
                          <div className="text-[10px] text-[#667085] font-mono truncate max-w-[160px]" title={session.student.studentId}>
                            {session.student.studentId}{session.student.schoolName ? ` • ${session.student.schoolName}` : ""}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                                isMath ? "bg-[#EEF4FF] text-[#2468B2]" : "bg-[#FAF5FF] text-[#9333EA]"
                              }`}
                            >
                              {isMath ? "Maths" : "English"}
                            </span>
                            <span className="font-bold text-xs text-[#182338] truncate max-w-[160px]" title={session.examTitle}>
                              {session.examTitle}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-2 text-center font-bold">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] inline-block whitespace-nowrap">
                            Class {session.student.grade || 6}
                          </span>
                        </td>

                        <td className="py-3 px-2 text-center">
                          <div className="space-y-1 inline-block min-w-[130px]">
                            <div className="flex items-center justify-between text-[10.5px] font-bold text-[#2468B2]">
                              <span>Q {currentQ}/{totalQ}</span>
                              <span className="text-[10px] text-[#667085]">{progressPercent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-[#E1E7EF]">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isMath ? "bg-[#2468B2]" : "bg-[#9333EA]"
                                }`}
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-2 text-center font-mono font-bold text-xs text-slate-700">
                          {session.answeredCount} / {totalQ}
                        </td>

                        <td className="py-3 px-2 text-center">
                          <span
                            className={`font-mono text-xs font-bold px-2 py-0.5 rounded inline-block whitespace-nowrap ${
                              session.timeRemainingSeconds < 300
                                ? "bg-red-50 text-red-600 animate-pulse"
                                : "bg-slate-50 text-slate-700"
                            }`}
                          >
                            {timeFormatted}
                          </span>
                        </td>

                        <td className="py-3 px-2 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase whitespace-nowrap ${
                              session.isSubmitted
                                ? "bg-blue-50 text-blue-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {session.connectionStatus || "Connected"}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <Link
                            href="/admin/live-monitor"
                            className="h-7 px-2.5 bg-white hover:bg-slate-50 border border-[#E1E7EF] text-[#2468B2] rounded-lg text-[11px] font-bold transition-all inline-flex items-center shrink-0"
                          >
                            Inspect
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

        {/* 3. Top Summary KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-5 shadow-subtle space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block">
              Question Bank Items
            </span>
            <div className="text-3xl font-bold font-mono text-[#182338]">
              {questions.length}
            </div>
            <div className="text-[11px] text-[#2468B2] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Interactive Ready
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-5 shadow-subtle space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block">
              Active Papers
            </span>
            <div className="text-3xl font-bold font-mono text-[#2468B2]">
              {exams.length}
            </div>
            <div className="text-[11px] text-[#667085] font-medium">
              Mathematics & English
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-5 shadow-subtle space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block">
              Average Candidate Score
            </span>
            <div className="text-3xl font-bold font-mono text-[#1C5190]">
              {attempts.length > 0 ? `${avgScore}%` : "—"}
            </div>
            <div className="text-[11px] text-[#667085] font-medium">
              {attempts.length > 0 ? `${attempts.length} attempts evaluated` : "No submissions yet"}
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-5 shadow-subtle space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block">
              Live Pulse
            </span>
            <div className="text-3xl font-bold font-mono text-emerald-600 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>{activeCandidatesCount}</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold">
              Candidates currently sitting exams
            </div>
          </div>
        </div>

        {/* 4. CLASSWISE & SUBJECTWISE ANALYTICS ROW (User Requirement) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject-Wise Analytics */}
          <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-6 shadow-subtle space-y-4">
            <div className="border-b border-[#E1E7EF] pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#182338]">Subject-Wise Evaluation</h3>
                <p className="text-xs text-[#667085]">Performance segregated by academic discipline</p>
              </div>
              <span className="text-[11px] font-bold text-[#2468B2] bg-[#EAF2FC] px-2.5 py-1 rounded-lg border border-[#E1E7EF]">
                Strict Subject Separation
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Mathematics Card */}
              <div className="p-4 rounded-xl border border-blue-100 bg-[#F8FAFF] space-y-2">
                <div className="flex items-center gap-2 text-[#2468B2] font-bold text-xs">
                  <Calculator className="w-4 h-4" />
                  <span>Mathematics (IMO)</span>
                </div>
                <div className="text-2xl font-bold text-[#182338] font-mono">
                  {subjectwiseStats.maths.count}{" "}
                  <span className="text-xs font-normal text-[#667085]">attempts</span>
                </div>
                <div className="text-xs text-[#667085]">
                  Average Score:{" "}
                  <strong className="text-[#2468B2] font-mono">{subjectwiseStats.maths.avg}%</strong>
                </div>
              </div>

              {/* English Card */}
              <div className="p-4 rounded-xl border border-purple-100 bg-[#FAF5FF] space-y-2">
                <div className="flex items-center gap-2 text-[#9333EA] font-bold text-xs">
                  <BookOpen className="w-4 h-4" />
                  <span>English (IEO)</span>
                </div>
                <div className="text-2xl font-bold text-[#182338] font-mono">
                  {subjectwiseStats.english.count}{" "}
                  <span className="text-xs font-normal text-[#667085]">attempts</span>
                </div>
                <div className="text-xs text-[#667085]">
                  Average Score:{" "}
                  <strong className="text-[#9333EA] font-mono">{subjectwiseStats.english.avg}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Class-Wise Analytics */}
          <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-6 shadow-subtle space-y-4">
            <div className="border-b border-[#E1E7EF] pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#182338]">Class-Wise Cohorts</h3>
                <p className="text-xs text-[#667085]">Olympiad performance categorized by class grade</p>
              </div>
              <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                Classes 1 to 12
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[6, 7, 8].map((grade) => {
                const stat = classwiseStats[String(grade)] || { totalAttempts: 0, totalScore: 0, passedCount: 0 };
                const avg = stat.totalAttempts > 0 ? Math.round(stat.totalScore / stat.totalAttempts) : 0;
                return (
                  <div key={grade} className="p-3 rounded-xl border border-[#E1E7EF] bg-[#F8FAFC] text-center space-y-1">
                    <div className="text-xs font-bold text-[#182338]">Class {grade}</div>
                    <div className="text-xl font-bold text-[#2468B2] font-mono">{stat.totalAttempts}</div>
                    <div className="text-[10px] text-[#667085]">
                      {stat.totalAttempts > 0 ? `Avg: ${avg}%` : "No attempts"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. Deep Breakdown: Interaction Types & Cognitive Depth */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interaction Mechanisms (7 cols) */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-6 shadow-subtle space-y-5">
            <div className="border-b border-[#E1E7EF] pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#182338]">
                  Interactive Question Interaction Types
                </h3>
                <p className="text-xs text-[#667085] font-medium mt-0.5">
                  Distribution of interactive mechanisms across the Question Repository
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#2468B2] bg-[#EAF2FC] px-2.5 py-1 rounded-lg border border-[#E1E7EF]">
                {Object.keys(typeDistribution).length} Types
              </span>
            </div>

            <div className="space-y-3.5">
              {Object.entries(typeDistribution).map(([type, count]) => {
                const percent = Math.round((count / (questions.length || 1)) * 100);
                return (
                  <div key={type} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#182338]">{type}</span>
                      <span className="font-mono text-[#667085] font-semibold">
                        {count} questions ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 bg-[#F4F7FB] border border-[#E1E7EF] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2468B2] rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Difficulty & Taxonomy (5 cols) */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-6 shadow-subtle space-y-5 flex flex-col justify-between">
            <div className="border-b border-[#E1E7EF] pb-3">
              <h3 className="text-sm font-bold text-[#182338]">Difficulty Distribution</h3>
              <p className="text-xs text-[#667085] font-medium mt-0.5">
                Olympiad cognitive depth rating
              </p>
            </div>

            <div className="space-y-3 my-auto">
              {Object.entries(diffDistribution).map(([diff, count]) => {
                const percent = Math.round((count / (questions.length || 1)) * 100);
                return (
                  <div key={diff} className="p-3 bg-[#F4F7FB] border border-[#E1E7EF] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#182338]">{diff}</div>
                      <div className="text-[10px] text-[#667085]">{count} questions</div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#2468B2]">
                      {percent}%
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-[#EAF2FC] border border-[#E1E7EF] rounded-xl text-xs text-[#1C5190]">
              <div className="font-bold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#2468B2]" /> Deterministic Evaluation
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
