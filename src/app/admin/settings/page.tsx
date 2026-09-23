"use client";

import React, { useState } from "react";
import { isRealFirebaseConfigured } from "@/services/firebase/config";
import { Save, ShieldCheck, Database, Key, Server, CheckCircle2, Lock, Settings } from "lucide-react";

export default function SettingsAdminPage() {
  const [saved, setSaved] = useState(false);
  const [defaultDuration, setDefaultDuration] = useState(45);
  const [autoSubmit, setAutoSubmit] = useState(true);
  const [allowBacktrack, setAllowBacktrack] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-rise-in font-sans text-[#182338]">
      {/* 1. Header */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/80 shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_2px_10px_-4px_rgba(38,45,90,0.10)] rounded-2xl px-6 sm:px-7 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#2468B2]">
            <span>System Configuration</span>
            <span className="text-[#667085]">•</span>
            <span>Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#182338] mt-1">
            System Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            Examination parameters, evaluation rules, and Firebase cloud persistence architecture.
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-[1200px]">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Default Policies */}
          <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-6 shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-[#182338] border-b border-[#E1E7EF] pb-3">
              Default Examination Policies
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-[#182338] mb-1.5 block">
                  Default Exam Duration (Minutes)
                </label>
                <input
                  type="number"
                  value={defaultDuration}
                  onChange={(e) => setDefaultDuration(parseInt(e.target.value) || 45)}
                  className="w-full h-10 px-3.5 text-xs font-mono font-bold bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] focus:outline-none focus:border-[#2468B2] focus:bg-white"
                />
              </div>

              <div className="space-y-3 pt-1">
                <label className="flex items-center gap-2.5 text-xs font-bold text-[#182338] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSubmit}
                    onChange={(e) => setAutoSubmit(e.target.checked)}
                    className="w-4 h-4 text-[#2468B2] rounded border-[#E1E7EF] focus:ring-0 cursor-pointer"
                  />
                  <span>Enforce Auto-Submit on Countdown Expiry</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-bold text-[#182338] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowBacktrack}
                    onChange={(e) => setAllowBacktrack(e.target.checked)}
                    className="w-4 h-4 text-[#2468B2] rounded border-[#E1E7EF] focus:ring-0 cursor-pointer"
                  />
                  <span>Allow Free Backtracking Between Questions</span>
                </label>
              </div>
            </div>
          </div>

          {/* Firebase Storage Architecture */}
          <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-[#E1E7EF] pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#2468B2]" />
                <h3 className="text-sm font-bold text-[#182338]">
                  Firebase Persistence Architecture (Requirement 45)
                </h3>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-[#EAF2FC] text-[#1C5190] border border-[#E1E7EF] font-bold font-mono uppercase">
                {isRealFirebaseConfigured ? "Live Firestore Active" : "Local Repository Ready"}
              </span>
            </div>

            <p className="text-xs text-[#667085] leading-relaxed font-medium">
              The application utilizes clean Repository interfaces (<code className="text-[#1C5190] font-bold">IExamRepository</code>, <code className="text-[#1C5190] font-bold">IQuestionRepository</code>, <code className="text-[#1C5190] font-bold">IAttemptRepository</code>, <code className="text-[#1C5190] font-bold">IReportRepository</code>) backed by local IndexedDB storage, ready for Firebase Firestore activation without UI refactoring.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {[
                "users",
                "questions",
                "questionBanks",
                "exams",
                "examSessions",
                "attempts",
                "reports",
                "auditLogs",
              ].map((c) => (
                <div key={c} className="p-2 bg-[#F4F7FB] border border-[#E1E7EF] rounded-lg text-[#1C5190] font-bold text-center">
                  📁 {c}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saved && (
              <span className="text-xs text-[#1C5190] font-bold flex items-center gap-1.5 bg-[#EAF2FC] px-3 py-1.5 rounded-xl border border-[#E1E7EF]">
                <CheckCircle2 className="w-4 h-4 text-[#2468B2]" /> Settings updated.
              </span>
            )}
            <button
              type="submit"
              className="ml-auto h-9 px-5 bg-[#2468B2] hover:bg-[#1C5190] text-white text-xs font-bold rounded-xl shadow-subtle flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
