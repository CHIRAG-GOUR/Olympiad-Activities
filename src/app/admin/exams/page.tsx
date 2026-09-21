"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OlympiadStore } from "@/services/firebase/firestore";
import { Exam } from "@/types/exam";
import { Plus, Search, Calendar, Clock, Award, Users, CheckCircle, Play, ExternalLink } from "lucide-react";

export default function ExamsListPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await OlympiadStore.getExams();
      setExams(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = exams.filter(
    (e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col w-full min-w-0">
      <AdminHeader
        title="Olympiad Examinations Catalogue"
        subtitle="Schedule, configure, author, and deploy digital Olympiad test papers"
        actionButton={{
          label: "Create New Exam",
          href: "/admin/exams/new",
        }}
      />

      <div className="p-6 md:p-8 space-y-6 w-full min-w-0">
        {/* Search & Filter Bar */}
        <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search examinations by title, code or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[46px] pl-10 pr-4 text-[14px] bg-[#F4F7EE] border border-[#D4E0C2] rounded-xl focus:bg-white focus:outline-none focus:border-[#547322] focus:ring-2 focus:ring-[#D4E0C2] text-slate-900 font-bold placeholder:text-slate-400 transition-all"
            />
          </div>

          <span className="text-[13px] text-[#547322] font-extrabold font-mono bg-[#F4F7EE] px-3 py-1.5 rounded-xl border border-[#D4E0C2]">
            {filtered.length} {filtered.length === 1 ? "Examination" : "Examinations"} Configured
          </span>
        </div>

        {/* Exams Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-10 lg:p-14 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-[#F4F7EE] text-[#547322] rounded-xl flex items-center justify-center mx-auto border border-[#D4E0C2]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {exams.length === 0 ? "No Examinations Published Yet" : "No Matching Examinations"}
              </h3>
              <p className="text-[14px] text-slate-600 max-w-md mx-auto mt-1 font-medium">
                {exams.length === 0
                  ? "Create and schedule your first digital Olympiad examination paper for students and candidates."
                  : "No examination matches your current search keyword."}
              </p>
            </div>
            {exams.length === 0 && (
              <div className="pt-2">
                <Link
                  href="/admin/exams/new"
                  className="h-[44px] px-6 bg-[#547322] hover:bg-[#435C1B] text-white rounded-xl text-[14px] font-extrabold inline-flex items-center gap-2 shadow-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Examination</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((exam) => (
              <div
                key={exam.id}
                className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#547322] transition-all space-y-5"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-[12px] bg-[#0B4F8A] text-white px-2.5 py-1 rounded-lg">
                      {exam.code}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[12px] font-bold">
                      ● {exam.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[18px] font-extrabold text-slate-900 leading-snug">{exam.title}</h3>
                    {exam.subtitle && (
                      <p className="text-[13px] text-[#B45309] mt-0.5 font-bold">{exam.subtitle}</p>
                    )}
                  </div>

                  <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2 font-medium">
                    {exam.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#D4E0C2] text-[12px] text-slate-600">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Clock className="w-4 h-4 text-[#547322]" />
                      <span>{exam.durationMinutes} mins</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold">
                      <Award className="w-4 h-4 text-[#D97706]" />
                      <span>{exam.totalMarks} Marks</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold">
                      <Users className="w-4 h-4 text-slate-800" />
                      <span>{exam.participantCount || 0} Students</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D4E0C2] flex items-center justify-between gap-3">
                  <Link
                    href={`/exam/${exam.id}`}
                    className="h-[40px] px-3.5 text-[13px] font-bold text-[#92400E] bg-[#FEF3C7] hover:bg-[#FDE68A] border border-[#FDE68A] rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Play className="w-4 h-4 fill-[#D97706] text-[#D97706]" />
                    <span>Launch Exam</span>
                  </Link>

                  <Link
                    href={`/admin/exams/${exam.id}`}
                    className="h-[40px] px-4 bg-[#547322] hover:bg-[#435C1B] text-white rounded-xl text-[13px] font-extrabold flex items-center justify-center transition-colors shadow-sm"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
