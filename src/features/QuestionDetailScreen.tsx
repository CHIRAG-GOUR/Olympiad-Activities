"use client";

import { useAuth } from "@/context/AuthContext";
import { ROLE_PREFIX } from "@/lib/auth/sections";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { questionService } from "@/services";
import { QuestionRenderer } from "@/components/questions/QuestionRenderer";
import { Question, QuestionType } from "@/types/question";
import { evaluateAnswer } from "@/engine/answer-evaluator";
import { Save, Eye, CheckCircle2, ArrowLeft } from "lucide-react";
import { InlineStatus } from "@/components/feedback/StatusPanel";
import { logError, userMessageFor } from "@/lib/logger";

export default function QuestionDetailScreen({ questionId }: { questionId: string }) {
  // Links resolve into the route group the active role actually owns.
  const { activeRole } = useAuth();
  const roleBase = ROLE_PREFIX[activeRole];
  const router = useRouter();

  const [question, setQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<Partial<Question>>({});
  const [previewAnswer, setPreviewAnswer] = useState<any>(null);
  const [testEvalResult, setTestEvalResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<unknown>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const q = questionId ? await questionService.getQuestion(questionId) : null;
        if (cancelled) return;
        setQuestion(q);
        if (q) setFormData(q);
      } catch (err) {
        if (cancelled) return;
        logError("FIRESTORE_QUERY_FAILED", { operation: "questionDetail", questionId }, err);
        setLoadError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [questionId, reloadKey]);

  if (loading) {
    return <div className="p-8 text-center text-[14px] text-olympiad-textMuted">Loading question studio...</div>;
  }

  if (loadError) {
    return (
      <InlineStatus
        title="Unable to load this question"
        message={userMessageFor(loadError, "this question")}
        actions={[
          { label: "Back to questions", href: `${roleBase}/questions` },
          { label: "Retry", onClick: () => setReloadKey((n) => n + 1), primary: true },
        ]}
      />
    );
  }

  if (!question) {
    return (
      <InlineStatus
        tone="notfound"
        title="Question not found"
        message="No question matches this link. It may have been deleted or the link is incomplete."
        actions={[{ label: "Back to questions", href: `${roleBase}/questions` }]}
      />
    );
  }

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      await questionService.saveQuestion({
        ...(formData as Question),
        updatedAt: new Date().toISOString(),
      });
      router.push(`${roleBase}/questions`);
    } catch (err) {
      // Stay in the editor with every change intact so nothing typed is lost.
      setSaveError(userMessageFor(err, "the server").replace("loaded", "saved"));
      setSaving(false);
    }
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
            href={`${roleBase}/questions`}
            className="h-[42px] px-4 bg-white border border-olympiad-border hover:bg-olympiad-blueSoft rounded text-[14px] font-bold text-olympiad-deepBlue flex items-center gap-2 transition-all shadow-subtle"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Repository
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="h-[42px] px-6 bg-olympiad-primaryBlue hover:bg-olympiad-deepBlue disabled:opacity-60 text-white text-[14px] font-bold rounded shadow-subtle flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving…" : "Update Question"}
          </button>
        </div>

        {saveError && (
          <div role="alert" className="p-3 rounded-lg border border-rose-200 bg-rose-50 text-[13px] font-semibold text-rose-800">
            Your changes were not saved. {saveError}
          </div>
        )}

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
                {/* Ids must match the subjects papers are filed under (see seedData). */}
                <select
                  value={formData.subjectId || "sub_mathematics"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subjectId: e.target.value,
                      subjectName: e.target.value === "sub_english" ? "English" : "Mathematics",
                    })
                  }
                  className="w-full h-[46px] px-4 text-[14px] font-semibold bg-olympiad-bg border border-olympiad-border rounded-md text-olympiad-deepBlue focus:bg-white cursor-pointer"
                >
                  <option value="sub_mathematics">Mathematics</option>
                  <option value="sub_english">English</option>
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
                  {Array.from(
                    new Set([
                      ...(formData.section ? [formData.section] : []),
                      "Logical Reasoning",
                      "Mathematical Reasoning",
                      "Everyday Mathematics",
                      "Achievers Section",
                    ])
                  ).map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
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
