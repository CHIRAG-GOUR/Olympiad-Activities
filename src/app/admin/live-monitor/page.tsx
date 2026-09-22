"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OlympiadStore } from "@/services/firebase/firestore";
import { ExamSession } from "@/types/session";
import { Activity, RefreshCw, Search, Users, Wifi, Clock, ShieldCheck } from "lucide-react";

export default function LiveMonitorPage() {
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterExam, setFilterExam] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
            const progress = Math.round((answeredCount / 50) * 100);
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
              device: {
                ip: s.lastKnownIp || "127.0.0.1",
                browser: "Chrome (Candidate PC)",
                os: "Windows 11",
                device: "Desktop",
              },
              currentQuestionIndex: s.currentQuestionIndex || 0,
              currentQuestionId: s.currentQuestionId || "",
              totalQuestions: 50,
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
  }, []);

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = filterExam === "all" || s.examId === filterExam;
    return matchesSearch && matchesExam;
  });

  const uniqueExams = Array.from(new Set(sessions.map((s) => ({ id: s.examId, title: s.examTitle }))));
  const activeCount = sessions.filter((s) => s.connectionStatus === "Connected" && !s.isSubmitted).length;

  return (
    <div className="flex-1 flex flex-col w-full min-w-0 bg-[#F4F7EE]">
      <AdminHeader
        title="Live Examination Control Room"
        subtitle="Real-time candidate monitoring, live telemetry, connection heartbeats, and browser diagnostics"
      />

      <div className="p-6 lg:p-8 space-y-6 w-full max-w-[1750px] min-w-0">
        {/* Top Control Room Status Banner (Forest Green Gradient) */}
        <div className="bg-gradient-to-r from-[#547322] via-[#4D691F] to-[#3E5519] text-white rounded-2xl p-6 lg:p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-[#FFE066] relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 text-[#FFE066] rounded-xl text-[12px] font-extrabold uppercase tracking-wider border border-white/20 backdrop-blur-xs">
              <Activity className="w-4 h-4 text-[#FFE066]" />
              Live Surveillance Session Active
            </div>
            <h2 className="text-2xl lg:text-[28px] font-extrabold tracking-tight">
              Olympiad Examination Live Command Desk
            </h2>
            <p className="text-[14px] text-white/85 font-medium">
              Synchronized candidate test status, anti-cheat diagnostics, and progress telemetry
            </p>
          </div>

          <div className="flex items-center gap-4 self-start md:self-center relative z-10">
            <div className="bg-white/15 px-6 py-3 rounded-2xl border border-white/20 text-center backdrop-blur-xs">
              <div className="text-3xl font-black font-mono text-[#FFE066]">
                {activeCount}
              </div>
              <div className="text-[12px] font-bold text-white/90 uppercase tracking-wider">
                Students Active
              </div>
            </div>

            <button
              type="button"
              onClick={loadSessions}
              className="h-[46px] px-5 bg-[#FFE066] hover:bg-[#F4C400] text-[#3E5519] rounded-xl text-[14px] font-extrabold flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-[#3E5519] ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh Feed
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate name, candidate ID, or session code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-[46px] pl-11 pr-4 text-[14px] bg-[#F4F7EE] border border-[#D4E0C2] rounded-xl focus:bg-white focus:outline-none focus:border-[#547322] text-slate-900 font-bold placeholder:text-slate-400"
              />
            </div>

            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="h-[46px] px-4 text-[14px] font-bold bg-[#F4F7EE] border border-[#D4E0C2] rounded-xl text-[#3E5519] focus:bg-white focus:outline-none focus:border-[#547322] cursor-pointer"
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
            Showing <strong className="text-[#547322] font-black">{filteredSessions.length}</strong> live candidate sessions
          </div>
        </div>

        {/* Live Surveillance Table */}
        <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px] border-collapse">
              <thead>
                <tr className="bg-[#F4F7EE] border-b border-[#D4E0C2] text-slate-600 font-extrabold text-[12px] uppercase tracking-wider">
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
              <tbody className="divide-y divide-[#D4E0C2]">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500 font-medium">
                      No candidate sessions currently match your filter.
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-[#F4F7EE]/60 transition-colors h-[76px]">
                      {/* Candidate Name & School */}
                      <td className="py-4 px-6">
                        <div className="font-extrabold text-[15px] text-slate-900">
                          {session.student.name}
                        </div>
                        <div className="text-[12px] font-mono text-slate-500 font-bold">
                          ID: {session.student.studentId} • {session.student.schoolName || "Registered Candidate"}
                        </div>
                      </td>

                      {/* Session ID */}
                      <td className="py-4 px-6 font-mono font-bold text-[13px] text-[#3E5519]">
                        {session.sessionId}
                      </td>

                      {/* Exam Title */}
                      <td className="py-4 px-6 text-slate-900 font-bold">
                        {session.examTitle}
                      </td>

                      {/* Current Progress & Question */}
                      <td className="py-4 px-6">
                        <div className="font-mono font-extrabold text-[13px] text-[#547322] mb-1">
                          Question {session.currentQuestionIndex + 1} of {session.totalQuestions}
                        </div>
                        <div className="w-36 flex items-center gap-2">
                          <div className="flex-1 h-2.5 bg-[#F4F7EE] rounded-full overflow-hidden border border-[#D4E0C2]">
                            <div
                              className="h-full bg-[#547322] rounded-full"
                              style={{ width: `${session.progressPercent}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-extrabold text-[#547322]">
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
                        <div className="font-extrabold text-slate-900">{session.device.browser}</div>
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
                          className={`px-3 py-1 rounded-xl text-[12px] font-extrabold ${
                            session.isSubmitted
                              ? "bg-[#F4F7EE] text-slate-600 border border-[#D4E0C2]"
                              : "bg-[#547322] text-white shadow-xs"
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
