"use client";

import { useAuth } from "@/context/AuthContext";
import { ROLE_PREFIX } from "@/lib/auth/sections";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { questionRepository } from "@/repositories";
import { Question, QuestionType } from "@/types/question";
import {
  Database,
  Search,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  BookOpen,
  Plus,
  Layers,
  Award,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  Eye,
  ArrowRight,
} from "lucide-react";

interface TreeNode {
  id: string;
  name: string;
  count: number;
  children?: {
    [key: string]: {
      name: string;
      count: number;
      topics: {
        [key: string]: {
          name: string;
          count: number;
          questions: Question[];
        };
      };
    };
  };
}

export default function QuestionBankScreen() {
  // Links resolve into the route group the active role actually owns.
  const { activeRole } = useAuth();
  const roleBase = ROLE_PREFIX[activeRole];
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({
    Mathematics: true,
    Science: true,
    "Logical Reasoning": true,
  });
  const [openClasses, setOpenClasses] = useState<Record<string, boolean>>({
    "Mathematics-Class 6": true,
    "Science-Class 6": true,
    "Logical Reasoning-Class 6": true,
  });
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await questionRepository.listQuestions();
        setQuestions(list);
      } catch (err) {
        console.error("Failed to load question bank:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Build hierarchical Subject -> Class -> Topic tree
  const treeData = useMemo(() => {
    const map: Record<
      string,
      {
        name: string;
        count: number;
        classes: Record<
          string,
          {
            name: string;
            count: number;
            topics: Record<
              string,
              {
                name: string;
                count: number;
                questions: Question[];
              }
            >;
          }
        >;
      }
    > = {
      Mathematics: { name: "Mathematics", count: 0, classes: {} },
      Science: { name: "Science", count: 0, classes: {} },
      "Logical Reasoning": { name: "Logical Reasoning", count: 0, classes: {} },
    };

    questions.forEach((q) => {
      const subj = q.subjectName || (q.section?.includes("Reasoning") ? "Logical Reasoning" : "Mathematics");
      const grade = `Class ${q.grade || 6}`;
      const topic = q.topic || "General Concepts";

      if (!map[subj]) {
        map[subj] = { name: subj, count: 0, classes: {} };
      }
      map[subj].count++;

      if (!map[subj].classes[grade]) {
        map[subj].classes[grade] = { name: grade, count: 0, topics: {} };
      }
      map[subj].classes[grade].count++;

      if (!map[subj].classes[grade].topics[topic]) {
        map[subj].classes[grade].topics[topic] = { name: topic, count: 0, questions: [] };
      }
      map[subj].classes[grade].topics[topic].count++;
      map[subj].classes[grade].topics[topic].questions.push(q);
    });

    return map;
  }, [questions]);

  // Filtered Question list
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const subj = q.subjectName || (q.section?.includes("Reasoning") ? "Logical Reasoning" : "Mathematics");
      const grade = `Class ${q.grade || 6}`;
      const topic = q.topic || "";

      const matchesSearch =
        q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.questionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSubj = selectedSubject === "all" || subj === selectedSubject;
      const matchesClass = selectedClass === "all" || grade === selectedClass;
      const matchesTopic = selectedTopic === "all" || topic === selectedTopic;

      return matchesSearch && matchesSubj && matchesClass && matchesTopic;
    });
  }, [questions, searchTerm, selectedSubject, selectedClass, selectedTopic]);

  const toggleSubject = (subjName: string) => {
    setOpenSubjects((prev) => ({ ...prev, [subjName]: !prev[subjName] }));
  };

  const toggleClass = (classKey: string) => {
    setOpenClasses((prev) => ({ ...prev, [classKey]: !prev[classKey] }));
  };

  const handleDuplicate = async (q: Question) => {
    const copy: Question = {
      ...q,
      id: `q_${Date.now()}`,
      questionId: `${q.questionId}-COPY`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await questionRepository.saveQuestion(copy);
    setQuestions((prev) => [copy, ...prev]);
    setCopiedId(copy.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-rise-in font-sans text-[#182338]">
      {/* 1. Header (Requirement 27) */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/80 shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_2px_10px_-4px_rgba(38,45,90,0.10)] rounded-2xl px-6 sm:px-7 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#2468B2]">
            <span>Standardized Curriculum Library</span>
            <span className="text-[#667085]">•</span>
            <span>Question Bank</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#182338] mt-1">
            Question Bank
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            Curated taxonomy and hierarchical collection of interactive Olympiad questions used to compile examination papers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`${roleBase}/exams/new`}
            className="h-9 px-4 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-subtle transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Compile New Exam</span>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* 2. Top Search & Active Filter Strip */}
        <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full min-w-[260px]">
            <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search question bank by keyword, concept, or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] font-semibold focus:outline-none focus:border-[#2468B2] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            {(selectedSubject !== "all" || selectedClass !== "all" || selectedTopic !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSelectedSubject("all");
                  setSelectedClass("all");
                  setSelectedTopic("all");
                }}
                className="h-9 px-3 bg-[#EAF2FC] hover:bg-[#E1E7EF] text-[#1C5190] rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Reset Filter
              </button>
            )}
            <span className="text-xs font-bold text-[#667085] px-2">
              Showing <strong className="text-[#2468B2]">{filteredQuestions.length}</strong> questions
            </span>
          </div>
        </div>

        {/* 3. Main Tree / Grid Layout (Requirement 27) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Hierarchical Taxonomy Tree (4 cols) */}
          <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-5 shadow-subtle space-y-4">
            <div className="border-b border-[#E1E7EF] pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#2468B2]" />
                <h2 className="text-sm font-bold text-[#182338]">Curriculum Tree</h2>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#667085]">
                {questions.length} Total Questions
              </span>
            </div>

            <div className="space-y-2 text-xs font-semibold overflow-y-auto max-h-[600px] pr-1">
              {Object.entries(treeData).map(([subjName, subjObj]) => {
                const isSubjOpen = openSubjects[subjName] !== false;
                const isSubjSelected = selectedSubject === subjName && selectedTopic === "all";

                return (
                  <div key={subjName} className="space-y-1">
                    {/* Subject Row */}
                    <div
                      onClick={() => {
                        toggleSubject(subjName);
                        setSelectedSubject(selectedSubject === subjName ? "all" : subjName);
                        setSelectedTopic("all");
                      }}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                        isSubjSelected
                          ? "bg-[#EAF2FC] text-[#1C5190] font-bold border border-[#E1E7EF]"
                          : "hover:bg-white/70 text-[#182338]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSubjOpen ? (
                          <ChevronDown className="w-3.5 h-3.5 text-[#2468B2]" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-[#667085]" />
                        )}
                        <Folder className="w-4 h-4 text-[#2468B2]" />
                        <span>{subjName}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#F4F7FB] text-[10px] font-mono font-bold text-[#667085] border border-[#E1E7EF]">
                        {subjObj.count}
                      </span>
                    </div>

                    {/* Classes under Subject */}
                    {isSubjOpen && (
                      <div className="pl-6 space-y-1 border-l-2 border-[#E1E7EF] ml-3.5">
                        {Object.entries(subjObj.classes).map(([className, classObj]) => {
                          const classKey = `${subjName}-${className}`;
                          const isClassOpen = openClasses[classKey] !== false;
                          const isClassSelected =
                            selectedSubject === subjName &&
                            selectedClass === className &&
                            selectedTopic === "all";

                          return (
                            <div key={className} className="space-y-1">
                              {/* Class Row */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleClass(classKey);
                                  setSelectedSubject(subjName);
                                  setSelectedClass(className);
                                  setSelectedTopic("all");
                                }}
                                className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-all ${
                                  isClassSelected
                                    ? "bg-[#EAF2FC] text-[#1C5190] font-bold"
                                    : "hover:bg-white/70 text-[#182338]"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {isClassOpen ? (
                                    <ChevronDown className="w-3 h-3 text-[#2468B2]" />
                                  ) : (
                                    <ChevronRight className="w-3 h-3 text-[#667085]" />
                                  )}
                                  <BookOpen className="w-3.5 h-3.5 text-[#59B6DE]" />
                                  <span>{className}</span>
                                </div>
                                <span className="text-[10px] font-mono text-[#667085]">
                                  {classObj.count}
                                </span>
                              </div>

                              {/* Topics under Class */}
                              {isClassOpen && (
                                <div className="pl-5 space-y-0.5 border-l border-[#E1E7EF] ml-2.5">
                                  {Object.entries(classObj.topics).map(([topicName, topicObj]) => {
                                    const isTopicSelected =
                                      selectedSubject === subjName &&
                                      selectedClass === className &&
                                      selectedTopic === topicName;

                                    return (
                                      <div
                                        key={topicName}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedSubject(subjName);
                                          setSelectedClass(className);
                                          setSelectedTopic(topicName);
                                        }}
                                        className={`flex items-center justify-between py-1 px-2 rounded-md cursor-pointer text-[11px] transition-all ${
                                          isTopicSelected
                                            ? "bg-[#2468B2] text-white font-bold shadow-subtle"
                                            : "hover:bg-white/70 text-[#667085] hover:text-[#182338]"
                                        }`}
                                      >
                                        <span className="truncate pr-1">• {topicName}</span>
                                        <span className="font-mono text-[10px] shrink-0">
                                          {topicObj.count}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Question Cards Collection (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF2FC] text-[#2468B2] flex items-center justify-center mx-auto border border-[#E1E7EF]">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#182338]">No Questions in Selected Node</h3>
                <p className="text-xs text-[#667085] max-w-sm mx-auto">
                  Try selecting a different topic or resetting filters to explore the Olympiad question bank.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-5 shadow-subtle flex flex-col justify-between hover:border-[#2468B2] transition-all space-y-4"
                  >
                    <div className="space-y-2.5">
                      {/* Card Header: Code + Interaction Type */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[11px] text-[#2468B2] bg-[#EAF2FC] px-2 py-0.5 rounded-md border border-[#E1E7EF]">
                          {q.questionId}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#F4F7FB] text-[#1C5190] border border-[#E1E7EF]">
                          {q.questionType}
                        </span>
                      </div>

                      {/* Question Text */}
                      <h4 className="text-xs font-bold text-[#182338] leading-snug line-clamp-3">
                        {q.questionText}
                      </h4>

                      {/* Topic & Chapter metadata */}
                      <div className="text-[11px] text-[#667085] font-semibold space-y-0.5 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[#1C5190] font-bold">{q.topic}</span>
                          <span className="font-mono text-[10px] text-[#2468B2] font-bold">+{q.marks || 1} Mark</span>
                        </div>
                        {q.chapter && <div className="text-[10px] text-[#667085]">{q.chapter}</div>}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-[#E1E7EF] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleDuplicate(q)}
                        className="text-[11px] font-bold text-[#667085] hover:text-[#1C5190] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedId === q.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Duplicated!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Duplicate</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={`${roleBase}/questions/${q.id}`}
                        className="px-3 py-1.5 bg-[#EAF2FC] hover:bg-[#E1E7EF] text-[#1C5190] rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Interactive Test</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
