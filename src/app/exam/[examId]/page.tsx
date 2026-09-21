"use client";

import React, { useState, useEffect, use } from "react";
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
  Laptop,
  Play,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  BookOpen,
  UserCheck,
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

  // In-Exam State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flaggedIndices, setFlaggedIndices] = useState<Set<number>>(new Set());
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(45 * 60);
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
        const compiled = qList.filter((q) => e.questionIds.includes(q.id));
        // Fallback: If no exact matches in mock storage, take first available questions
        const finalQuestions = compiled.length > 0 ? compiled : qList.slice(0, e.totalQuestions || 5);
        setQuestions(finalQuestions);
        setTimeRemainingSeconds(e.durationMinutes * 60);

        // Pre-generate friendly candidate ID
        setCandidateId(`STU-${Math.floor(10000 + Math.random() * 90000)}`);
      }
      setLoading(false);
    }
    load();
  }, [resolvedParams.examId]);

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

      // Track time on current question
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

  // Sync to Live Monitor periodically
  useEffect(() => {
    if (!hasStarted || !exam || questions.length === 0) return;

    const answeredCount = Object.keys(answers).filter(
      (k) => answers[k] !== undefined && answers[k] !== null && answers[k] !== ""
    ).length;

    const sessionData: ExamSession = {
      id: `sess_${candidateId}`,
      sessionId: `EX-${candidateId.replace("STU-", "")}`,
      examId: exam.id,
      examTitle: exam.title,
      student: {
        name: candidateName || "Candidate Student",
        studentId: candidateId,
        schoolName: schoolName || "Olympiad Academy",
        grade: exam.grade,
      },
      device: getClientDeviceInfo(),
      currentQuestionIndex: currentIndex,
      currentQuestionId: questions[currentIndex]?.id || "",
      totalQuestions: questions.length,
      answeredCount,
      flaggedCount: flaggedIndices.size,
      progressPercent: Math.round((answeredCount / questions.length) * 100),
      startedAt: startTime || new Date().toLocaleTimeString(),
      lastActiveAt: "Just now",
      connectionStatus: "Connected",
      timeRemainingSeconds,
      isSubmitted: isSubmitting,
    };

    OlympiadStore.upsertSession(sessionData);
  }, [hasStarted, currentIndex, answers, flaggedIndices, timeRemainingSeconds, isSubmitting]);

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim()) {
      alert("Please enter candidate's full name to proceed.");
      return;
    }
    setStartTime(new Date().toLocaleTimeString());
    setHasStarted(true);
  };

  const handleAnswerChange = (val: any) => {
    if (!questions[currentIndex]) return;
    const qId = questions[currentIndex].id;
    setIsSaving(true);
    setAnswers((prev) => ({ ...prev, [qId]: val }));
    setTimeout(() => setIsSaving(false), 300);
  };

  const handleClearAnswer = () => {
    if (!questions[currentIndex]) return;
    const qId = questions[currentIndex].id;
    const updated = { ...answers };
    delete updated[qId];
    setAnswers(updated);
  };

  const handleToggleFlag = () => {
    const next = new Set(flaggedIndices);
    if (next.has(currentIndex)) next.delete(currentIndex);
    else next.add(currentIndex);
    setFlaggedIndices(next);
  };

  const handleFinalSubmit = async (submissionType: "normal" | "auto_timeout" = "normal") => {
    if (!exam) return;
    setIsSubmitting(true);

    const student: StudentMetadata = {
      name: candidateName || "Candidate",
      studentId: candidateId,
      schoolName: schoolName || "Olympiad Academy",
      grade: exam.grade,
    };

    // Format answers payload
    const normalizedAnswers: Record<string, any> = {};
    questions.forEach((q) => {
      if (answers[q.id] !== undefined) {
        normalizedAnswers[q.id] = {
          questionId: q.id,
          type: q.questionType,
          answer: answers[q.id],
          timestamp: Date.now(),
          timeSpentSeconds: timeSpentMap[q.id] || 0,
        };
      }
    });

    const attempt: ExamAttempt = computeExamAttemptScore({
      exam,
      questions,
      answers: normalizedAnswers,
      timeSpentMap,
      student,
      device: getClientDeviceInfo(),
      startedAt: startTime || new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      submissionType,
    });

    await OlympiadStore.saveAttempt(attempt);
    router.push(`/results/${attempt.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7ED] flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-3 bg-[#FFFDF5] border-2 border-[#FDE68A] p-8 rounded-2xl shadow-sm">
          <div className="w-10 h-10 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[16px] text-slate-900 font-extrabold">Initializing Digital Examination Session...</p>
          <p className="text-[13px] text-slate-500 font-medium">Loading interactive questions and proctoring parameters</p>
        </div>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7ED] flex items-center justify-center p-6 font-sans">
        <div className="bg-[#FFFDF5] border-2 border-[#FDE68A] rounded-2xl p-10 max-w-lg text-center space-y-5 shadow-md">
          <div className="w-14 h-14 bg-[#FEF3C7] text-[#D97706] rounded-2xl flex items-center justify-center mx-auto border-2 border-[#FDE68A]">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Examination Not Available</h2>
          <p className="text-[14px] text-slate-600 leading-relaxed font-medium">
            This examination is currently not active or questions are being compiled by the examination committee.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-[46px] px-6 bg-[#547322] hover:bg-[#435C1B] text-white rounded-xl text-[14px] font-extrabold shadow-md transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Examination Portal
          </Link>
        </div>
      </div>
    );
  }

  // SCREEN 1: Candidate Verification & Entry Screen
  if (!hasStarted) {
    const deviceInfo = getClientDeviceInfo();

    return (
      <div className="min-h-screen bg-[#FAF7ED] flex flex-col justify-between font-sans">
        {/* Academic Olympiad Header */}
        <header className="bg-[#FFFDF5] border-b-2 border-[#FDE68A] h-[76px] px-6 sm:px-10 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#0B4F8A] text-white flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-[#F59E0B]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 6V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V6L12 2Z" fill="#0B4F8A" stroke="#FFD84D" strokeWidth="1.5" />
                <path d="M12 6L14 10H18L15 13L16 17L12 14.5L8 17L9 13L6 10H10L12 6Z" fill="#F4C400" />
              </svg>
            </div>
            <div>
              <div className="text-[12px] uppercase tracking-wider font-extrabold text-[#B45309]">
                Olympiad Digital Examination Platform
              </div>
              <div className="text-[18px] font-extrabold text-slate-900 tracking-tight leading-tight">
                {exam.title}
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="h-[42px] px-4 text-[13px] font-bold text-slate-700 hover:text-slate-950 hover:bg-[#FEF3C7] rounded-xl border-2 border-[#FDE68A] flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#D97706]" /> Return to Portal
          </Link>
        </header>

        {/* Center Container */}
        <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 my-auto space-y-6">
          <div className="bg-[#FFFDF5] border-2 border-[#FDE68A] rounded-2xl p-6 sm:p-10 shadow-md space-y-6">
            <div className="border-b border-[#FDE68A] pb-5">
              <div className="flex items-center gap-3">
                <span className="font-mono font-extrabold text-[13px] bg-[#0B4F8A] text-white px-3 py-1 rounded-lg border border-[#0B4F8A]">
                  {exam.code}
                </span>
                <span className="text-[13px] text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Official Verified Olympiad Paper
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
                {exam.title}
              </h1>
              {exam.subtitle && (
                <p className="text-[14px] text-slate-600 font-medium mt-1">{exam.subtitle}</p>
              )}
            </div>

            {/* Exam Parameters Overview (Warm Golden Theme) */}
            <div className="grid grid-cols-3 gap-4 bg-[#FEF3C7]/70 p-5 rounded-xl border-2 border-[#FDE68A] text-xs">
              <div className="space-y-0.5">
                <span className="text-[12px] text-[#92400E] font-bold block">Allotted Time</span>
                <strong className="text-slate-900 text-[19px] font-extrabold font-mono">{exam.durationMinutes} Minutes</strong>
              </div>
              <div className="space-y-0.5">
                <span className="text-[12px] text-[#92400E] font-bold block">Total Questions</span>
                <strong className="text-slate-900 text-[19px] font-extrabold font-mono">{questions.length} Items</strong>
              </div>
              <div className="space-y-0.5">
                <span className="text-[12px] text-[#92400E] font-bold block">Maximum Marks</span>
                <strong className="text-[#B45309] text-[19px] font-extrabold font-mono">+{exam.totalMarks} Marks</strong>
              </div>
            </div>

            {/* Candidate Identity Form */}
            <form onSubmit={handleStartExam} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label htmlFor="candidate-name" className="text-[14px] font-bold text-slate-900 mb-1.5 block">
                    Candidate Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="candidate-name"
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full h-[48px] text-[15px] px-4 bg-white border-2 border-[#FDE68A] rounded-xl text-slate-900 font-bold placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#F59E0B] focus:ring-3 focus:ring-[#FEF08A] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="candidate-id" className="text-[13px] font-bold text-slate-900 mb-1.5 block">
                      Assigned Candidate Roll ID
                    </label>
                    <input
                      id="candidate-id"
                      type="text"
                      disabled
                      value={candidateId}
                      className="w-full h-[48px] text-[14px] px-4 bg-[#FEF3C7] border-2 border-[#FDE68A] rounded-xl font-mono font-extrabold text-[#92400E]"
                    />
                  </div>

                  <div>
                    <label htmlFor="school-name" className="text-[13px] font-bold text-slate-900 mb-1.5 block">
                      School / Institution (Optional)
                    </label>
                    <input
                      id="school-name"
                      type="text"
                      placeholder="e.g. Delhi Public School"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full h-[48px] text-[14px] px-4 bg-white border-2 border-[#FDE68A] rounded-xl text-slate-900 font-semibold placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#F59E0B] focus:ring-3 focus:ring-[#FEF08A]"
                    />
                  </div>
                </div>
              </div>

              {/* Instructions Box */}
              <div className="bg-[#FEFCE8] p-5 rounded-xl border-2 border-[#FDE68A] space-y-2.5 text-[13px] text-slate-800">
                <div className="font-extrabold text-[#92400E] flex items-center gap-2 text-[14px]">
                  <ShieldAlert className="w-4 h-4 text-[#D97706]" />
                  Examination Candidate Instructions
                </div>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-700 leading-relaxed font-medium">
                  {exam.rules.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                  <li>All interactive manipulatives (drag ordering, simulations, numeric keypad) are evaluated accurately by the engine.</li>
                </ul>
              </div>

              {/* System Diagnostics */}
              <div className="flex items-center justify-between text-[12px] text-slate-600 px-1 font-mono">
                <span>System: {deviceInfo.browser} ({deviceInfo.os})</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Examination Environment Ready
                </span>
              </div>

              <button
                type="submit"
                className="w-full h-[52px] bg-[#F59E0B] hover:bg-[#D97706] active:bg-[#B45309] text-slate-950 rounded-xl text-[16px] font-extrabold flex items-center justify-center gap-2.5 shadow-md shadow-amber-500/25 transition-all cursor-pointer"
              >
                <span>Enter & Begin Official Examination</span>
                <ArrowRight className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </main>

        <footer className="py-4 text-center text-[12px] text-slate-500 border-t border-[#FDE68A]">
          Olympiad Digital Examination Platform • Safe & Proctored Examination Session Environment
        </footer>
      </div>
    );
  }

  // SCREEN 2: The Digital Examination Paper (Academic Gold & Cream Theme)
  const currentQuestion = questions[currentIndex];
  const currentAnswerValue = currentQuestion ? answers[currentQuestion.id] : undefined;

  const answeredIndices = new Set(
    questions
      .map((q, idx) => (answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== "" ? idx : -1))
      .filter((idx) => idx !== -1)
  );

  return (
    <div className="min-h-screen bg-[#FAF7ED] flex flex-col justify-between select-none font-sans">
      {/* Top Examination Header */}
      <ExamHeader
        olympiadTitle={exam.title}
        examCode={exam.code}
        currentQuestionIndex={currentIndex}
        totalQuestions={questions.length}
        timeRemainingSeconds={timeRemainingSeconds}
        isSaving={isSaving}
        isOnline={true}
      />

      {/* Main Examination Body - Naturally expands across wide desktop viewports */}
      <main className="flex-1 w-full max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Question Solving Canvas (9 cols on wide screens) */}
          <div className="lg:col-span-8 xl:col-span-9 bg-[#FFFDF5] border-2 border-[#FDE68A] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm min-h-[640px] flex flex-col justify-between">
            {currentQuestion ? (
              <QuestionRenderer
                question={currentQuestion}
                value={currentAnswerValue}
                onChange={handleAnswerChange}
                readOnly={false}
                showMetadata={true}
              />
            ) : (
              <div className="p-8 text-center text-slate-400">Question not available.</div>
            )}
          </div>

          {/* Right Question Navigator Palette (3-4 cols on wide screens) */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-5 sticky top-24">
            <QuestionPalette
              totalQuestions={questions.length}
              currentIndex={currentIndex}
              answeredIndices={answeredIndices}
              flaggedIndices={flaggedIndices}
              onSelectIndex={(idx) => setCurrentIndex(idx)}
            />

            {/* Candidate Metadata Box */}
            <div className="bg-[#FFFDF5] border-2 border-[#FDE68A] rounded-2xl p-4 text-xs space-y-2 shadow-xs">
              <div className="text-[#92400E] font-extrabold uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Candidate Session
              </div>
              <div className="font-extrabold text-slate-900 text-[16px] truncate">{candidateName}</div>
              <div className="flex items-center justify-between text-[12px] pt-1.5 border-t border-[#FDE68A]">
                <span className="font-mono text-slate-700 font-bold">{candidateId}</span>
                <span className="text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded font-extrabold font-mono border border-[#FDE68A]">
                  Grade {exam.grade}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Examination Navigation Bar */}
      <ExamNavigation
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        isFlagged={flaggedIndices.has(currentIndex)}
        onPrevious={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
        onNext={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
        onToggleFlag={handleToggleFlag}
        onClearAnswer={handleClearAnswer}
        onSubmitExam={() => setShowConfirmModal(true)}
      />

      {/* Final Submission Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF5] rounded-3xl border-2 border-[#FDE68A] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="border-b-2 border-[#FDE68A] pb-4">
              <h3 className="text-xl font-extrabold text-slate-900">Confirm Examination Submission</h3>
              <p className="text-[13px] text-slate-600 mt-1 font-medium">
                Please review your response summary before final teacher & engine evaluation
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-[#F4F7EE] border-2 border-[#D4E0C2] p-4 rounded-2xl">
                <span className="text-[#547322] font-black text-3xl font-mono block">
                  {answeredIndices.size}
                </span>
                <span className="text-[#3E5519] font-extrabold text-[12px] mt-1 block">Answered</span>
              </div>
              <div className="bg-[#FEF3C7] border-2 border-[#FDE68A] p-4 rounded-2xl">
                <span className="text-[#D97706] font-black text-3xl font-mono block">
                  {flaggedIndices.size}
                </span>
                <span className="text-[#92400E] font-extrabold text-[12px] mt-1 block">Flagged</span>
              </div>
              <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl">
                <span className="text-slate-600 font-black text-3xl font-mono block">
                  {questions.length - answeredIndices.size}
                </span>
                <span className="text-slate-700 font-extrabold text-[12px] mt-1 block">Unanswered</span>
              </div>
            </div>

            <div className="bg-[#FEFCE8] p-4 rounded-xl border border-[#FDE68A] text-[13px] text-slate-800 leading-relaxed font-medium">
              Once submitted, your responses will be locked and an authentic teacher-evaluated score certificate with official red-pen mark will be generated immediately.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="h-[46px] px-5 bg-white border-2 border-[#FDE68A] hover:bg-[#FEFCE8] rounded-xl text-[14px] font-bold text-slate-800 cursor-pointer shadow-xs"
              >
                Return to Paper
              </button>
              <button
                type="button"
                onClick={() => handleFinalSubmit("normal")}
                className="h-[46px] px-6 bg-[#547322] hover:bg-[#435C1B] text-white rounded-xl text-[14px] font-extrabold shadow-md shadow-[#547322]/20 cursor-pointer"
              >
                Confirm & Submit Paper
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
