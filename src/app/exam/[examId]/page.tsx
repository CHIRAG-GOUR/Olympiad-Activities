"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OlympiadStore } from "@/services/firebase/firestore";
import { Exam } from "@/types/exam";
import { Question } from "@/types/question";
import { ExamSession, StudentMetadata } from "@/types/session";
import { ExamAttempt } from "@/types/attempt";
import { computeExamAttemptScore } from "@/engine/scoring-engine";
import { getClientDeviceInfo } from "@/lib/deviceUtils";
import { ExamHeader } from "@/components/examination/ExamHeader";
import { QuestionPalette } from "@/components/examination/QuestionPalette";
import { ExamNavigation } from "@/components/examination/ExamNavigation";
import { QuestionRenderer } from "@/components/questions/QuestionRenderer";
import {
  Clock,
  Award,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Play,
  ArrowLeft,
  BookOpen,
  UserCheck,
  Send,
  Sparkles,
} from "lucide-react";

export default function ExamSessionContainer({ params }: { params: Promise<{ examId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Candidate Registration State
  const [hasStarted, setHasStarted] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [candidateId, setCandidateId] = useState("");

  // In-Exam NTA State Machine
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [visitedIndices, setVisitedIndices] = useState<Set<number>>(new Set([0]));
  const [markedForReviewIndices, setMarkedForReviewIndices] = useState<Set<number>>(new Set());
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(60 * 60);
  const [timeSpentMap, setTimeSpentMap] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Load Exam and Compiled Questions
  useEffect(() => {
    async function load() {
      const [e, qList] = await Promise.all([
        OlympiadStore.getExamById(resolvedParams.examId),
        OlympiadStore.getQuestions(),
      ]);

      if (e) {
        setExam(e);
        // Ensure questions are strictly sorted according to exam.questionIds list (1 to 50 in exact order)
        const compiled = e.questionIds
          .map((id) => qList.find((q) => q.id === id))
          .filter((q): q is Question => q !== undefined);

        const finalQuestions = compiled.length > 0 ? compiled : qList.slice(0, e.totalQuestions || 50);
        setQuestions(finalQuestions);
        setTimeRemainingSeconds(e.durationMinutes * 60);

        // Pre-generate candidate roll ID
        setCandidateId(`STU-${Math.floor(10000 + Math.random() * 90000)}`);
      }
      setLoading(false);
    }
    load();
  }, [resolvedParams.examId]);

  // Mark current question as visited
  useEffect(() => {
    if (hasStarted) {
      setVisitedIndices((prev) => {
        const next = new Set(prev);
        next.add(currentIndex);
        return next;
      });
    }
  }, [currentIndex, hasStarted]);

  // Countdown timer effect
  useEffect(() => {
    if (!hasStarted || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit("auto_timeout");
          return 0;
        }
        return prev - 1;
      });

      if (questions[currentIndex]) {
        const qId = questions[currentIndex].id;
        setTimeSpentMap((prev) => ({
          ...prev,
          [qId]: (prev[qId] || 0) + 1,
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, isSubmitting, currentIndex, questions]);

  // Sections setup
  const sections = useMemo(() => {
    return [
      { id: "sec_logical", title: "Logical Reasoning", startIdx: 0, endIdx: 14, count: 15 },
      { id: "sec_math", title: "Mathematical Reasoning", startIdx: 15, endIdx: 34, count: 20 },
      { id: "sec_everyday", title: "Everyday Mathematics", startIdx: 35, endIdx: 44, count: 10 },
      { id: "sec_achievers", title: "Achievers Section", startIdx: 45, endIdx: 49, count: 5 },
    ];
  }, []);

  const currentSection = useMemo(() => {
    return (
      sections.find((sec) => currentIndex >= sec.startIdx && currentIndex <= sec.endIdx) ||
      sections[0]
    );
  }, [currentIndex, sections]);

  // Candidate Registration Handler
  const handleStartExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim()) return;

    const sTime = new Date().toISOString();
    setStartTime(sTime);
    setHasStarted(true);
    setVisitedIndices(new Set([0]));
  };

  // NTA Action: Save & Next
  const handleSaveAndNext = () => {
    if (!currentQuestion) return;
    // Remove from marked for review if previously marked
    setMarkedForReviewIndices((prev) => {
      const next = new Set(prev);
      next.delete(currentIndex);
      return next;
    });

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // NTA Action: Save & Mark for Review
  const handleSaveAndMarkForReview = () => {
    if (!currentQuestion) return;
    setMarkedForReviewIndices((prev) => {
      const next = new Set(prev);
      next.add(currentIndex);
      return next;
    });

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // NTA Action: Mark for Review & Next (without necessarily answering)
  const handleMarkForReviewAndNext = () => {
    setMarkedForReviewIndices((prev) => {
      const next = new Set(prev);
      next.add(currentIndex);
      return next;
    });

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // NTA Action: Clear Response
  const handleClearResponse = () => {
    if (!currentQuestion) return;
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
    setMarkedForReviewIndices((prev) => {
      const next = new Set(prev);
      next.delete(currentIndex);
      return next;
    });
  };

  // Answer change handler
  const handleAnswerChange = (val: any) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  };

  // Final Exam Submission Handler
  const handleFinalSubmit = async (reason: "normal" | "auto_timeout" = "normal") => {
    if (isSubmitting || !exam) return;
    setIsSubmitting(true);

    try {
      const endTime = new Date().toISOString();
      const totalTimeSpentSeconds = Math.max(
        0,
        exam.durationMinutes * 60 - timeRemainingSeconds
      );

      const studentMeta: StudentMetadata = {
        name: candidateName || "Candidate",
        studentId: candidateId,
        rollNumber: candidateId,
        schoolName: schoolName || "Olympiad Academy",
        grade: exam.grade,
      };

      const attemptRecord = computeExamAttemptScore({
        exam,
        questions,
        answers,
        timeSpentMap,
        student: studentMeta,
        device: getClientDeviceInfo(),
        startedAt: startTime || new Date().toISOString(),
        submittedAt: endTime,
        submissionType: reason,
      });

      await OlympiadStore.saveAttempt(attemptRecord);
      router.push(`/results/${attemptRecord.id}`);
    } catch (err) {
      console.error("Submission failed:", err);
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#0B4F8A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-extrabold text-slate-700">Loading Official Examination Paper...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-300 max-w-md text-center space-y-4 shadow-lg">
          <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Examination Paper Not Found</h2>
          <p className="text-sm text-slate-600">The requested examination could not be loaded from storage.</p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-[#0B4F8A] text-white font-bold rounded-lg text-sm"
          >
            Return to Examination Portal
          </Link>
        </div>
      </div>
    );
  }

  // SCREEN 1: Candidate Verification & Instructions
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex flex-col justify-between select-none font-sans">
        <header className="bg-[#0B4F8A] text-white py-3.5 px-6 border-b-2 border-[#083863] shadow">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-white text-[#0B4F8A] flex items-center justify-center font-black text-lg">
                &Omega;
              </span>
              <div>
                <div className="text-xs uppercase tracking-wider text-amber-300 font-bold">NTA Examination Portal</div>
                <div className="text-base font-extrabold text-white">{exam.title}</div>
              </div>
            </div>
            <Link
              href="/"
              className="text-xs font-bold text-white/80 hover:text-white flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-6 my-6">
          <div className="bg-white rounded-2xl border-2 border-slate-300 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B4F8A] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                Official Level-1 Examination Paper
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-2">
                {exam.title}
              </h1>
              {exam.subtitle && (
                <p className="text-sm text-slate-600 mt-1 font-medium">{exam.subtitle}</p>
              )}
            </div>

            {/* Exam Parameters Overview */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <div>
                <span className="text-xs text-slate-500 font-bold block">Duration</span>
                <strong className="text-slate-900 text-lg font-mono font-black">{exam.durationMinutes} Mins</strong>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold block">Questions</span>
                <strong className="text-slate-900 text-lg font-mono font-black">{questions.length} Items</strong>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold block">Max Marks</span>
                <strong className="text-[#0B4F8A] text-lg font-mono font-black">+{exam.totalMarks} Marks</strong>
              </div>
            </div>

            {/* Candidate Identity Form */}
            <form onSubmit={handleStartExam} className="space-y-4">
              <div>
                <label htmlFor="c-name" className="text-xs font-bold text-slate-800 mb-1 block uppercase">
                  Candidate Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  id="c-name"
                  type="text"
                  required
                  placeholder="e.g. Chirag Sharma"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full h-11 px-3 text-sm bg-white border-2 border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-none focus:border-[#0B4F8A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="c-id" className="text-xs font-bold text-slate-800 mb-1 block uppercase">
                    Assigned Roll Number
                  </label>
                  <input
                    id="c-id"
                    type="text"
                    disabled
                    value={candidateId}
                    className="w-full h-11 px-3 text-sm bg-slate-100 border border-slate-300 rounded-lg font-mono font-bold text-[#0B4F8A]"
                  />
                </div>

                <div>
                  <label htmlFor="s-name" className="text-xs font-bold text-slate-800 mb-1 block uppercase">
                    School Name (Optional)
                  </label>
                  <input
                    id="s-name"
                    type="text"
                    placeholder="e.g. St. Xavier's School"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full h-11 px-3 text-sm bg-white border-2 border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-[#0B4F8A]"
                  />
                </div>
              </div>

              {/* Instructions Box */}
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-xs text-slate-800 space-y-2">
                <div className="font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-amber-700" /> NTA Examination Instructions
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>The clock will be set at the server. The countdown timer at the top right indicates remaining time.</li>
                  <li>Questions are structured strictly into 4 sections (1 to 50 in sequential order).</li>
                  <li>Use <strong>Save & Next</strong> to confirm answers, or <strong>Save & Mark for Review</strong> to flag questions while keeping answers.</li>
                  <li>All interactive simulations feature light-mode manipulatives and deterministic engine evaluation.</li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#28A745] hover:bg-[#218838] active:bg-[#1E7E34] text-white rounded-lg text-base font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                <span>Enter & Start Examination</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // SCREEN 2: The Official NTA Digital Examination Paper
  const currentQuestion = questions[currentIndex];
  const currentAnswerValue = currentQuestion ? answers[currentQuestion.id] : undefined;

  const answeredIndices = new Set(
    questions
      .map((q, idx) => (answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== "" ? idx : -1))
      .filter((idx) => idx !== -1)
  );

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col justify-between select-none font-sans">
      {/* Official Top Header Bar */}
      <ExamHeader
        olympiadTitle={exam.title}
        examCode={exam.code}
        candidateName={candidateName}
        candidateId={candidateId}
        timeRemainingSeconds={timeRemainingSeconds}
        isSaving={isSaving}
      />

      {/* Main Examination Workspace */}
      <main className="flex-1 w-full max-w-[1750px] mx-auto px-3 sm:px-5 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left / Center: Question Canvas (8-9 cols on desktop) */}
          <div className="lg:col-span-8 xl:col-span-9 bg-white border-2 border-slate-300 rounded-xl shadow-md flex flex-col min-h-[640px] overflow-hidden">
            {/* Section Tabs Bar (NTA Header) */}
            <div className="bg-slate-100 border-b-2 border-slate-300 px-4 py-2 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0 mr-2">
                Sections:
              </span>
              {sections.map((sec) => {
                const isActive = currentSection.id === sec.id;
                // Count answered in this section
                const answeredInSection = questions
                  .slice(sec.startIdx, sec.endIdx + 1)
                  .filter((q) => answers[q.id] !== undefined && answers[q.id] !== "").length;

                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setCurrentIndex(sec.startIdx)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                      isActive
                        ? "bg-[#0B4F8A] text-white border-[#083863] shadow-xs"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    <span>{sec.title}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {answeredInSection}/{sec.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Question Info Bar */}
            <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-[#0B4F8A]">
                  Question No. {currentIndex + 1}
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-600 font-semibold">{currentSection.title}</span>
              </div>

              <div className="flex items-center gap-3 font-mono">
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Right: +{currentQuestion?.marks || 1}.00
                </span>
                <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Negative: -{currentQuestion?.negativeMarks || 0}.00
                </span>
              </div>
            </div>

            {/* Question Content Body */}
            <div className="p-6 flex-1 space-y-6">
              {currentQuestion ? (
                <QuestionRenderer
                  question={currentQuestion}
                  value={currentAnswerValue}
                  onChange={handleAnswerChange}
                  readOnly={false}
                  showMetadata={false}
                />
              ) : (
                <div className="p-8 text-center text-slate-400">Question not loaded.</div>
              )}
            </div>

            {/* NTA Navigation Actions Bar */}
            <ExamNavigation
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              onSaveAndNext={handleSaveAndNext}
              onSaveAndMarkForReview={handleSaveAndMarkForReview}
              onMarkForReviewAndNext={handleMarkForReviewAndNext}
              onClearResponse={handleClearResponse}
              onPrevious={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              onNext={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
            />
          </div>

          {/* Right: NTA Question Palette Panel (3-4 cols on desktop) */}
          <div className="lg:col-span-4 xl:col-span-3 sticky top-16">
            <QuestionPalette
              questions={questions}
              currentIndex={currentIndex}
              visitedIndices={visitedIndices}
              answeredIndices={answeredIndices}
              markedForReviewIndices={markedForReviewIndices}
              activeSectionId={currentSection.id}
              onSelectIndex={(idx) => setCurrentIndex(idx)}
              onSubmitExam={() => setShowConfirmModal(true)}
              candidateName={candidateName}
              candidateId={candidateId}
            />
          </div>
        </div>
      </main>

      {/* Official NTA Final Submission Confirmation Summary Dialog */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-xl w-full p-6 space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-black text-slate-900">
                Summary of Examination Responses
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Review your final section-wise tally before closing the examination paper.
              </p>
            </div>

            {/* Section Breakdown Matrix */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs font-bold">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Section Name</th>
                    <th className="p-2.5 text-center">Total</th>
                    <th className="p-2.5 text-center text-emerald-700">Answered</th>
                    <th className="p-2.5 text-center text-rose-700">Not Ans</th>
                    <th className="p-2.5 text-center text-purple-700">Marked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {sections.map((sec) => {
                    const secQuestions = questions.slice(sec.startIdx, sec.endIdx + 1);
                    const ansCount = secQuestions.filter(
                      (q) => answers[q.id] !== undefined && answers[q.id] !== ""
                    ).length;
                    const markedCount = secQuestions.filter((_, idx) =>
                      markedForReviewIndices.has(sec.startIdx + idx)
                    ).length;
                    const notAnsCount = sec.count - ansCount;

                    return (
                      <tr key={sec.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-semibold text-slate-900">{sec.title}</td>
                        <td className="p-2.5 text-center font-mono">{sec.count}</td>
                        <td className="p-2.5 text-center font-mono text-emerald-700">{ansCount}</td>
                        <td className="p-2.5 text-center font-mono text-rose-700">{notAnsCount}</td>
                        <td className="p-2.5 text-center font-mono text-purple-700">{markedCount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Grand Total Bar */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-bold">
              <span>Overall Answered:</span>
              <span className="font-mono text-base text-emerald-700">
                {answeredIndices.size} / {questions.length} Questions
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="h-10 px-4 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
              >
                No, Return to Paper
              </button>
              <button
                type="button"
                onClick={() => handleFinalSubmit("normal")}
                className="h-10 px-6 bg-[#28A745] hover:bg-[#218838] text-white rounded-lg text-xs font-black shadow transition-all cursor-pointer uppercase tracking-wide"
              >
                Yes, Final Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
