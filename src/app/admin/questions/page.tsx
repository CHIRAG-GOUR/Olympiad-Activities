"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { questionRepository } from "@/repositories";
import { Question, QuestionType } from "@/types/question";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  BookOpen,
  Layers,
  HelpCircle,
  Filter,
  Eye,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react";

export default function QuestionRepositoryPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await questionRepository.listQuestions();
        setQuestions(data);
      } catch (err) {
        console.error("Failed to load questions:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      await questionRepository.deleteQuestion(id);
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.questionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.chapter && q.chapter.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === "all" || q.questionType === selectedType;
    const matchesSubject = selectedSubject === "all" || q.subjectId === selectedSubject;
    const matchesDiff = selectedDifficulty === "all" || q.difficulty === selectedDifficulty;
    const matchesClass = selectedClass === "all" || String(q.grade || 6) === selectedClass;

    return matchesSearch && matchesType && matchesSubject && matchesDiff && matchesClass;
  });

  const getInteractionBadge = (type: QuestionType) => {
    switch (type) {
      case "ORDERING":
        return { label: "Ordering", bg: "bg-[#EAF2FC] text-[#1C5190] border-[#E1E7EF]" };
      case "DRAG_DROP":
        return { label: "Drag & Drop", bg: "bg-[#EAF2FC] text-[#1C5190] border-[#E1E7EF]" };
      case "NUMERIC":
        return { label: "Numeric", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" };
      case "MATCHING":
        return { label: "Matching", bg: "bg-amber-50 text-amber-800 border-amber-200" };
      case "CLASSIFICATION":
        return { label: "Classification", bg: "bg-teal-50 text-teal-800 border-teal-200" };
      case "HOTSPOT":
        return { label: "Hotspot", bg: "bg-sky-50 text-sky-800 border-sky-200" };
      case "SEQUENCE":
        return { label: "Sequence", bg: "bg-indigo-50 text-indigo-800 border-indigo-200" };
      case "GRAPH":
        return { label: "Graph", bg: "bg-blue-50 text-blue-800 border-blue-200" };
      case "SIMULATION":
        return { label: "Simulation", bg: "bg-[#EAF2FC] text-[#2468B2] border-[#E1E7EF]" };
      default:
        return { label: type, bg: "bg-[#F4F7FB] text-[#182338] border-[#E1E7EF]" };
    }
  };

  return (
    <div className="space-y-6 animate-rise-in font-sans text-[#182338]">
      {/* 1. Header (Requirement 25) */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/80 shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_2px_10px_-4px_rgba(38,45,90,0.10)] rounded-2xl px-6 sm:px-7 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#2468B2]">
            <span>Examination Item Bank</span>
            <span className="text-[#667085]">•</span>
            <span>Question Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#182338] mt-1">
            Question Repository
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            Manage, author, test, and calibrate interactive Olympiad examination questions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/imports"
            className="h-9 px-3.5 bg-white/70 backdrop-blur-sm border border-white/90 hover:bg-white/95 text-[#1C5190] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-subtle transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Import Questions</span>
          </Link>
          <Link
            href="/admin/questions/new"
            className="h-9 px-4 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-subtle transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* 2. Compact Search & Filter Toolbar */}
        <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-4 shadow-subtle flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions by code, concept, topic, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] font-semibold focus:outline-none focus:border-[#2468B2] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="h-9 px-3 text-xs font-bold bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] focus:outline-none focus:border-[#2468B2] cursor-pointer"
            >
              <option value="all">All Subjects</option>
              <option value="sub_math">Mathematics</option>
              <option value="sub_science">Science</option>
              <option value="sub_reasoning">Logical Reasoning</option>
            </select>

            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-9 px-3 text-xs font-bold bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] focus:outline-none focus:border-[#2468B2] cursor-pointer"
            >
              <option value="all">All Classes</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
            </select>

            {/* Interaction Mechanism Filter (Requirement 26) */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-9 px-3 text-xs font-bold bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] focus:outline-none focus:border-[#2468B2] cursor-pointer"
            >
              <option value="all">All Interactions</option>
              <option value="ORDERING">Ordering</option>
              <option value="DRAG_DROP">Drag & Drop</option>
              <option value="NUMERIC">Numeric</option>
              <option value="MATCHING">Matching</option>
              <option value="CLASSIFICATION">Classification</option>
              <option value="HOTSPOT">Hotspot</option>
              <option value="SEQUENCE">Sequence</option>
              <option value="GRAPH">Graph</option>
              <option value="SIMULATION">Simulation</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="h-9 px-3 text-xs font-bold bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] focus:outline-none focus:border-[#2468B2] cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
              <option value="ACHIEVER">Achiever Section</option>
            </select>
          </div>

          <div className="text-xs text-[#667085] font-semibold text-right">
            Showing <strong className="text-[#2468B2] font-bold">{filteredQuestions.length}</strong> questions
          </div>
        </div>

        {/* 3. Question Repository Table (Requirement 25) */}
        <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl shadow-subtle overflow-hidden">
          {filteredQuestions.length === 0 ? (
            /* Empty state (Requirement 36) */
            <div className="py-16 px-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF2FC] text-[#2468B2] flex items-center justify-center mx-auto border border-[#E1E7EF]">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#182338]">Question Repository is Empty</h3>
                <p className="text-xs text-[#667085] max-w-md mx-auto">
                  Import or author questions to build your standardized Olympiad examination repository.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  href="/admin/questions/new"
                  className="h-9 px-4 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl text-xs font-bold shadow-subtle inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </Link>
                <Link
                  href="/admin/imports"
                  className="h-9 px-4 bg-[#EAF2FC] hover:bg-[#E1E7EF] text-[#1C5190] rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Import Questions</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead className="bg-[#F4F7FB] text-[#667085] border-b border-[#E1E7EF] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4 w-[110px]">Code</th>
                    <th className="p-4 min-w-[300px]">Question & Concept</th>
                    <th className="p-4 w-[140px]">Subject</th>
                    <th className="p-4 w-[160px]">Topic</th>
                    <th className="p-4 w-[140px]">Interaction</th>
                    <th className="p-4 w-[100px] text-center">Difficulty</th>
                    <th className="p-4 w-[80px] text-center">Marks</th>
                    <th className="p-4 w-[100px] text-center">Status</th>
                    <th className="p-4 w-[120px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E7EF] text-[#182338]">
                  {filteredQuestions.map((q) => {
                    const badge = getInteractionBadge(q.questionType);
                    return (
                      <tr key={q.id} className="hover:bg-white/70 transition-colors">
                        {/* Code */}
                        <td className="p-4 align-top">
                          <span className="font-mono font-bold text-[11px] text-[#2468B2] bg-[#EAF2FC] px-2 py-0.5 rounded-md border border-[#E1E7EF] block text-center">
                            {q.questionId}
                          </span>
                        </td>

                        {/* Question Text */}
                        <td className="p-4 align-top">
                          <div className="font-bold text-xs text-[#182338] leading-snug line-clamp-2">
                            {q.questionText}
                          </div>
                          {q.section && (
                            <div className="text-[10px] text-[#667085] mt-1 font-semibold">
                              Section: {q.section}
                            </div>
                          )}
                        </td>

                        {/* Subject */}
                        <td className="p-4 align-top">
                          <div className="font-bold text-[#182338]">{q.subjectName || "Mathematics"}</div>
                          <div className="text-[10px] text-[#667085]">Class {q.grade || 6}</div>
                        </td>

                        {/* Topic */}
                        <td className="p-4 align-top">
                          <span className="font-semibold text-[#182338] block truncate max-w-[150px]">
                            {q.topic}
                          </span>
                          {q.chapter && (
                            <span className="text-[10px] text-[#667085] block truncate max-w-[150px]">
                              {q.chapter}
                            </span>
                          )}
                        </td>

                        {/* Interaction Type Badge */}
                        <td className="p-4 align-top">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </td>

                        {/* Difficulty */}
                        <td className="p-4 align-top text-center">
                          <span className="px-2 py-0.5 bg-[#F4F7FB] text-[#667085] border border-[#E1E7EF] rounded-md text-[10px] font-bold uppercase">
                            {q.difficulty}
                          </span>
                        </td>

                        {/* Marks */}
                        <td className="p-4 align-top text-center font-mono font-bold text-[#2468B2]">
                          +{q.marks || 1}
                        </td>

                        {/* Status */}
                        <td className="p-4 align-top text-center">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1C5190]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2468B2]" />
                            {q.status || "Published"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 align-top text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/admin/questions/${q.id}`}
                              className="px-2.5 py-1 bg-[#EAF2FC] hover:bg-[#E1E7EF] text-[#1C5190] rounded-md text-[11px] font-bold transition-all"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(q.id)}
                              className="p-1 text-[#667085] hover:text-rose-600 rounded-md hover:bg-rose-50 transition-all cursor-pointer"
                              title="Delete Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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
    </div>
  );
}
