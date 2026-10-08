"use client";

import { useAuth } from "@/context/AuthContext";
import { ROLE_PREFIX } from "@/lib/auth/sections";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userRepository, attemptRepository } from "@/repositories";
import { UserProfile } from "@/lib/auth/rbac";
import { ExamAttempt } from "@/types/attempt";
import {
  GraduationCap,
  Search,
  Award,
  BookOpen,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { BulkStudentUpload } from "./BulkStudentUpload";
import { studentCode } from "@/lib/students/roster";

export default function StudentsScreen() {
  // Links resolve into the route group the active role actually owns.
  const router = useRouter();
  const { activeRole, canSwitchRole, switchRole } = useAuth();
  const roleBase = ROLE_PREFIX[activeRole];
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [classFilter, setClassFilter] = useState("all");

  async function load() {
    const [uList, attList] = await Promise.allSettled([
      userRepository.listUsers(),
      attemptRepository.listAttempts(),
    ]);
    if (uList.status === "fulfilled") {
      setStudents(
        uList.value
          .filter((u) => u.role === "STUDENT")
          .sort(
            (a, b) =>
              (Number(a.grade) || 0) - (Number(b.grade) || 0) ||
              (a.section || "").localeCompare(b.section || "") ||
              a.name.localeCompare(b.name)
          )
      );
    } else console.error("Failed to load students:", uList.reason);
    if (attList.status === "fulfilled") setAttempts(attList.value);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  /** "6", "6-A", … for the class filter, from the students actually registered. */
  const classOptions = Array.from(
    new Set(students.map((s) => `${Number(s.grade) || 6}${s.section ? `-${s.section}` : ""}`))
  ).sort((a, b) => parseInt(a) - parseInt(b) || a.localeCompare(b));

  const filtered = students.filter((s) => {
    const q = searchTerm.toLowerCase();
    const cls = `${Number(s.grade) || 6}${s.section ? `-${s.section}` : ""}`;
    const matchesClass = classFilter === "all" || cls === classFilter || String(Number(s.grade) || 6) === classFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      studentCode(s).toLowerCase().includes(q) ||
      (s.email && s.email.toLowerCase().includes(q));
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-rise-in font-sans text-[#182338]">
      {/* 1. Header (Requirement 8) */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/80 shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_2px_10px_-4px_rgba(38,45,90,0.10)] rounded-2xl px-6 sm:px-7 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#2468B2]">
            <span>Candidate Directory</span>
            <span className="text-[#667085]">•</span>
            <span>Student Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#182338] mt-1">
            Registered Candidates
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            Olympiad student roster, registered classes, and completed examination history.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`${roleBase}/live-monitor`}
            className="h-9 px-3.5 bg-white/70 backdrop-blur-sm border border-white/90 hover:bg-white/95 text-[#1C5190] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-subtle transition-all"
          >
            <span>Live Monitor</span>
          </Link>
          <button
            type="button"
            onClick={() => setShowBulkUpload(true)}
            className="h-9 px-3.5 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-subtle transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk Upload Students</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* 2. Search Toolbar */}
        <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full min-w-[260px]">
            <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search students by name, roll ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] font-semibold focus:outline-none focus:border-[#2468B2] focus:bg-white"
            />
          </div>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            aria-label="Filter by class"
            className="h-9 px-3 text-xs font-bold bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] focus:outline-none focus:border-[#2468B2] cursor-pointer"
          >
            <option value="all">All classes</option>
            {classOptions.map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>

          <span className="text-xs font-bold text-[#667085] px-2">
            Showing <strong className="text-[#2468B2]">{filtered.length}</strong> candidates
          </span>
        </div>

        {/* 3. Students Table */}
        <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl shadow-subtle overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 px-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF2FC] text-[#2468B2] flex items-center justify-center mx-auto border border-[#E1E7EF]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#182338]">No Registered Candidates Found</h3>
                <p className="text-xs text-[#667085] max-w-md mx-auto">
                  Student candidate records will appear here as they register and participate in Olympiad examinations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBulkUpload(true)}
                className="h-9 px-4 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" /> Upload a class list
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[980px] text-left text-xs font-semibold">
                <thead className="bg-[#F4F7FB] text-[#667085] border-b border-[#E1E7EF] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-3.5 w-[180px]">Candidate Name</th>
                    <th className="py-3 px-3 w-[140px]">Roll / Student ID</th>
                    <th className="py-3 px-2 w-[70px] text-center">Class</th>
                    <th className="py-3 px-3 min-w-[160px]">Email</th>
                    <th className="py-3 px-2 w-[110px] text-center">Exams Done</th>
                    <th className="py-3 px-2 w-[85px] text-center">Status</th>
                    <th className="py-3 px-3 w-[230px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E7EF] text-[#182338]">
                  {filtered.map((s) => {
                    const studentAttempts = attempts.filter((a) => a.student?.studentId === s.id);
                    return (
                      <tr key={s.id} className="hover:bg-white/70 transition-colors">
                        <td className="py-3 px-3.5">
                          <div className="font-bold text-xs text-[#182338] truncate max-w-[170px]" title={s.name}>{s.name}</div>
                          <div className="text-[10px] text-[#667085]">Olympiad Scholar</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-xs text-[#2468B2] bg-[#EAF2FC] px-2 py-0.5 rounded-md border border-[#E1E7EF] inline-block">
                            {studentCode(s)}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center font-bold">
                          Class {Number(s.grade) || 6}
                          {s.section ? `-${s.section}` : ""}
                        </td>
                        <td className="py-3 px-3 text-[#667085] text-xs truncate max-w-[160px]" title={s.email || "student@olympiad.org"}>
                          {s.email || "student@olympiad.org"}
                        </td>
                        <td className="py-3 px-2 text-center font-mono font-bold text-xs text-[#1C5190]">
                          {studentAttempts.length}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase bg-[#EAF2FC] text-[#1C5190] border border-[#E1E7EF] whitespace-nowrap">
                            Verified
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {canSwitchRole && (
                              <button
                                type="button"
                                onClick={() => {
                                  switchRole("STUDENT");
                                  router.push("/student/dashboard");
                                }}
                                className="h-7 px-2.5 bg-[#FFF4E5] hover:bg-[#FFE6C2] text-[#B54708] border border-[#FEDF89] rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer shrink-0"
                                title="Login and view platform as Student"
                              >
                                <ShieldCheck className="w-3 h-3" />
                                <span>Login as Student</span>
                              </button>
                            )}
                            <Link
                              href={`${roleBase}/exams`}
                              className="h-7 px-2.5 bg-blue-50 hover:bg-blue-100 text-[#2468B2] border border-blue-200 rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1 shrink-0"
                              title="Align and assign examination papers to this candidate"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>Add Exam</span>
                            </Link>
                            <Link
                              href={`${roleBase}/results`}
                              className="h-7 px-2.5 bg-[#EAF2FC] hover:bg-[#E1E7EF] text-[#1C5190] rounded-lg text-[11px] font-bold transition-all inline-flex items-center shrink-0"
                            >
                              Scores
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

      </div>

      {showBulkUpload && (
        <BulkStudentUpload onClose={() => setShowBulkUpload(false)} onCreated={() => void load()} />
      )}
    </div>
  );
}
