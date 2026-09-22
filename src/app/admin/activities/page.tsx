"use client";

import React, { useState } from "react";
import { IMO_CLASS6_SETB_QUESTIONS } from "@/data/sofImoClass6SetB";
import { getQuestionActivity, hasBespokeActivity } from "@/components/activities/ActivityRegistry";
import {
  Sparkles,
  Layers,
  Search,
  CheckCircle2,
  HelpCircle,
  Award,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Sliders,
  ChevronRight,
} from "lucide-react";

export default function ActivitiesStudioPage() {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [selectedSection, setSelectedSection] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activityValues, setActivityValues] = useState<{ [qId: string]: any }>({});

  const sections = [
    { id: "ALL", label: "All 50 Activities" },
    { id: "Logical Reasoning", label: "Logical Reasoning (Q1–Q15)" },
    { id: "Mathematical Reasoning", label: "Mathematical Reasoning (Q16–Q35)" },
    { id: "Everyday Mathematics", label: "Everyday Math (Q36–Q45)" },
    { id: "Achievers Section", label: "Achievers Section (Q46–Q50)" },
  ];

  const filteredQuestions = IMO_CLASS6_SETB_QUESTIONS.filter((q) => {
    const matchesSection =
      selectedSection === "ALL" || q.section === selectedSection;
    const matchesSearch =
      searchQuery.trim() === "" ||
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.questionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSection && matchesSearch;
  });

  const currentQuestion =
    filteredQuestions[selectedQuestionIndex] || IMO_CLASS6_SETB_QUESTIONS[0];

  const BespokeActivityComponent = getQuestionActivity(
    currentQuestion?.id || currentQuestion?.questionId
  );

  const currentValue = activityValues[currentQuestion?.id] || "";

  const handleValueChange = (newVal: any) => {
    setActivityValues((prev) => ({
      ...prev,
      [currentQuestion.id]: newVal,
    }));
  };

  const handleReset = () => {
    setActivityValues((prev) => {
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#547322] border border-[#435C1B] rounded-2xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFE066]">
            <Sparkles className="w-4 h-4" /> Olympiad Cognitive Engine • 50 Bespoke Activities
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            50 Bespoke Interactive Activities Studio
          </h1>
          <p className="text-sm text-white/80 max-w-2xl">
            Live interactive laboratory exploring all 50 SOF IMO Class 6 Set B question activities.
            Every problem features a unique physical, spatial, or algorithmic microworld.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/10 backdrop-blur-xs">
          <div className="text-center px-3 border-r border-white/20">
            <div className="text-2xl font-black text-[#FFE066]">50 / 50</div>
            <div className="text-[11px] font-semibold text-white/70">Activities Built</div>
          </div>
          <div className="text-center px-3">
            <div className="text-2xl font-black text-white">100%</div>
            <div className="text-[11px] font-semibold text-white/70">Working Mechanics</div>
          </div>
        </div>
      </div>

      {/* Section Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {sections.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => {
              setSelectedSection(sec.id);
              setSelectedQuestionIndex(0);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSection === sec.id
                ? "bg-[#547322] text-white shadow-md shadow-[#547322]/20"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Palette / Question Selector */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 space-y-4 max-h-[800px] flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#547322]" /> Activity Index
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {filteredQuestions.length} Items
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search topic or question..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedQuestionIndex(0);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#547322]"
            />
          </div>

          {/* Questions List */}
          <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
            {filteredQuestions.map((q, idx) => {
              const isSelected = q.id === currentQuestion?.id;
              const hasAnswered = !!activityValues[q.id];

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSelectedQuestionIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl text-xs transition-all border flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-[#547322]/10 border-[#547322] text-[#3E5519] font-bold shadow-xs"
                      : "bg-slate-50/50 border-slate-200/80 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold shrink-0 ${
                        isSelected
                          ? "bg-[#547322] text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="truncate font-semibold text-slate-900">{q.topic}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {q.questionId} • {q.difficulty}
                      </div>
                    </div>
                  </div>

                  {hasAnswered ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Lab Workbench */}
        <div className="lg:col-span-8 space-y-4">
          {currentQuestion && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Question Metadata Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-[#547322] text-white font-bold text-xs uppercase tracking-wider rounded-lg">
                    {currentQuestion.section}
                  </span>
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-mono font-bold text-xs rounded border border-slate-200">
                    #{currentQuestion.questionId}
                  </span>
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 font-bold text-xs rounded border border-amber-200">
                    {currentQuestion.difficulty}
                  </span>
                  <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 font-bold text-xs rounded border border-purple-200">
                    {currentQuestion.topic}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Activity
                  </button>
                </div>
              </div>

              {/* Question Prompt */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Official Problem Statement
                </div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                  {currentQuestion.questionText}
                </h2>
              </div>

              {/* Interactive Bespoke Activity Container */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <Sparkles className="w-4 h-4 text-emerald-600" /> Interactive Microworld
                  </span>
                  {currentValue && (
                    <span className="font-mono text-emerald-600">
                      Active State: {JSON.stringify(currentValue)}
                    </span>
                  )}
                </div>

                {BespokeActivityComponent ? (
                  <BespokeActivityComponent
                    questionId={currentQuestion.id || currentQuestion.questionId}
                    question={currentQuestion}
                    value={currentValue}
                    onChange={handleValueChange}
                  />
                ) : (
                  <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl text-slate-500">
                    Standard question format active for this item.
                  </div>
                )}
              </div>

              {/* Official Explanation & Answer Card */}
              {currentQuestion.explanation && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#547322]" /> Official Mathematical Derivation
                  </div>
                  <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
