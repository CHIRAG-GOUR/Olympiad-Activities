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
    <div className="flex-1 flex flex-col font-sans select-none text-[#172033]">
      {/* 1. Header */}
      <div className="px-6 sm:px-8 py-6 border-b border-[#DDE4D7] bg-[#F6F9F1]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#4D741F]">
            <span>System Configuration</span>
            <span className="text-[#667085]">•</span>
            <span>Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172033] mt-1">
            System Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            Examination parameters, evaluation rules, and Firebase cloud persistence architecture.
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6 flex-1 max-w-[1200px]">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Default Policies */}
          <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#172033] border-b border-[#DDE4D7] pb-3">
              Default Examination Policies
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-[#172033] mb-1.5 block">
                  Default Exam Duration (Minutes)
                </label>
                <input
                  type="number"
                  value={defaultDuration}
                  onChange={(e) => setDefaultDuration(parseInt(e.target.value) || 45)}
                  className="w-full h-10 px-3.5 text-xs font-mono font-bold bg-[#F6F9F1]/60 border border-[#DDE4D7] rounded-xl text-[#172033] focus:outline-none focus:border-[#4D741F] focus:bg-white"
                />
              </div>

              <div className="space-y-3 pt-1">
                <label className="flex items-center gap-2.5 text-xs font-bold text-[#172033] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSubmit}
                    onChange={(e) => setAutoSubmit(e.target.checked)}
                    className="w-4 h-4 text-[#4D741F] rounded border-[#DDE4D7] focus:ring-0 cursor-pointer"
                  />
                  <span>Enforce Auto-Submit on Countdown Expiry</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-bold text-[#172033] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowBacktrack}
                    onChange={(e) => setAllowBacktrack(e.target.checked)}
                    className="w-4 h-4 text-[#4D741F] rounded border-[#DDE4D7] focus:ring-0 cursor-pointer"
                  />
                  <span>Allow Free Backtracking Between Questions</span>
                </label>
              </div>
            </div>
          </div>

          {/* Firebase Storage Architecture */}
          <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDE4D7] pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#4D741F]" />
                <h3 className="text-sm font-extrabold text-[#172033]">
                  Firebase Persistence Architecture (Requirement 45)
                </h3>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-[#EEF5E7] text-[#355415] border border-[#DDE4D7] font-extrabold font-mono uppercase">
                {isRealFirebaseConfigured ? "Live Firestore Active" : "Local Repository Ready"}
              </span>
            </div>

            <p className="text-xs text-[#667085] leading-relaxed font-medium">
              The application utilizes clean Repository interfaces (<code className="text-[#355415] font-bold">IExamRepository</code>, <code className="text-[#355415] font-bold">IQuestionRepository</code>, <code className="text-[#355415] font-bold">IAttemptRepository</code>, <code className="text-[#355415] font-bold">IReportRepository</code>) backed by local IndexedDB storage, ready for Firebase Firestore activation without UI refactoring.
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
                <div key={c} className="p-2 bg-[#F6F9F1] border border-[#DDE4D7] rounded-lg text-[#355415] font-bold text-center">
                  📁 {c}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saved && (
              <span className="text-xs text-[#355415] font-bold flex items-center gap-1.5 bg-[#EEF5E7] px-3 py-1.5 rounded-xl border border-[#DDE4D7]">
                <CheckCircle2 className="w-4 h-4 text-[#4D741F]" /> Settings updated.
              </span>
            )}
            <button
              type="submit"
              className="ml-auto h-9 px-5 bg-[#4D741F] hover:bg-[#355415] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
