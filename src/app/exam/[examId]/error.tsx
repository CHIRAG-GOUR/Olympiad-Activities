"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert, RotateCcw, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ExamErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const examId = (params?.examId as string) || "";
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    console.error("[ExamError] Uncaught error inside examination session:", error);
  }, [error]);

  const handleStartFresh = async () => {
    setClearing(true);
    if (typeof window !== "undefined") {
      try {
        if (examId) {
          localStorage.removeItem(`active_exam_session_${examId}`);
        }
        localStorage.removeItem("active_exam_session");
        const { idbClient } = await import("@/services/persistence/indexeddb");
        const all = await idbClient.getAll<any>("sessions");
        const match = all.find((s) => s.examId === examId && s.status === "in_progress");
        if (match) {
          await idbClient.delete("sessions", match.sessionId);
        }
      } catch (e) {
        console.warn("[ExamErrorBoundary] Error clearing session:", e);
      }
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4 select-none font-sans">
      <div className="bg-white rounded-2xl border-2 border-slate-300 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200">
            Session Recovery Safeguard
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-2">
            Examination Session Safeguard
          </h2>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            A temporary display interruption occurred. Your previous progress has been saved in local storage. You can retry resuming, start a fresh attempt, or return to the portal.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full h-11 px-5 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>Try Resuming Session</span>
          </button>

          <button
            type="button"
            onClick={handleStartFresh}
            disabled={clearing}
            className="w-full h-11 px-5 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 text-[#2468B2] ${clearing ? "animate-spin" : ""}`} />
            <span>{clearing ? "Clearing Cache & Restarting..." : "Start Fresh Paper Attempt"}</span>
          </button>

          <Link
            href="/student/exams"
            className="w-full h-11 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Examinations Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
