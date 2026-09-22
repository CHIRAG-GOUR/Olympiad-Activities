"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { questionRepository, examRepository } from "@/repositories";
import { Question } from "@/types/question";
import { Exam } from "@/types/exam";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Save,
  Clock,
  Award,
  Shield,
  FileText,
  Search,
  Plus,
  Trash2,
  Database,
  Layers,
} from "lucide-react";

export default function NewExamPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [qSearch, setQSearch] = useState("");
  const [qSubjectFilter, setQSubjectFilter] = useState("all");

  const [formData, setFormData] = useState<Partial<Exam>>({
    id: `exam_${Date.now()}`,
    code: "IMO-2025-G6-A",
    title: "SOF International Mathematics Olympiad (IMO)",
    subtitle: "Class 6 • Standard Examination Paper",
    description: "Official digital examination covering Logical Reasoning, Mathematical Reasoning, Everyday Math, and Achievers Section.",
    subjectId: "sub_math",
    subjectName: "Mathematics",
    grade: 6,
    academicYear: "2024 - 2025",
    durationMinutes: 45,
    totalMarks: 60,
    passingMarks: 24,
    totalQuestions: 50,
    questionIds: [],
    rules: {
      allowBacktrack: true,
      shuffleQuestions: false,
      showTimer: true,
      autoSubmitOnTimeUp: true,
      passPercentage: 40,
      negativeMarkingEnabled: false,
      instructions: [
        "Read all interactive instructions carefully before manipulating diagrams.",
        "Answers are automatically recorded when navigating to the next question.",
        "Submit the examination when all questions have been reviewed.",
      ],
    },
    status: "Published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    async function load() {
      try {
        const qList = await questionRepository.listQuestions();
        setQuestions(qList);
        // Pre-select all available question IDs by default
        if (qList.length > 0 && formData.questionIds?.length === 0) {
          const ids = qList.map((q) => q.id);
          const totalM = qList.reduce((acc, q) => acc + (q.marks || 1), 0);
          setFormData((prev) => ({
            ...prev,
            questionIds: ids,
            totalQuestions: ids.length,
            totalMarks: totalM,
          }));
        }
      } catch (err) {
        console.error("Failed to load questions for exam builder:", err);
      }
    }
    load();
  }, []);

  const toggleQuestionSelection = (qId: string) => {
    const current = formData.questionIds || [];
    let updated: string[];
    if (current.includes(qId)) {
      updated = current.filter((id) => id !== qId);
    } else {
      updated = [...current, qId];
    }
    const selectedObj = questions.filter((q) => updated.includes(q.id));
    const newTotalMarks = selectedObj.reduce((acc, q) => acc + (q.marks || 1), 0);

    setFormData({
      ...formData,
      questionIds: updated,
      totalQuestions: updated.length,
      totalMarks: newTotalMarks,
    });
  };

  const selectAllQuestions = () => {
    const allIds = questions.map((q) => q.id);
    const totalM = questions.reduce((acc, q) => acc + (q.marks || 1), 0);
    setFormData({
      ...formData,
      questionIds: allIds,
      totalQuestions: allIds.length,
      totalMarks: totalM,
    });
  };

  const deselectAllQuestions = () => {
    setFormData({
      ...formData,
      questionIds: [],
      totalQuestions: 0,
      totalMarks: 0,
    });
  };

  const handleSaveExam = async () => {
    if (!formData.title || !formData.code || (formData.questionIds?.length || 0) === 0) {
      alert("Please enter title, exam code, and select at least one question.");
      return;
    }
    try {
      await examRepository.saveExam(formData as Exam);
      router.push("/admin/exams");
    } catch (err) {
      console.error("Failed to save exam:", err);
      alert("Failed to save examination.");
    }
  };

  const steps = [
    { num: 1, title: "Basic Details", icon: FileText },
    { num: 2, title: "Question Bank", icon: Database },
    { num: 3, title: "Timing & Scoring", icon: Clock },
    { num: 4, title: "Rules & Security", icon: Shield },
    { num: 5, title: "Review & Publish", icon: CheckCircle2 },
  ];

  const filteredQList = questions.filter((q) => {
    const matchesSearch =
      q.questionText.toLowerCase().includes(qSearch.toLowerCase()) ||
      q.questionId.toLowerCase().includes(qSearch.toLowerCase()) ||
      q.topic.toLowerCase().includes(qSearch.toLowerCase());
    const matchesSub = qSubjectFilter === "all" || q.subjectId === qSubjectFilter;
    return matchesSearch && matchesSub;
  });

  return (
    <div className="flex-1 flex flex-col font-sans select-none text-[#172033]">
      {/* 1. Header (Requirement 28) */}
      <div className="px-6 sm:px-8 py-6 border-b border-[#DDE4D7] bg-[#F6F9F1]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#4D741F]">
            <span>Authoring Wizard</span>
            <span className="text-[#667085]">•</span>
            <span>Examination Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172033] mt-1">
            Create Examination
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            Compile questions from the Question Bank into a standardized Olympiad examination paper.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/exams"
            className="h-9 px-3.5 bg-white border border-[#DDE4D7] hover:bg-[#EEF5E7] text-[#355415] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </Link>
          <button
            type="button"
            onClick={handleSaveExam}
            className="h-9 px-4 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Publish Examination</span>
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6 flex-1 max-w-[1300px]">
        
        {/* Step Navigation Tabs */}
        <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-2 shadow-xs flex items-center justify-between overflow-x-auto gap-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#4D741F] text-white shadow-xs"
                    : isCompleted
                    ? "bg-[#EEF5E7] text-[#355415]"
                    : "text-[#667085] hover:bg-[#F6F9F1]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* STEP 1: Basic Information */}
        {currentStep === 1 && (
          <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="text-base font-extrabold text-[#172033] border-b border-[#DDE4D7] pb-3">
              Step 1: Examination Identification & Metadata
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-[#172033] mb-1.5 block">
                  Examination Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. SOF International Mathematics Olympiad"
                  className="w-full h-10 px-3.5 text-xs bg-[#F6F9F1]/60 border border-[#DDE4D7] rounded-xl text-[#172033] font-semibold focus:outline-none focus:border-[#4D741F] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#172033] mb-1.5 block">
                  Examination Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. IMO-2025-G6-SETB"
                  className="w-full h-10 px-3.5 text-xs font-mono font-bold bg-[#F6F9F1]/60 border border-[#DDE4D7] rounded-xl text-[#4D741F] focus:outline-none focus:border-[#4D741F] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#172033] mb-1.5 block">
                  Subject Name
                </label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => {
                    const subjMap: Record<string, string> = {
                      sub_math: "Mathematics",
                      sub_science: "Science",
                      sub_reasoning: "Logical Reasoning",
                    };
                    setFormData({
                      ...formData,
                      subjectId: e.target.value,
                      subjectName: subjMap[e.target.value] || "Mathematics",
                    });
                  }}
                  className="w-full h-10 px-3.5 text-xs font-bold bg-[#F6F9F1]/60 border border-[#DDE4D7] rounded-xl text-[#172033] focus:outline-none focus:border-[#4D741F] cursor-pointer"
                >
                  <option value="sub_math">Mathematics</option>
                  <option value="sub_science">Science</option>
                  <option value="sub_reasoning">Logical Reasoning</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#172033] mb-1.5 block">
                  Target Class / Grade
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) || 6 })}
                  className="w-full h-10 px-3.5 text-xs font-bold bg-[#F6F9F1]/60 border border-[#DDE4D7] rounded-xl text-[#172033] focus:outline-none focus:border-[#4D741F] cursor-pointer"
                >
                  <option value={6}>Class 6</option>
                  <option value={7}>Class 7</option>
                  <option value={8}>Class 8</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-[#172033] mb-1.5 block">
                  Description & Candidate Instructions
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide syllabus context, examination rules, and guidelines for students..."
                  className="w-full p-3 text-xs bg-[#F6F9F1]/60 border border-[#DDE4D7] rounded-xl text-[#172033] font-medium focus:outline-none focus:border-[#4D741F] focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#DDE4D7] flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="h-9 px-5 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Continue to Question Bank</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Question Bank Compilation (Requirement 28) */}
        {currentStep === 2 && (
          <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#DDE4D7] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#172033]">
                  Step 2: Select Questions from Question Bank
                </h3>
                <p className="text-xs text-[#667085] font-medium mt-0.5">
                  Choose questions to include in this examination paper.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllQuestions}
                  className="h-8 px-3 bg-[#EEF5E7] hover:bg-[#DDE4D7] text-[#355415] rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Select All ({questions.length})
                </button>
                <button
                  type="button"
                  onClick={deselectAllQuestions}
                  className="h-8 px-3 bg-white border border-[#DDE4D7] hover:bg-[#F6F9F1] text-[#667085] rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Deselect All
                </button>
              </div>
            </div>

            {/* Selected Summary Pill */}
            <div className="p-3 bg-[#EEF5E7] border border-[#DDE4D7] rounded-xl flex items-center justify-between text-xs font-bold text-[#355415]">
              <span>
                Selected: <strong className="text-[#172033] font-black">{formData.questionIds?.length || 0}</strong> Questions
              </span>
              <span>
                Total Examination Marks: <strong className="text-[#172033] font-black">{formData.totalMarks}</strong>
              </span>
            </div>

            {/* Search Filter for questions */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter questions by concept, topic, or code..."
                value={qSearch}
                onChange={(e) => setQSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-xs bg-[#F6F9F1]/60 border border-[#DDE4D7] rounded-xl text-[#172033] font-semibold focus:outline-none focus:border-[#4D741F] focus:bg-white"
              />
            </div>

            {/* Questions Checklist */}
            <div className="border border-[#DDE4D7] rounded-xl divide-y divide-[#DDE4D7] max-h-[450px] overflow-y-auto">
              {filteredQList.map((q) => {
                const isSelected = formData.questionIds?.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => toggleQuestionSelection(q.id)}
                    className={`p-3.5 flex items-start gap-3.5 cursor-pointer transition-all ${
                      isSelected ? "bg-[#EEF5E7]/50" : "hover:bg-[#F6F9F1]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-0.5 w-4 h-4 text-[#4D741F] rounded border-[#DDE4D7] focus:ring-0 cursor-pointer"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-[#4D741F]">
                            {q.questionId}
                          </span>
                          <span className="px-2 py-0.2 rounded text-[10px] font-extrabold uppercase bg-[#F6F9F1] text-[#355415] border border-[#DDE4D7]">
                            {q.questionType}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#4D741F]">
                          +{q.marks || 1} Mark
                        </span>
                      </div>

                      <div className="text-xs font-bold text-[#172033] line-clamp-2">
                        {q.questionText}
                      </div>

                      <div className="text-[11px] text-[#667085] font-semibold">
                        Topic: <span className="text-[#355415]">{q.topic}</span>
                        {q.section && <span> • Section: {q.section}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#DDE4D7] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="h-9 px-4 bg-white border border-[#DDE4D7] hover:bg-[#EEF5E7] text-[#355415] rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="h-9 px-5 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Continue to Timing & Scoring</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Timing & Scoring */}
        {currentStep === 3 && (
          <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="text-base font-extrabold text-[#172033] border-b border-[#DDE4D7] pb-3">
              Step 3: Timing & Pass Criteria
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-[#172033] mb-1.5 block">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 45 })}
                  className="w-full h-10 px-3.5 text-xs font-mono font-bold bg-[#F6F9F1]/60 border border-[#DDE4D7] rounded-xl text-[#172033] focus:outline-none focus:border-[#4D741F] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#172033] mb-1.5 block">
                  Passing Percentage (%)
                </label>
                <input
                  type="number"
                  value={formData.rules?.passPercentage || 40}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rules: { ...formData.rules!, passPercentage: parseInt(e.target.value) || 40 },
                    })
                  }
                  className="w-full h-10 px-3.5 text-xs font-mono font-bold bg-[#F6F9F1]/60 border border-[#DDE4D7] rounded-xl text-[#172033] focus:outline-none focus:border-[#4D741F] focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#DDE4D7] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="h-9 px-4 bg-white border border-[#DDE4D7] hover:bg-[#EEF5E7] text-[#355415] rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="h-9 px-5 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Continue to Rules & Security</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Rules & Security */}
        {currentStep === 4 && (
          <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="text-base font-extrabold text-[#172033] border-b border-[#DDE4D7] pb-3">
              Step 4: Examination Security & Rules
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F9F1] border border-[#DDE4D7] cursor-pointer text-xs font-bold text-[#172033]">
                <input
                  type="checkbox"
                  checked={formData.rules?.allowBacktrack}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rules: { ...formData.rules!, allowBacktrack: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-[#4D741F] rounded border-[#DDE4D7] focus:ring-0 cursor-pointer"
                />
                <span>Allow Free Question Palette Navigation & Backtracking</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F9F1] border border-[#DDE4D7] cursor-pointer text-xs font-bold text-[#172033]">
                <input
                  type="checkbox"
                  checked={formData.rules?.autoSubmitOnTimeUp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rules: { ...formData.rules!, autoSubmitOnTimeUp: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-[#4D741F] rounded border-[#DDE4D7] focus:ring-0 cursor-pointer"
                />
                <span>Enforce Automatic Submission When Countdown Reaches 00:00</span>
              </label>
            </div>

            <div className="pt-3 border-t border-[#DDE4D7] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="h-9 px-4 bg-white border border-[#DDE4D7] hover:bg-[#EEF5E7] text-[#355415] rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="h-9 px-5 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Continue to Final Review</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Publish */}
        {currentStep === 5 && (
          <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="text-base font-extrabold text-[#172033] border-b border-[#DDE4D7] pb-3">
              Step 5: Review & Publish Examination Paper
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F6F9F1] border border-[#DDE4D7] rounded-xl text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#667085] block">Title</span>
                <strong className="text-xs font-extrabold text-[#172033]">{formData.title}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#667085] block">Code</span>
                <strong className="text-xs font-mono font-bold text-[#4D741F]">{formData.code}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#667085] block">Questions</span>
                <strong className="text-xs font-mono font-bold text-[#172033]">{formData.questionIds?.length} Items</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#667085] block">Total Marks</span>
                <strong className="text-xs font-mono font-bold text-[#4D741F]">{formData.totalMarks} Marks</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DDE4D7] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="h-9 px-4 bg-white border border-[#DDE4D7] hover:bg-[#EEF5E7] text-[#355415] rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSaveExam}
                className="h-10 px-6 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Confirm & Publish Examination</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
