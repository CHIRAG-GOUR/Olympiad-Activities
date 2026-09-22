"use client";

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

export default function StudentsDirectoryPage() {
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
    <div className="flex-1 flex flex-col font-sans select-none text-[#172033]">
      {/* 1. Header (Requirement 8) */}
      <div className="px-6 sm:px-8 py-6 border-b border-[#DDE4D7] bg-[#F6F9F1]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#4D741F]">
            <span>Candidate Directory</span>
            <span className="text-[#667085]">•</span>
            <span>Student Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172033] mt-1">
            Registered Candidates
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            Olympiad student roster, registered classes, and completed examination history.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/live-monitor"
            className="h-9 px-3.5 bg-white border border-[#DDE4D7] hover:bg-[#EEF5E7] text-[#355415] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <span>Live Monitor</span>
          </Link>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6 flex-1">
        
        {/* 2. Search Toolbar */}
        <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full min-w-[260px]">
            <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search students by name, roll ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#F6F9F1]/60 border border-[#DDE4D7] rounded-xl text-[#172033] font-semibold focus:outline-none focus:border-[#4D741F] focus:bg-white"
            />
          </div>

          <span className="text-xs font-bold text-[#667085] px-2">
            Showing <strong className="text-[#4D741F]">{filtered.length}</strong> candidates
          </span>
        </div>

        {/* 3. Students Table */}
        <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl shadow-xs overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 px-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF5E7] text-[#4D741F] flex items-center justify-center mx-auto border border-[#DDE4D7]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-[#172033]">No Registered Candidates Found</h3>
                <p className="text-xs text-[#667085] max-w-md mx-auto">
                  Student candidate records will appear here as they register and participate in Olympiad examinations.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead className="bg-[#F6F9F1] text-[#667085] border-b border-[#DDE4D7] uppercase text-[10px] tracking-wider">
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
                <tbody className="divide-y divide-[#DDE4D7] text-[#172033]">
                  {filtered.map((s) => {
                    const studentAttempts = attempts.filter((a) => a.student?.studentId === s.id);
                    return (
                      <tr key={s.id} className="hover:bg-[#F6F9F1]/60 transition-colors">
                        <td className="p-4">
                          <div className="font-extrabold text-sm text-[#172033]">{s.name}</div>
                          <div className="text-[10px] text-[#667085]">Olympiad Scholar</div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono font-bold text-[#4D741F] bg-[#EEF5E7] px-2 py-0.5 rounded-md border border-[#DDE4D7]">
                            {s.id}
                          </span>
                        </td>
                        <td className="p-4 text-center font-bold">
                          Class {s.grade || 6}
                        </td>
                        <td className="p-4 text-[#667085]">
                          {s.email || "student@olympiad.org"}
                        </td>
                        <td className="p-4 text-center font-mono font-bold text-[#355415]">
                          {studentAttempts.length}
                        </td>
                        <td className="p-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#EEF5E7] text-[#355415] border border-[#DDE4D7]">
                            Verified
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            href="/admin/results"
                            className="px-3 py-1.5 bg-[#EEF5E7] hover:bg-[#DDE4D7] text-[#355415] rounded-lg text-xs font-bold transition-all inline-block"
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
