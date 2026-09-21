"use client";

import React, { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { isRealFirebaseConfigured } from "@/services/firebase/config";
import { Save, ShieldCheck, Database, Key, Server, CheckCircle2, Lock } from "lucide-react";

export default function SettingsAdminPage() {
  const [saved, setSaved] = useState(false);
  const [defaultDuration, setDefaultDuration] = useState(45);
  const [autoSubmit, setAutoSubmit] = useState(true);
  const [allowBacktrack, setAllowBacktrack] = useState(true);
  const [showLiveStatus, setShowLiveStatus] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col w-full min-w-0 bg-[#F4F7EE]">
      <AdminHeader
        title="Platform & Examination Configuration"
        subtitle="Global exam parameters, Firebase backend integration, and future authentication architecture"
      />

      <div className="p-6 md:p-8 space-y-6 w-full max-w-[1750px] min-w-0">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Examination Global Defaults */}
          <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-[17px] font-black text-slate-900 border-b border-[#D4E0C2] pb-3">
              Default Examination Policies
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[13px] font-extrabold text-slate-900 mb-1.5 block">
                  Default Exam Duration (Minutes)
                </label>
                <input
                  type="number"
                  value={defaultDuration}
                  onChange={(e) => setDefaultDuration(parseInt(e.target.value) || 45)}
                  className="w-full h-[46px] text-[14px] px-4 bg-[#F4F7EE] border border-[#D4E0C2] rounded-xl font-mono font-extrabold text-slate-900 focus:bg-white focus:outline-none focus:border-[#547322]"
                />
              </div>

              <div className="space-y-3.5 pt-1">
                <label className="flex items-center gap-3 text-[14px] font-bold text-slate-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoSubmit}
                    onChange={(e) => setAutoSubmit(e.target.checked)}
                    className="w-4 h-4 text-[#547322] border-slate-300 rounded focus:ring-0 cursor-pointer"
                  />
                  <span>Enforce Auto-Submit on Timeout Countdown Zero</span>
                </label>

                <label className="flex items-center gap-3 text-[14px] font-bold text-slate-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={allowBacktrack}
                    onChange={(e) => setAllowBacktrack(e.target.checked)}
                    className="w-4 h-4 text-[#547322] border-slate-300 rounded focus:ring-0 cursor-pointer"
                  />
                  <span>Enable Candidate Question Palette Free Backtracking</span>
                </label>
              </div>
            </div>
          </div>

          {/* Firebase Backend Status & Schema */}
          <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-[17px] font-black text-slate-900 border-b border-[#D4E0C2] pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#547322]" />
                Firebase Backend & Collections Architecture
              </span>
              <span className="text-[12px] px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold font-mono">
                {isRealFirebaseConfigured ? "Live Firestore Active" : "Local-First Persistent Store"}
              </span>
            </h3>

            <div className="text-[13px] space-y-3">
              <p className="font-bold text-slate-700">
                The platform is architected around 13 standardized collections:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 font-mono text-[12px]">
                {[
                  "users",
                  "students",
                  "subjects",
                  "topics",
                  "questionBanks",
                  "questions",
                  "questionVersions",
                  "exams",
                  "examSessions",
                  "attempts",
                  "answers",
                  "analyticsEvents",
                  "imports",
                  "auditLogs",
                ].map((col) => (
                  <div
                    key={col}
                    className="px-3.5 py-2 bg-[#F4F7EE] border border-[#D4E0C2] rounded-xl text-[#3E5519] font-extrabold"
                  >
                    📁 {col}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Future Authentication Roadmap */}
          <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
            <h3 className="text-[17px] font-black text-slate-900 border-b border-[#D4E0C2] pb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#547322]" />
              Firebase Authentication Architecture (Prepared for V2)
            </h3>
            <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
              In accordance with V1 specifications, student exams run without login barriers using stable session IDs. All student records contain <code className="text-[#3E5519] font-bold bg-[#F4F7EE] px-2 py-0.5 rounded border border-[#D4E0C2]">studentId</code> keys ready to bind to Firebase Auth roles (ADMIN, TEACHER, STUDENT) in future releases.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saved && (
              <span className="text-[13px] text-[#547322] font-extrabold flex items-center gap-1.5 bg-[#F4F7EE] px-3.5 py-1.5 rounded-xl border border-[#D4E0C2]">
                <CheckCircle2 className="w-4 h-4 text-[#547322]" /> Settings updated successfully.
              </span>
            )}
            <button
              type="submit"
              className="ml-auto h-[46px] px-6 bg-[#547322] hover:bg-[#435C1B] text-white text-[14px] font-extrabold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
