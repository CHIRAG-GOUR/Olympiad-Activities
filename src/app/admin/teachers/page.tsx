"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { userRepository, examRepository } from "@/repositories";
import { UserProfile } from "@/lib/auth/rbac";
import { Exam } from "@/types/exam";
import {
  Users,
  Search,
  Plus,
  BookOpen,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Mail,
  Award,
} from "lucide-react";

export default function TeachersDirectoryPage() {
  const [teachers, setTeachers] = useState<UserProfile[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherEmail, setNewTeacherEmail] = useState("");
  const [newTeacherSubject, setNewTeacherSubject] = useState("Mathematics");

  useEffect(() => {
    async function load() {
      try {
        const [uList, exList] = await Promise.all([
          userRepository.listUsers(),
          examRepository.listExams(),
        ]);
        setTeachers(uList.filter((u) => u.role === "TEACHER" || u.role === "SUPER_ADMIN"));
        setExams(exList);
      } catch (err) {
        console.error("Failed to load teachers:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) return;

    const teacherObj: UserProfile = {
      id: `tea_${Date.now()}`,
      name: newTeacherName.trim(),
      email: newTeacherEmail.trim() || `${newTeacherName.toLowerCase().replace(/\s+/g, ".")}@olympiad.org`,
      role: "TEACHER",
      createdAt: new Date().toISOString(),
    };

    try {
      await userRepository.saveUser(teacherObj);
      setTeachers((prev) => [...prev, teacherObj]);
      setShowAddModal(false);
      setNewTeacherName("");
      setNewTeacherEmail("");
    } catch (err) {
      console.error("Failed to add teacher:", err);
    }
  };

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.email && t.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col font-sans select-none text-[#172033]">
      {/* 1. Header (Requirement 8, 46) */}
      <div className="px-6 sm:px-8 py-6 border-b border-[#DDE4D7] bg-[#F6F9F1]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#4D741F]">
            <span>Faculty & Evaluator Roster</span>
            <span className="text-[#667085]">•</span>
            <span>People</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172033] mt-1">
            Teachers & Evaluators
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            Certified Olympiad faculty examiners, test paper authors, and evaluation coordinators.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="h-9 px-4 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Faculty</span>
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6 flex-1">
        
        {/* 2. Search Toolbar */}
        <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full min-w-[260px]">
            <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#F6F9F1]/60 border border-[#DDE4D7] rounded-xl text-[#172033] font-semibold focus:outline-none focus:border-[#4D741F] focus:bg-white"
            />
          </div>

          <span className="text-xs font-bold text-[#667085] px-2">
            Showing <strong className="text-[#4D741F]">{filtered.length}</strong> faculty members
          </span>
        </div>

        {/* 3. Teachers Table */}
        <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl shadow-xs overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 px-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF5E7] text-[#4D741F] flex items-center justify-center mx-auto border border-[#DDE4D7]">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-[#172033]">No Faculty Members Found</h3>
                <p className="text-xs text-[#667085] max-w-md mx-auto">
                  Add teacher accounts to authorize examiners to compile test papers and review student results.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="h-9 px-4 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Teacher</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead className="bg-[#F6F9F1] text-[#667085] border-b border-[#DDE4D7] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Faculty Member</th>
                    <th className="p-4">Teacher ID</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Official Email</th>
                    <th className="p-4 text-center">Assigned Exams</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE4D7] text-[#172033]">
                  {filtered.map((t) => (
                    <tr key={t.id} className="hover:bg-[#F6F9F1]/60 transition-colors">
                      <td className="p-4">
                        <div className="font-extrabold text-sm text-[#172033]">{t.name}</div>
                        <div className="text-[10px] text-[#667085]">Olympiad Examination Council</div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-bold text-[#4D741F] bg-[#EEF5E7] px-2 py-0.5 rounded-md border border-[#DDE4D7]">
                          {t.id}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-[#172033]">
                          {t.role === "SUPER_ADMIN" ? "Super Admin" : "Faculty Examiner"}
                        </span>
                      </td>
                      <td className="p-4 text-[#667085]">
                        {t.email || "faculty@olympiad.org"}
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-[#355415]">
                        {exams.length}
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#EEF5E7] text-[#355415] border border-[#DDE4D7]">
                          Active
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href="/admin/exams"
                          className="px-3 py-1.5 bg-[#EEF5E7] hover:bg-[#DDE4D7] text-[#355415] rounded-lg text-xs font-bold transition-all inline-block"
                        >
                          View Papers
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Teacher Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-[#DDE4D7] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#DDE4D7] pb-3">
                <h3 className="text-base font-extrabold text-[#172033]">Add Faculty Examiner</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddTeacher} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#172033] mb-1 block">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                    placeholder="e.g. Dr. Ramesh Gupta"
                    className="w-full h-9 px-3 text-xs bg-[#F6F9F1] border border-[#DDE4D7] rounded-xl text-[#172033] focus:outline-none focus:border-[#4D741F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#172033] mb-1 block">Official Email</label>
                  <input
                    type="email"
                    value={newTeacherEmail}
                    onChange={(e) => setNewTeacherEmail(e.target.value)}
                    placeholder="e.g. ramesh.gupta@olympiad.org"
                    className="w-full h-9 px-3 text-xs bg-[#F6F9F1] border border-[#DDE4D7] rounded-xl text-[#172033] focus:outline-none focus:border-[#4D741F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#172033] mb-1 block">Primary Subject</label>
                  <select
                    value={newTeacherSubject}
                    onChange={(e) => setNewTeacherSubject(e.target.value)}
                    className="w-full h-9 px-3 text-xs font-bold bg-[#F6F9F1] border border-[#DDE4D7] rounded-xl text-[#172033] focus:outline-none focus:border-[#4D741F]"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Logical Reasoning">Logical Reasoning</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-[#DDE4D7] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="h-9 px-4 bg-white border border-[#DDE4D7] text-[#667085] rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-5 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Create Faculty Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
