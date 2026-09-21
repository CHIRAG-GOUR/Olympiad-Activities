"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OlympiadStore } from "@/services/firebase/firestore";
import { Question, QuestionType } from "@/types/question";
import { Plus, Search, Eye, Edit3, Trash2, BookOpen, Layers } from "lucide-react";

export default function QuestionsListPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await OlympiadStore.getQuestions();
      setQuestions(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this question?")) {
      await OlympiadStore.deleteQuestion(id);
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.questionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || q.questionType === selectedType;
    const matchesSubject = selectedSubject === "all" || q.subjectId === selectedSubject;
    const matchesDiff = selectedDifficulty === "all" || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesType && matchesSubject && matchesDiff;
  });

  const getTypeBadgeStyle = (type: QuestionType) => {
    switch (type) {
      case "ORDERING":
      case "MATCHING":
      case "GRAPH":
        return "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]";
      case "SIMULATION":
      case "DRAG_DROP":
        return "bg-[#F4F7EE] text-[#3E5519] border-[#D4E0C2]";
      case "CLASSIFICATION":
      case "HOTSPOT":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "NUMERIC":
      case "SEQUENCE":
        return "bg-purple-50 text-purple-800 border-purple-200";
      default:
        return "bg-[#F4F7EE] text-slate-800 border-[#D4E0C2]";
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-[#F4F7EE]">
      <AdminHeader
        title="Interactive Question Repository"
        subtitle="Manage, author, test and calibrate interactive Olympiad questions"
        actionButton={{
          label: "+ New Question",
          href: "/admin/questions/new",
        }}
      />

      <div className="p-6 lg:p-8 space-y-6 w-full max-w-[1750px]">
        {/* Large Filter & Search Bar */}
        <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-5 shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search question text, code, chapter, or topic keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[46px] pl-11 pr-4 text-[14px] bg-[#F4F7EE] border border-[#D4E0C2] rounded-xl focus:bg-white focus:outline-none focus:border-[#547322] focus:ring-2 focus:ring-[#D4E0C2] transition-all text-slate-900 font-bold placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-[46px] px-4 text-[14px] font-bold bg-[#F4F7EE] border border-[#D4E0C2] rounded-xl text-[#3E5519] focus:bg-white focus:outline-none focus:border-[#547322] cursor-pointer"
            >
              <option value="all">All Interaction Types</option>
              <option value="ORDERING">ORDERING (Sequence)</option>
              <option value="DRAG_DROP">DRAG & DROP (Zones)</option>
              <option value="NUMERIC">NUMERIC (Keypad)</option>
              <option value="MATCHING">MATCHING (Pairing)</option>
              <option value="CLASSIFICATION">CLASSIFICATION (Buckets)</option>
              <option value="HOTSPOT">HOTSPOT (Diagrams)</option>
              <option value="SEQUENCE">SEQUENCE (Patterns)</option>
              <option value="GRAPH">GRAPH (Coordinates)</option>
              <option value="SIMULATION">SIMULATION (Lab)</option>
            </select>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="h-[46px] px-4 text-[14px] font-bold bg-[#F4F7EE] border border-[#D4E0C2] rounded-xl text-[#3E5519] focus:bg-white focus:outline-none focus:border-[#547322] cursor-pointer"
            >
              <option value="all">All Subjects</option>
              <option value="sub_math">Mathematics</option>
              <option value="sub_science">Science</option>
              <option value="sub_reasoning">Logical Reasoning</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="h-[46px] px-4 text-[14px] font-bold bg-[#F4F7EE] border border-[#D4E0C2] rounded-xl text-[#3E5519] focus:bg-white focus:outline-none focus:border-[#547322] cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
              <option value="ACHIEVER">ACHIEVER SECTION</option>
            </select>
          </div>
        </div>

        {/* Substantial Question Repository Table */}
        <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-[#F4F7EE] border-b-2 border-[#D4E0C2] flex items-center justify-between">
            <span className="text-[13px] font-black text-[#3E5519] uppercase tracking-wider">
              Questions Ledger ({filteredQuestions.length} Items)
            </span>
            <span className="text-[12px] text-slate-500 font-mono font-bold">
              Displaying all verified Olympiad question versions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px] border-collapse">
              <thead>
                <tr className="bg-[#F4F7EE] border-b border-[#D4E0C2] text-slate-600 font-extrabold text-[12px] uppercase tracking-wider">
                  <th className="py-4 px-6 w-[120px]">Code</th>
                  <th className="py-4 px-6 min-w-[340px]">Question & Concept</th>
                  <th className="py-4 px-6 w-[160px]">Interaction</th>
                  <th className="py-4 px-6 w-[220px]">Subject / Chapter</th>
                  <th className="py-4 px-6 w-[140px]">Difficulty</th>
                  <th className="py-4 px-6 w-[100px]">Marks</th>
                  <th className="py-4 px-6 w-[120px]">Status</th>
                  <th className="py-4 px-6 w-[180px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4E0C2]">
                {filteredQuestions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-500">
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="w-12 h-12 bg-[#F4F7EE] text-[#547322] rounded-xl flex items-center justify-center mx-auto border border-[#D4E0C2]">
                          <Layers className="w-6 h-6" />
                        </div>
                        <div className="text-[16px] font-extrabold text-slate-900">
                          {questions.length === 0 ? "Question Repository is Empty" : "No Matching Questions Found"}
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium">
                          {questions.length === 0
                            ? "Author your first interactive Olympiad question or bulk upload questions via Excel/CSV spreadsheet."
                            : "Try adjusting your search keywords or clearing interaction type and difficulty filters."}
                        </p>
                        {questions.length === 0 && (
                          <div className="pt-2 flex items-center justify-center gap-3">
                            <Link
                              href="/admin/questions/new"
                              className="h-[40px] px-4 bg-[#547322] hover:bg-[#435C1B] text-white rounded-xl text-[13px] font-extrabold inline-flex items-center gap-1.5 shadow-xs"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Author New Question</span>
                            </Link>
                            <Link
                              href="/admin/imports"
                              className="h-[40px] px-4 bg-[#F4F7EE] border border-[#D4E0C2] hover:bg-[#EBF1E4] text-[#3E5519] rounded-xl text-[13px] font-bold inline-flex items-center gap-1.5"
                            >
                              <span>Import Questions</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredQuestions.map((q) => (
                    <tr key={q.id} className="hover:bg-[#F4F7EE]/60 transition-colors min-h-[80px]">
                      {/* Code */}
                      <td className="py-4 px-6 align-top">
                        <span className="font-mono font-extrabold text-[13px] text-[#3E5519] bg-[#F4F7EE] px-2.5 py-1 rounded-lg border border-[#D4E0C2] block text-center">
                          {q.questionId}
                        </span>
                      </td>

                      {/* Question Text */}
                      <td className="py-4 px-6 align-top">
                        <div className="font-extrabold text-[15px] text-slate-900 leading-snug line-clamp-2">
                          {q.questionText}
                        </div>
                        <div className="text-[13px] text-slate-500 mt-1 font-semibold flex items-center gap-2">
                          <span className="text-[#547322] font-bold">{q.topic}</span>
                          {q.section && (
                            <>
                              <span>•</span>
                              <span>{q.section}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Interaction Badge */}
                      <td className="py-4 px-6 align-top">
                        <span
                          className={`px-3 py-1 rounded-lg text-[12px] font-extrabold uppercase border-2 inline-block tracking-wide ${getTypeBadgeStyle(
                            q.questionType
                          )}`}
                        >
                          {q.questionType}
                        </span>
                      </td>

                      {/* Subject & Chapter */}
                      <td className="py-4 px-6 align-top">
                        <div className="font-extrabold text-[14px] text-slate-900">{q.subjectName}</div>
                        <div className="text-[12px] text-slate-500 mt-0.5 font-medium">{q.chapter}</div>
                      </td>

                      {/* Difficulty */}
                      <td className="py-4 px-6 align-top">
                        <span className="px-2.5 py-1 bg-[#F4F7EE] text-slate-800 border border-[#D4E0C2] rounded-lg text-[12px] font-bold">
                          {q.difficulty}
                        </span>
                      </td>

                      {/* Marks */}
                      <td className="py-4 px-6 align-top">
                        <span className="font-mono font-extrabold text-[15px] text-[#547322]">
                          +{q.marks}
                        </span>
                        {q.negativeMarks > 0 && (
                          <span className="block text-[11px] font-mono text-[#C62828] font-bold">
                            -{q.negativeMarks} Neg.
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 align-top">
                        <span className="inline-flex items-center gap-1.5 text-[#547322] font-extrabold text-[13px]">
                          <span className="w-2 h-2 rounded-full bg-[#547322]" />
                          {q.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 align-top text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/questions/${q.id}`}
                            className="h-[36px] px-3 bg-[#F4F7EE] hover:bg-[#EBF1E4] text-[#3E5519] border border-[#D4E0C2] hover:border-[#547322] rounded-xl text-[13px] font-extrabold flex items-center gap-1.5 transition-all shadow-xs"
                            title="Edit & Interactive Preview"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#547322]" />
                            <span>Edit</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(q.id)}
                            className="h-[36px] w-[36px] flex items-center justify-center bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-[#D4E0C2] rounded-xl transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
