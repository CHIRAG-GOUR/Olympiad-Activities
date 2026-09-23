"use client";

import { useAuth } from "@/context/AuthContext";
import { ROLE_PREFIX } from "@/lib/auth/sections";
import React, { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";

export default function StudentsScreen() {
  // Links resolve into the route group the active role actually owns.
  const { activeRole } = useAuth();
  const roleBase = ROLE_PREFIX[activeRole];
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [uList, attList] = await Promise.all([
          userRepository.listUsers(),
          attemptRepository.listAttempts(),
        ]);
        setStudents(uList.filter((u) => u.role === "STUDENT"));
        setAttempts(attList);
      } catch (err) {
        console.error("Failed to load students:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead className="bg-[#F4F7FB] text-[#667085] border-b border-[#E1E7EF] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Candidate Name</th>
                    <th className="p-4">Roll / Student ID</th>
                    <th className="p-4 text-center">Class</th>
                    <th className="p-4">Email</th>
                    <th className="p-4 text-center">Exams Completed</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E7EF] text-[#182338]">
                  {filtered.map((s) => {
                    const studentAttempts = attempts.filter((a) => a.student?.studentId === s.id);
                    return (
                      <tr key={s.id} className="hover:bg-white/70 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-sm text-[#182338]">{s.name}</div>
                          <div className="text-[10px] text-[#667085]">Olympiad Scholar</div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono font-bold text-[#2468B2] bg-[#EAF2FC] px-2 py-0.5 rounded-md border border-[#E1E7EF]">
                            {s.id}
                          </span>
                        </td>
                        <td className="p-4 text-center font-bold">
                          Class {s.grade || 6}
                        </td>
                        <td className="p-4 text-[#667085]">
                          {s.email || "student@olympiad.org"}
                        </td>
                        <td className="p-4 text-center font-mono font-bold text-[#1C5190]">
                          {studentAttempts.length}
                        </td>
                        <td className="p-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#EAF2FC] text-[#1C5190] border border-[#E1E7EF]">
                            Verified
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            href={`${roleBase}/results`}
                            className="px-3 py-1.5 bg-[#EAF2FC] hover:bg-[#E1E7EF] text-[#1C5190] rounded-lg text-xs font-bold transition-all inline-block"
                          >
                            View Scores
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

      </div>
    </div>
  );
}
