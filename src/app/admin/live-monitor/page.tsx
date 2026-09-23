"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OlympiadStore } from "@/services/firebase/firestore";
import { examRepository } from "@/repositories";
import { ExamSession } from "@/types/session";
import { Activity, RefreshCw, Search, Users, Wifi, Clock, ShieldCheck } from "lucide-react";

export default function LiveMonitorPage() {
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [questionCountByExam, setQuestionCountByExam] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterExam, setFilterExam] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Each conducted exam can have a different paper length, so the "question X of Y" and
  // progress bar must read the actual exam's question count rather than an assumed 50.
  useEffect(() => {
    examRepository.listExams().then((exams) => {
      const map: Record<string, number> = {};
      exams.forEach((e) => {
        map[e.id] = e.questionIds.length || e.totalQuestions || 50;
      });
      setQuestionCountByExam(map);
    });
  }, []);

  const loadSessions = async () => {
    setIsRefreshing(true);
    const [storedSessions, idbSessions] = await Promise.all([
      OlympiadStore.getLiveSessions(),
      (async () => {
        try {
          const { idbClient } = await import("@/services/persistence/indexeddb");
          const { ExamPersistenceService } = await import("@/services/persistence/ExamPersistenceService");
          const raw = await idbClient.getAll<any>("sessions");
          return raw.map((s): ExamSession => {
            const answeredCount = Object.keys(s.answers || {}).length;
            const totalQuestions = questionCountByExam[s.examId] || 50;
            const progress = Math.round((answeredCount / totalQuestions) * 100);
            const remaining = ExamPersistenceService.calculateTrueRemainingTime(s);
            // The candidate's real browser/OS/device is captured client-side when their
            // exam session starts (see ExamSessionState.device); fall back to a plainly
            // labelled placeholder only for sessions saved before that was tracked.
            const device = s.device || {
              ip: "—",
              browser: "Unknown (legacy session)",
              os: "Unknown",
              device: "Desktop",
            };
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
              device,
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
        } catch {
          return [];
        }
      })(),
    ]);

    // Merge by sessionId
    const sessionMap = new Map<string, ExamSession>();
    storedSessions.forEach((s) => sessionMap.set(s.sessionId, s));
    idbSessions.forEach((s) => sessionMap.set(s.sessionId, s));

    setSessions(Array.from(sessionMap.values()));
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionCountByExam]);

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = filterExam === "all" || s.examId === filterExam;
    return matchesSearch && matchesExam;
  });

  // `new Set` only dedupes by reference, and a fresh {id, title} object literal is a
  // distinct reference every time even when its contents are identical — so with more than
  // one session on the same exam this produced multiple entries sharing the same `id`,
  // which React then rejected as duplicate keys in the <option> list below. Dedupe by
  // examId through a Map instead.
  const uniqueExams = Array.from(
    sessions.reduce((map, s) => {
      if (!map.has(s.examId)) map.set(s.examId, { id: s.examId, title: s.examTitle });
      return map;
    }, new Map<string, { id: string; title: string }>()).values()
  );
  const activeCount = sessions.filter((s) => s.connectionStatus === "Connected" && !s.isSubmitted).length;

  return (
    <div className="space-y-6 animate-rise-in font-sans text-[#182338]">
      <AdminHeader
        title="Live Examination Control Room"
        subtitle="Real-time candidate monitoring, live telemetry, connection heartbeats, and browser diagnostics"
      />

      <div className="space-y-6">
        {/* Top Control Room Status Banner (Forest Green Gradient) */}
        <div className="bg-gradient-to-r from-[#2468B2] via-[#2468B2] to-[#1C5190] text-white rounded-2xl p-6 lg:p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-[#F4C542] relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 text-[#F4C542] rounded-xl text-[12px] font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
              <Activity className="w-4 h-4 text-[#F4C542]" />
              Live Surveillance Session Active
            </div>
            <h2 className="text-2xl lg:text-[28px] font-bold tracking-tight">
              Olympiad Examination Live Command Desk
            </h2>
            <p className="text-[14px] text-white/85 font-medium">
              Synchronized candidate test status, anti-cheat diagnostics, and progress telemetry
            </p>
          </div>

          <div className="flex items-center gap-4 self-start md:self-center relative z-10">
            <div className="bg-white/15 px-6 py-3 rounded-2xl border border-white/20 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold font-mono text-[#F4C542]">
                {activeCount}
              </div>
              <div className="text-[12px] font-bold text-white/90 uppercase tracking-wider">
                Students Active
              </div>
            </div>

            <button
              type="button"
              onClick={loadSessions}
              className="h-[46px] px-5 bg-[#F4C542] hover:bg-[#E0AE2B] text-[#1C5190] rounded-xl text-[14px] font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-[#1C5190] ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh Feed
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white border-2 border-[#E1E7EF] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate name, candidate ID, or session code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-[46px] pl-11 pr-4 text-[14px] bg-[#F4F7FB] border border-[#E1E7EF] rounded-xl focus:bg-white focus:outline-none focus:border-[#2468B2] text-slate-900 font-bold placeholder:text-slate-400"
              />
            </div>

            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="h-[46px] px-4 text-[14px] font-bold bg-[#F4F7FB] border border-[#E1E7EF] rounded-xl text-[#1C5190] focus:bg-white focus:outline-none focus:border-[#2468B2] cursor-pointer"
            >
              <option value="all">All Active Examinations</option>
              {uniqueExams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title}
                </option>
              ))}
            </select>
          </div>

          <div className="text-[13px] text-slate-600 font-bold">
            Showing <strong className="text-[#2468B2] font-bold">{filteredSessions.length}</strong> live candidate sessions
          </div>
        </div>

        {/* Live Surveillance Table */}
        <div className="bg-white border-2 border-[#E1E7EF] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px] border-collapse">
              <thead>
                <tr className="bg-[#F4F7FB] border-b border-[#E1E7EF] text-slate-600 font-bold text-[12px] uppercase tracking-wider">
                  <th className="py-4 px-6">Student Candidate</th>
                  <th className="py-4 px-6">Session ID</th>
                  <th className="py-4 px-6">Examination</th>
                  <th className="py-4 px-6">Current Progress</th>
                  <th className="py-4 px-6">Timeline</th>
                  <th className="py-4 px-6">IP Address</th>
                  <th className="py-4 px-6">Device Profile</th>
                  <th className="py-4 px-6">Connection</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E7EF]">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500 font-medium">
                      No candidate sessions currently match your filter.
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-[#F4F7FB]/60 transition-colors h-[76px]">
                      {/* Candidate Name & School */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-[15px] text-slate-900">
                          {session.student.name}
                        </div>
                        <div className="text-[12px] font-mono text-slate-500 font-bold">
                          ID: {session.student.studentId} • {session.student.schoolName || "Registered Candidate"}
                        </div>
                      </td>

                      {/* Session ID */}
                      <td className="py-4 px-6 font-mono font-bold text-[13px] text-[#1C5190]">
                        {session.sessionId}
                      </td>

                      {/* Exam Title */}
                      <td className="py-4 px-6 text-slate-900 font-bold">
                        {session.examTitle}
                      </td>

                      {/* Current Progress & Question */}
                      <td className="py-4 px-6">
                        <div className="font-mono font-bold text-[13px] text-[#2468B2] mb-1">
                          Question {session.currentQuestionIndex + 1} of {session.totalQuestions}
                        </div>
                        <div className="w-36 flex items-center gap-2">
                          <div className="flex-1 h-2.5 bg-[#F4F7FB] rounded-full overflow-hidden border border-[#E1E7EF]">
                            <div
                              className="h-full bg-[#2468B2] rounded-full"
                              style={{ width: `${session.progressPercent}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-bold text-[#2468B2]">
                            {session.progressPercent}%
                          </span>
                        </div>
                      </td>

                      {/* Started & Last Active */}
                      <td className="py-4 px-6 text-[13px] font-mono text-slate-500">
                        <div>Start: {session.startedAt}</div>
                        <div className="text-slate-800 font-bold">Ping: {session.lastActiveAt}</div>
                      </td>

                      {/* IP Address */}
                      <td className="py-4 px-6 font-mono font-medium text-[13px] text-slate-500">
                        {session.device.ip}
                      </td>

                      {/* Device Profile */}
                      <td className="py-4 px-6 text-[13px]">
                        <div className="font-bold text-slate-900">{session.device.browser}</div>
                        <div className="text-[12px] text-slate-500 font-mono font-bold">{session.device.os}</div>
                      </td>

                      {/* Connection */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-2 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold text-[12px]">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                          Connected
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-right">
                        <span
                          className={`px-3 py-1 rounded-xl text-[12px] font-bold ${
                            session.isSubmitted
                              ? "bg-[#F4F7FB] text-slate-600 border border-[#E1E7EF]"
                              : "bg-[#2468B2] text-white shadow-subtle"
                          }`}
                        >
                          {session.isSubmitted ? "Submitted" : "In Progress"}
                        </span>
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
