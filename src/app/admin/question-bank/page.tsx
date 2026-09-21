"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OlympiadStore } from "@/services/firebase/firestore";
import { QuestionRenderer } from "@/components/questions/QuestionRenderer";
import { Question } from "@/types/question";
import { Search, Database, Eye, Plus, Copy, Filter, X, Check } from "lucide-react";

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await OlympiadStore.getQuestions();
      setQuestions(data);
    }
    load();
  }, []);

  const handleDuplicate = async (q: Question) => {
    const dup: Question = {
      ...q,
      id: `q_${Date.now()}`,
      questionId: `${q.questionId}-COPY`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await OlympiadStore.saveQuestion(dup);
    setQuestions([dup, ...questions]);
    setCopiedId(dup.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filtered = questions.filter((q) => {
    const matchesSearch =
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.questionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSub = selectedSubject === "all" || q.subjectId === selectedSubject;
    const matchesType = selectedType === "all" || q.questionType === selectedType;
    return matchesSearch && matchesSub && matchesType;
  });

  return (
    <div className="flex-1 flex flex-col w-full bg-[#F4F7EE]">
      <AdminHeader
        title="Reusable Olympiad Question Bank"
        subtitle="Curated library of standardized interactive questions for exam compilation"
        actionButton={{
          label: "+ New Question",
          href: "/admin/questions/new",
        }}
      />

      <div className="p-6 lg:p-8 space-y-6 max-w-[1750px]">
        {/* Controls */}
        <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-5 shadow-sm flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search question bank by keyword or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[44px] pl-10 pr-4 text-[13px] bg-[#F4F7EE] border border-[#D4E0C2] rounded-xl focus:bg-white focus:outline-none focus:border-[#547322] font-bold text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="h-[44px] px-4 text-[13px] font-bold bg-[#F4F7EE] border border-[#D4E0C2] rounded-xl text-[#3E5519] focus:bg-white focus:outline-none focus:border-[#547322] cursor-pointer"
          >
            <option value="all">All Subjects</option>
            <option value="sub_math">Mathematics</option>
            <option value="sub_science">Science</option>
            <option value="sub_reasoning">Logical Reasoning</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-[44px] px-4 text-[13px] font-bold bg-[#F4F7EE] border border-[#D4E0C2] rounded-xl text-[#3E5519] focus:bg-white focus:outline-none focus:border-[#547322] cursor-pointer"
          >
            <option value="all">All Interaction Types</option>
            <option value="ORDERING">Ordering</option>
            <option value="DRAG_DROP">Drag & Drop</option>
            <option value="NUMERIC">Numeric</option>
            <option value="MATCHING">Matching</option>
            <option value="CLASSIFICATION">Classification</option>
            <option value="HOTSPOT">Hotspot</option>
            <option value="SIMULATION">Simulation</option>
          </select>
        </div>

        {/* Question Bank Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-10 lg:p-14 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-[#F4F7EE] text-[#547322] rounded-xl flex items-center justify-center mx-auto border border-[#D4E0C2]">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {questions.length === 0 ? "Question Bank is Empty" : "No Matching Questions in Bank"}
              </h3>
              <p className="text-[14px] text-slate-600 max-w-md mx-auto mt-1 font-medium">
                {questions.length === 0
                  ? "Author questions or import spreadsheets to build your curated question repository."
                  : "No question matches your filter criteria."}
              </p>
            </div>
            {questions.length === 0 && (
              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  href="/admin/questions/new"
                  className="h-[42px] px-5 bg-[#547322] hover:bg-[#435C1B] text-white rounded-xl text-[14px] font-extrabold inline-flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Author New Question</span>
                </Link>
                <Link
                  href="/admin/imports"
                  className="h-[42px] px-5 bg-[#F4F7EE] border border-[#D4E0C2] hover:bg-[#EBF1E4] text-[#3E5519] rounded-xl text-[14px] font-bold inline-flex items-center gap-2 transition-colors"
                >
                  <span>Import Spreadsheet</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((q) => (
              <div
                key={q.id}
                className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#547322] transition-colors space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-[13px] text-[#3E5519] bg-[#F4F7EE] px-2.5 py-1 rounded-lg border border-[#D4E0C2]">
                        {q.questionId}
                      </span>
                      <span className="text-[11px] font-extrabold text-[#92400E] bg-[#FEF3C7] px-2.5 py-0.5 rounded-lg border border-[#FDE68A]">
                        {q.questionType}
                      </span>
                    </div>
                    <span className="text-[14px] font-extrabold text-[#547322] font-mono">
                      +{q.marks} {q.marks === 1 ? "Mark" : "Marks"}
                    </span>
                  </div>

                  <h3 className="text-[15px] font-extrabold text-slate-900 line-clamp-2 leading-snug">{q.questionText}</h3>
                  <div className="text-[13px] text-slate-500 flex items-center gap-2 font-semibold">
                    <span className="text-[#547322] font-bold">{q.subjectName}</span>
                    {q.chapter && (
                      <>
                        <span>•</span>
                        <span>{q.chapter}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D4E0C2] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPreviewQuestion(q)}
                    className="text-[13px] font-extrabold text-[#547322] hover:text-[#3E5519] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#547322]" /> Interactive Preview
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(q)}
                      className="h-[36px] px-3 bg-[#F4F7EE] hover:bg-[#EBF1E4] text-slate-700 hover:text-slate-950 rounded-xl border border-[#D4E0C2] text-[12px] font-extrabold flex items-center gap-1 cursor-pointer"
                      title="Duplicate into Bank"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Duplicate</span>
                    </button>
                    <Link
                      href={`/admin/questions/${q.id}`}
                      className="h-[36px] px-4 bg-[#547322] hover:bg-[#435C1B] text-white rounded-xl text-[12px] font-extrabold flex items-center justify-center transition-colors shadow-xs"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Interactive Preview Modal */}
        {previewQuestion && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border-2 border-[#D4E0C2] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4E0C2]">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Question Preview: {previewQuestion.questionId}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">
                    {previewQuestion.subjectName} • {previewQuestion.questionType}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewQuestion(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-[#F4F7EE] rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 bg-[#FAF7ED] rounded-xl border-2 border-[#FDE68A]">
                <QuestionRenderer
                  question={previewQuestion}
                  value={null}
                  onChange={() => {}}
                  readOnly={false}
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewQuestion(null)}
                  className="h-[40px] px-5 bg-[#547322] hover:bg-[#435C1B] text-white text-[13px] font-extrabold rounded-xl cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
