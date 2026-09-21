"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OlympiadStore } from "@/services/firebase/firestore";
import { Subject } from "@/types/subject";
import { BookOpen, FolderTree, Plus, BookCheck, Layers } from "lucide-react";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await OlympiadStore.getSubjects();
      setSubjects(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex-1 flex flex-col w-full min-w-0 bg-[#F4F7EE]">
      <AdminHeader
        title="Olympiad Subject & Taxonomy Catalogue"
        subtitle="Manage academic subjects, chapters, topics, and grade-level curricula"
      />

      <div className="p-6 md:p-8 space-y-6 w-full max-w-[1750px] min-w-0">
        {subjects.length === 0 ? (
          <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-12 text-center shadow-sm space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 bg-[#F4F7EE] text-[#547322] rounded-2xl flex items-center justify-center mx-auto border border-[#D4E0C2]">
              <BookOpen className="w-8 h-8 text-[#547322]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-slate-900">No Subjects In Catalogue</h3>
              <p className="text-[14px] text-slate-600 leading-relaxed font-medium">
                Add academic subjects, curriculum chapters, and grade-level topic taxonomies to organize questions and tests.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {subjects.map((sub) => (
              <div
                key={sub.id}
                className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-[12px] bg-[#547322] text-white px-3 py-1 rounded-lg">
                      {sub.code}
                    </span>
                    <span className="text-[12px] text-[#92400E] font-extrabold font-mono bg-[#FEF3C7] px-2.5 py-1 rounded-lg border border-[#FDE68A]">
                      Grades {sub.gradeLevels.join(", ")}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[19px] font-extrabold text-slate-900 leading-snug">{sub.name}</h3>
                    <p className="text-[13px] text-slate-600 mt-1 leading-relaxed font-medium">{sub.description}</p>
                  </div>

                  {/* Chapter taxonomy */}
                  <div className="pt-3 border-t border-[#D4E0C2] space-y-2.5">
                    <div className="text-[12px] font-extrabold uppercase tracking-wider text-[#3E5519] flex items-center gap-2">
                      <FolderTree className="w-4 h-4 text-[#547322]" />
                      <span>Chapters & Topic Strands ({sub.chapters.length})</span>
                    </div>
                    <div className="space-y-2">
                      {sub.chapters.map((ch) => (
                        <div key={ch.id} className="p-3 bg-[#F4F7EE] rounded-xl border border-[#D4E0C2] text-xs">
                          <div className="font-extrabold text-slate-900 text-[13px]">{ch.name}</div>
                          <div className="text-[11px] text-slate-600 mt-1.5 flex flex-wrap gap-1.5 font-bold">
                            {ch.topics.map((t) => (
                              <span key={t.id} className="bg-white px-2.5 py-0.5 rounded-md border border-[#D4E0C2] text-slate-800">
                                {t.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D4E0C2] flex items-center justify-between text-[13px] font-extrabold font-mono">
                  <span className="text-[#547322]">{sub.questionCount || 0} Questions Linked</span>
                  <span className="text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#FDE68A]">
                    {sub.examCount || 0} Active Exams
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
