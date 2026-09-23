"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OlympiadStore } from "@/services/firebase/firestore";
import { QuestionRenderer } from "@/components/questions/QuestionRenderer";
import { Question, QuestionType } from "@/types/question";
import { evaluateAnswer } from "@/engine/answer-evaluator";
import { Save, Eye, CheckCircle2, ArrowLeft } from "lucide-react";

export default function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [question, setQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<Partial<Question>>({});
  const [previewAnswer, setPreviewAnswer] = useState<any>(null);
  const [testEvalResult, setTestEvalResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const q = await OlympiadStore.getQuestionById(resolvedParams.id);
      if (q) {
        setQuestion(q);
        setFormData(q);
      }
      setLoading(false);
    }
    load();
  }, [resolvedParams.id]);

  if (loading) {
    return <div className="p-8 text-center text-[14px] text-olympiad-textMuted">Loading question studio...</div>;
  }

  if (!question) {
    return (
      <div className="p-8 text-center space-y-3">
        <h2 className="text-xl font-bold text-olympiad-deepBlue">Question Not Found</h2>
        <Link href="/admin/questions" className="text-[14px] text-olympiad-primaryBlue hover:underline">
          Return to Question Repository
        </Link>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await OlympiadStore.saveQuestion({
      ...(formData as Question),
      updatedAt: new Date().toISOString(),
    });
    router.push("/admin/questions");
  };

  const handleTestEvaluate = () => {
    if (!formData.questionType) return;
    const res = evaluateAnswer(formData as Question, {
      questionId: formData.id!,
      type: formData.questionType,
      answer: previewAnswer,
      timestamp: Date.now(),
    });
    setTestEvalResult(res);
  };

  return (
    <div className="flex-1 flex flex-col w-full">
      <AdminHeader
        title={`Edit Question: ${formData.questionId}`}
        subtitle="Modify parameters with live student solving preview"
      />

      <div className="space-y-6 w-full max-w-[1750px]">
        {/* Top Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/questions"
            className="h-[42px] px-4 bg-white border border-olympiad-border hover:bg-olympiad-blueSoft rounded text-[14px] font-bold text-olympiad-deepBlue flex items-center gap-2 transition-all shadow-subtle"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Repository
          </Link>

          <button
            type="button"
            onClick={handleSave}
            className="h-[42px] px-6 bg-olympiad-primaryBlue hover:bg-olympiad-deepBlue text-white text-[14px] font-bold rounded shadow-subtle flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" /> Update Question
          </button>
        </div>

        {/* 60 / 40 Split Container */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* LEFT: Configuration */}
          <div className="xl:col-span-7 bg-white border border-olympiad-border rounded-lg p-6 lg:p-8 shadow-subtle space-y-6">
            <div className="border-b border-olympiad-border pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-olympiad-deepBlue">Question Parameters</h2>
                <p className="text-[13px] text-olympiad-textMuted font-medium">Configure question taxonomy and grading</p>
              </div>
              <span className="px-3 py-1 bg-olympiad-blueLight text-olympiad-deepBlue rounded font-mono font-bold text-[13px]">
                {formData.questionId}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[13px] font-bold text-olympiad-deepBlue mb-1.5 block">Question Code</label>
                <input
                  type="text"
                  value={formData.questionId || ""}
                  onChange={(e) => setFormData({ ...formData, questionId: e.target.value })}
                  className="w-full h-[46px] px-4 text-[14px] bg-olympiad-bg border border-olympiad-border rounded-md font-mono font-bold text-olympiad-deepBlue focus:bg-white focus:outline-none focus:border-olympiad-primaryBlue"
                />
              </div>

              <div>
                <label className="text-[13px] font-bold text-olympiad-deepBlue mb-1.5 block">Subject</label>
                <select
                  value={formData.subjectId || "sub_math"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subjectId: e.target.value,
                      subjectName: e.target.value === "sub_math" ? "Mathematics" : "Science",
                    })
                  }
                  className="w-full h-[46px] px-4 text-[14px] font-semibold bg-olympiad-bg border border-olympiad-border rounded-md text-olympiad-deepBlue focus:bg-white cursor-pointer"
                >
                  <option value="sub_math">Mathematics</option>
                  <option value="sub_science">Science</option>
                  <option value="sub_reasoning">Logical Reasoning</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[13px] font-bold text-olympiad-deepBlue mb-1.5 block">Olympiad Section</label>
                <select
                  value={formData.section || "Mathematical Reasoning"}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value as any })}
                  className="w-full h-[46px] px-4 text-[14px] font-medium bg-olympiad-bg border border-olympiad-border rounded-md text-olympiad-text focus:bg-white cursor-pointer"
                >
                  <option value="Logical Reasoning">Logical Reasoning</option>
                  <option value="Mathematical Reasoning">Mathematical Reasoning</option>
                  <option value="Everyday Mathematics">Everyday Mathematics</option>
                  <option value="Achievers Section">Achievers Section</option>
                </select>
              </div>

              <div>
                <label className="text-[13px] font-bold text-olympiad-deepBlue mb-1.5 block">Interaction Type</label>
                <div className="h-[46px] px-4 bg-olympiad-blueLight border-2 border-olympiad-academicBlue/40 text-olympiad-deepBlue font-bold rounded-md flex items-center text-[14px]">
                  {formData.questionType}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[13px] font-bold text-olympiad-deepBlue mb-1.5 block">Question Prompt</label>
              <textarea
                rows={3}
                value={formData.questionText || ""}
                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                className="w-full p-4 text-[15px] bg-olympiad-bg border border-olympiad-border rounded-md text-olympiad-deepBlue font-medium focus:bg-white focus:outline-none focus:border-olympiad-primaryBlue leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[13px] font-bold text-olympiad-deepBlue mb-1.5 block">Difficulty</label>
                <select
                  value={formData.difficulty || "MEDIUM"}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  className="w-full h-[46px] px-3 text-[14px] font-bold bg-olympiad-bg border border-olympiad-border rounded-md text-olympiad-text focus:bg-white"
                >
                  <option value="EASY">EASY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                  <option value="ACHIEVER">ACHIEVER</option>
                </select>
              </div>

              <div>
                <label className="text-[13px] font-bold text-olympiad-deepBlue mb-1.5 block">Marks (+)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.marks || 1}
                  onChange={(e) => setFormData({ ...formData, marks: parseFloat(e.target.value) || 1 })}
                  className="w-full h-[46px] px-3 text-[15px] bg-olympiad-bg border border-olympiad-border rounded-md font-mono font-bold text-olympiad-deepBlue text-center"
                />
              </div>

              <div>
                <label className="text-[13px] font-bold text-olympiad-deepBlue mb-1.5 block">Negative Marks (-)</label>
                <input
                  type="number"
                  step="0.25"
                  value={formData.negativeMarks || 0}
                  onChange={(e) => setFormData({ ...formData, negativeMarks: parseFloat(e.target.value) || 0 })}
                  className="w-full h-[46px] px-3 text-[15px] bg-olympiad-bg border border-olympiad-border rounded-md font-mono font-bold text-olympiad-red text-center"
                />
              </div>
            </div>

            <div>
              <label className="text-[13px] font-bold text-olympiad-deepBlue mb-1.5 block">Educational Explanation</label>
              <textarea
                rows={2}
                value={formData.explanation || ""}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                className="w-full p-3.5 text-[14px] bg-olympiad-bg border border-olympiad-border rounded-md text-olympiad-text focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* RIGHT: Live Student Preview */}
          <div className="xl:col-span-5 bg-white border-2 border-olympiad-primaryBlue/40 rounded-lg p-6 lg:p-8 shadow-card space-y-6 sticky top-24">
            <div className="border-b border-olympiad-border pb-4 flex items-center justify-between">
              <div>
                <span className="text-[13px] font-bold uppercase tracking-wider text-olympiad-primaryBlue flex items-center gap-2">
                  <Eye className="w-5 h-5" /> Live Student Interactive Preview
                </span>
                <p className="text-[12px] text-olympiad-textMuted font-medium mt-0.5">
                  Direct student examination simulator
                </p>
              </div>

              <button
                type="button"
                onClick={handleTestEvaluate}
                className="h-[38px] px-4 bg-olympiad-deepBlue hover:bg-olympiad-primaryBlue text-white rounded text-[13px] font-bold flex items-center gap-1.5 shadow-subtle transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-olympiad-yellow" /> Test Evaluation
              </button>
            </div>

            {/* Rendered Question Paper Canvas */}
            <div className="p-6 bg-olympiad-bg/60 rounded-lg border border-olympiad-border min-h-[360px]">
              <QuestionRenderer
                question={formData as Question}
                value={previewAnswer}
                onChange={(val) => setPreviewAnswer(val)}
                readOnly={false}
              />
            </div>

            {/* Diagnostic Box */}
            <div className="p-4 bg-olympiad-blueLight/60 rounded-lg border border-olympiad-academicBlue/25 text-[13px] space-y-2 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-olympiad-textMuted font-semibold">Answer Payload:</span>
                <span className="text-olympiad-deepBlue font-bold truncate max-w-xs">
                  {previewAnswer !== null ? JSON.stringify(previewAnswer) : "Awaiting interaction..."}
                </span>
              </div>

              {testEvalResult && (
                <div className="pt-2 border-t border-olympiad-academicBlue/20 flex items-center justify-between font-bold text-[14px]">
                  <span>Evaluation Result:</span>
                  <span
                    className={
                      testEvalResult.isCorrect ? "text-olympiad-green" : "text-olympiad-red"
                    }
                  >
                    {testEvalResult.isCorrect ? "✓ CORRECT" : "✕ INCORRECT"} (+
                    {testEvalResult.marksAwarded} Marks)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
