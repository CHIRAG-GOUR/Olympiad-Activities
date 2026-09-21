"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OlympiadStore } from "@/services/firebase/firestore";
import { ExamSession } from "@/types/session";
import { Users, Search, Laptop, Smartphone, Tablet } from "lucide-react";

export default function StudentsDirectoryPage() {
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function load() {
      const data = await OlympiadStore.getLiveSessions();
      setSessions(data);
    }
    load();
  }, []);

  const filtered = sessions.filter(
    (s) =>
      s.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.student.schoolName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col w-full min-w-0 bg-[#F4F7EE]">
      <AdminHeader
        title="Candidate & Student Session Directory"
        subtitle="Historical and active Olympiad examination candidates, student metadata, and device profiles"
      />

      <div className="p-6 md:p-8 space-y-6 w-full max-w-[1750px] min-w-0">
        {/* Search & Statistics Bar */}
        <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, candidate ID, or school..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[46px] pl-10 pr-4 text-[14px] bg-[#F4F7EE] border border-[#D4E0C2] rounded-xl focus:bg-white focus:outline-none focus:border-[#547322] text-slate-900 font-bold placeholder:text-slate-400 transition-all"
            />
          </div>
          <span className="text-[13px] text-[#547322] font-extrabold font-mono bg-[#F4F7EE] px-3.5 py-1.5 rounded-xl border border-[#D4E0C2]">
            {filtered.length} Candidates Enrolled
          </span>
        </div>

        {/* Full-width Candidate Table */}
        <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px] border-collapse">
              <thead>
                <tr className="bg-[#F4F7EE] border-b border-[#D4E0C2] text-slate-600 font-extrabold text-[12px] uppercase tracking-wider">
                  <th className="py-4 px-6">Candidate Name</th>
                  <th className="py-4 px-6">Roll ID</th>
                  <th className="py-4 px-6">School / Institute</th>
                  <th className="py-4 px-6">Enrolled Examination</th>
                  <th className="py-4 px-6">Device Profile</th>
                  <th className="py-4 px-6">IP Subnet</th>
                  <th className="py-4 px-6">Connection Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4E0C2]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[14px] text-slate-500 font-medium">
                      No candidate sessions or student registrations found. When students take an examination, their profiles and live diagnostics will appear here.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-[#F4F7EE]/60 transition-colors h-[72px]">
                      <td className="py-4 px-6 font-extrabold text-slate-900 text-[15px]">{s.student.name}</td>
                      <td className="py-4 px-6 font-mono font-extrabold text-[#3E5519] text-[13px]">
                        {s.student.studentId}
                      </td>
                      <td className="py-4 px-6 text-slate-700 font-medium">{s.student.schoolName || "Self Registered"}</td>
                      <td className="py-4 px-6 text-slate-900 font-bold">{s.examTitle}</td>
                      <td className="py-4 px-6 text-slate-500 font-mono text-[12px] font-bold">
                        {s.device.device} • {s.device.os}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-500 text-[13px]">{s.device.ip}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-extrabold text-[12px] inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                          {s.connectionStatus}
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
