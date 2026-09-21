"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OlympiadStore } from "@/services/firebase/firestore";
import { Question } from "@/types/question";
import { Exam, ExamRules } from "@/types/exam";
import { ArrowLeft, Check, CheckCircle2, ChevronRight, Save, Clock, Award, Shield, FileText } from "lucide-react";

export default function NewExamPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<Partial<Exam>>({
    id: `exam_${Date.now()}`,
    code: "",
    title: "",
    subtitle: "",
    description: "",
    subjectId: "sub_math",
    subjectName: "Mathematics",
    grade: 6,
    academicYear: "2025 - 2026",
    durationMinutes: 45,
    totalMarks: 0,
    passingMarks: 0,
    totalQuestions: 0,
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
      const qList = await OlympiadStore.getQuestions();
      setQuestions(qList);
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

  const handleSaveExam = async () => {
    if (!formData.title || !formData.code || (formData.questionIds?.length || 0) === 0) {
      alert("Please enter title, exam code, and select at least one question.");
      return;
    }
    await OlympiadStore.saveExam(formData as Exam);
    router.push("/admin/exams");
  };

  const steps = [
    { num: 1, title: "Basic Information", icon: FileText },
    { num: 2, title: "Exam Security & Rules", icon: Shield },
    { num: 3, title: "Question Compilation", icon: Award },
    { num: 4, title: "Timing & Scoring", icon: Clock },
    { num: 5, title: "Review & Publish", icon: CheckCircle2 },
  ];

  return (
    <div className="flex-1 flex flex-col w-full min-w-0">
      <AdminHeader
        title="Create Olympiad Examination"
        subtitle="Multi-section digital examination authoring and compilation wizard"
      />

      <div className="p-6 md:p-8 space-y-6 w-full max-w-[1600px]">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/exams"
            className="h-[40px] px-3.5 bg-white border border-olympiad-border rounded-md text-[13px] font-bold text-olympiad-textMuted hover:text-navy-900 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Examinations
          </Link>
          <button
            type="button"
            onClick={handleSaveExam}
            className="h-[42px] px-6 bg-olympiad-deep hover:bg-navy-900 text-white text-[14px] font-bold rounded-md shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" /> Publish Examination
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="bg-white border border-olympiad-border rounded-lg p-3 shadow-subtle flex items-center justify-between overflow-x-auto gap-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className={`flex items-center gap-2.5 h-[44px] px-4 rounded-md text-[13px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isCurrent
                    ? "bg-olympiad-primary text-white shadow-xs"
                    : isDone
                    ? "text-olympiad-green bg-green-50 border border-green-200"
                    : "text-olympiad-textMuted hover:text-navy-900 hover:bg-navy-50"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-mono font-bold ${
                    isCurrent
                      ? "bg-white text-olympiad-primary"
                      : isDone
                      ? "bg-olympiad-green text-white"
                      : "bg-navy-100 text-olympiad-textMuted"
                  }`}
                >
                  {isDone ? "✓" : s.num}
                </span>
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* STEP 1: Basic Info */}
        {currentStep === 1 && (
          <div className="bg-white border border-olympiad-border rounded-lg p-6 sm:p-8 shadow-subtle space-y-5">
            <h3 className="text-[17px] font-bold text-navy-900 border-b border-olympiad-border pb-3">
              Section 1: Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[13px] font-bold text-navy-900 mb-1.5 block">Exam Title</label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-[46px] text-[14px] px-4 bg-olympiad-bg border border-olympiad-border rounded-md text-navy-900 font-bold focus:bg-white focus:outline-none focus:border-olympiad-primary"
                />
              </div>

              <div>
                <label className="text-[13px] font-bold text-navy-900 mb-1.5 block">Exam Code</label>
                <input
                  type="text"
                  value={formData.code || ""}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full h-[46px] text-[14px] px-4 bg-olympiad-bg border border-olympiad-border rounded-md font-mono font-bold text-navy-900 focus:bg-white focus:outline-none focus:border-olympiad-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="text-[13px] font-bold text-navy-900 mb-1.5 block">Subject</label>
                <select
                  value={formData.subjectId || "sub_math"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subjectId: e.target.value,
                      subjectName: e.target.value === "sub_math" ? "Mathematics" : "Science",
                    })
                  }
                  className="w-full h-[46px] text-[14px] px-4 bg-olympiad-bg border border-olympiad-border rounded-md text-navy-900 font-semibold focus:bg-white"
                >
                  <option value="sub_math">Mathematics</option>
                  <option value="sub_science">Science</option>
                  <option value="sub_reasoning">Logical Reasoning</option>
                </select>
              </div>

              <div>
                <label className="text-[13px] font-bold text-navy-900 mb-1.5 block">Grade Level</label>
                <input
                  type="number"
                  value={formData.grade || 6}
                  onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) || 6 })}
                  className="w-full h-[46px] text-[14px] px-4 bg-olympiad-bg border border-olympiad-border rounded-md font-mono font-bold text-navy-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[13px] font-bold text-navy-900 mb-1.5 block">Academic Year</label>
                <input
                  type="text"
                  value={formData.academicYear || "2025 - 2026"}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full h-[46px] text-[14px] px-4 bg-olympiad-bg border border-olympiad-border rounded-md text-navy-900 font-mono font-bold focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[13px] font-bold text-navy-900 mb-1.5 block">Description</label>
              <textarea
                rows={3}
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-[14px] p-4 bg-olympiad-bg border border-olympiad-border rounded-md text-navy-900 focus:bg-white focus:outline-none focus:border-olympiad-primary"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Exam Rules */}
        {currentStep === 2 && (
          <div className="bg-white border border-olympiad-border rounded-lg p-6 sm:p-8 shadow-subtle space-y-5">
            <h3 className="text-[17px] font-bold text-navy-900 border-b border-olympiad-border pb-3">
              Section 2: Examination Security & Proctored Rules
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="flex items-center gap-3.5 p-4 bg-olympiad-bg rounded-md border border-olympiad-border cursor-pointer hover:bg-navy-50/50">
                <input
                  type="checkbox"
                  checked={formData.rules?.allowBacktrack}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rules: { ...formData.rules!, allowBacktrack: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-olympiad-primary cursor-pointer"
                />
                <div>
                  <span className="text-[14px] font-bold text-navy-900 block">Allow Free Backtracking</span>
                  <span className="text-[12px] text-olympiad-textMuted font-medium">
                    Candidates can jump back and forth between questions in palette
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3.5 p-4 bg-olympiad-bg rounded-md border border-olympiad-border cursor-pointer hover:bg-navy-50/50">
                <input
                  type="checkbox"
                  checked={formData.rules?.autoSubmitOnTimeUp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rules: { ...formData.rules!, autoSubmitOnTimeUp: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-olympiad-primary cursor-pointer"
                />
                <div>
                  <span className="text-[14px] font-bold text-navy-900 block">Auto-Submit On Timeout</span>
                  <span className="text-[12px] text-olympiad-textMuted font-medium">
                    Automatically evaluate and close attempt when countdown reaches zero
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: Question Compilation */}
        {currentStep === 3 && (
          <div className="bg-white border border-olympiad-border rounded-lg p-6 sm:p-8 shadow-subtle space-y-5">
            <div className="flex items-center justify-between border-b border-olympiad-border pb-3">
              <h3 className="text-[17px] font-bold text-navy-900">
                Section 3: Select Interactive Questions ({formData.questionIds?.length || 0} selected)
              </h3>
              <span className="text-[14px] font-mono font-bold text-olympiad-primary bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
                Total Marks: +{formData.totalMarks}
              </span>
            </div>

            <div className="divide-y divide-olympiad-border max-h-[420px] overflow-y-auto">
              {questions.map((q) => {
                const isSelected = formData.questionIds?.includes(q.id);

                return (
                  <div
                    key={q.id}
                    onClick={() => toggleQuestionSelection(q.id)}
                    className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                      isSelected ? "bg-blue-50/70" : "hover:bg-navy-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 accent-olympiad-primary cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[13px] text-navy-900">{q.questionId}</span>
                          <span className="px-2 py-0.5 bg-olympiad-primary text-white rounded text-[11px] font-bold">
                            {q.questionType}
                          </span>
                          <span className="text-[12px] text-olympiad-textMuted font-medium">{q.section}</span>
                        </div>
                        <p className="text-[14px] text-navy-900 font-medium line-clamp-1 mt-1">{q.questionText}</p>
                      </div>
                    </div>

                    <span className="font-mono font-bold text-[14px] text-navy-900">+{q.marks}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Timing & Scoring */}
        {currentStep === 4 && (
          <div className="bg-white border border-olympiad-border rounded-lg p-6 sm:p-8 shadow-subtle space-y-5">
            <h3 className="text-[17px] font-bold text-navy-900 border-b border-olympiad-border pb-3">
              Section 4: Timing & Scoring Policy
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="text-[13px] font-bold text-navy-900 mb-1.5 block">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  value={formData.durationMinutes || 45}
                  onChange={(e) =>
                    setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 45 })
                  }
                  className="w-full h-[46px] text-[14px] px-4 bg-olympiad-bg border border-olympiad-border rounded-md font-mono font-bold text-navy-900"
                />
              </div>

              <div>
                <label className="text-[13px] font-bold text-navy-900 mb-1.5 block">Total Marks</label>
                <input
                  type="number"
                  value={formData.totalMarks || 15}
                  onChange={(e) =>
                    setFormData({ ...formData, totalMarks: parseInt(e.target.value) || 15 })
                  }
                  className="w-full h-[46px] text-[14px] px-4 bg-olympiad-bg border border-olympiad-border rounded-md font-mono font-bold text-navy-900"
                />
              </div>

              <div>
                <label className="text-[13px] font-bold text-navy-900 mb-1.5 block">Passing Marks</label>
                <input
                  type="number"
                  value={formData.passingMarks || 6}
                  onChange={(e) =>
                    setFormData({ ...formData, passingMarks: parseInt(e.target.value) || 6 })
                  }
                  className="w-full h-[46px] text-[14px] px-4 bg-olympiad-bg border border-olympiad-border rounded-md font-mono font-bold text-navy-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Publish */}
        {currentStep === 5 && (
          <div className="bg-white border border-olympiad-border rounded-lg p-6 sm:p-8 shadow-subtle space-y-6">
            <h3 className="text-[17px] font-bold text-navy-900 border-b border-olympiad-border pb-3">
              Section 5: Final Review & Publishing Confirmation
            </h3>

            <div className="bg-navy-50/80 p-5 rounded-md border border-olympiad-border space-y-3 text-[14px]">
              <div className="flex justify-between">
                <span className="text-olympiad-textMuted font-medium">Exam Title:</span>
                <span className="font-bold text-navy-900">{formData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-olympiad-textMuted font-medium">Exam Code:</span>
                <span className="font-mono font-bold text-navy-900">{formData.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-olympiad-textMuted font-medium">Duration:</span>
                <span className="font-bold text-navy-900">{formData.durationMinutes} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-olympiad-textMuted font-medium">Compiled Questions:</span>
                <span className="font-bold text-navy-900">{formData.questionIds?.length} questions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-olympiad-textMuted font-medium">Total Marks:</span>
                <span className="font-bold text-olympiad-primary">+{formData.totalMarks} Marks</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveExam}
                className="h-[46px] px-7 bg-olympiad-green hover:bg-green-700 text-white rounded-md text-[14px] font-bold flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" /> Save & Launch Examination
              </button>
            </div>
          </div>
        )}

        {/* Wizard Navigation Buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="h-[42px] px-5 bg-white border border-olympiad-border rounded-md text-[13px] font-bold text-navy-900 disabled:opacity-30 cursor-pointer shadow-xs"
          >
            Previous Section
          </button>

          {currentStep < 5 && (
            <button
              type="button"
              onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
              className="h-[42px] px-6 bg-olympiad-deep hover:bg-navy-900 text-white rounded-md text-[13px] font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Next Section</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
