"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { examRepository, questionRepository, attemptRepository } from "@/repositories";
import { Exam } from "@/types/exam";
import { Question } from "@/types/question";
import { StudentMetadata } from "@/types/session";
import { getClientDeviceInfo } from "@/lib/deviceUtils";
import { ExamPersistenceService, ExamSessionState } from "@/services/persistence/ExamPersistenceService";
import { submitExam } from "@/services/exam/SubmissionService";
import { ExamHeader } from "@/components/examination/ExamHeader";
import { QuestionPalette } from "@/components/examination/QuestionPalette";
import { ExamButtonGuide } from "@/components/examination/ExamButtonGuide";
import { ExamNavigation } from "@/components/examination/ExamNavigation";
import { QuestionRenderer } from "@/components/questions/QuestionRenderer";
import { hasBespokeActivity } from "@/components/activities/ActivityRegistry";
import { StatusPanel } from "@/components/feedback/StatusPanel";
import { AppLoading } from "@/components/auth/AppLoading";
import { useExamSyncStatus } from "@/hooks/useExamSyncStatus";
import { ShieldAlert, ArrowRight, ArrowLeft, BookOpen, RotateCcw, History, Check, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ExamLockService } from "@/services/exam/ExamLockService";
import { ROLE_PREFIX } from "@/lib/auth/sections";
import { resultRoute } from "@/lib/routes";
import { logError, logWarn, userMessageFor } from "@/lib/logger";

/**
 * The examination paper.
 *
 * Reliability rules this screen follows:
 *
 *   • It never navigates away on its own except to the score paper after submitting.
 *     A load failure, a missing paper or a lock all render here, with a way forward.
 *   • A sitting belongs to the signed-in account (`studentId` = uid) and has one
 *     deterministic session id, so it is found again after a refresh, a crash, a closed
 *     tab or on another device — and resumed exactly where it was left.
 *   • The clock is the session's start timestamp, not a counter: refreshes, sleeping
 *     laptops and throttled background tabs do not change the time left. An expired
 *     sitting is submitted with what was saved; it is never re-opened with fresh time.
 *   • Every change is saved locally at once and mirrored to the cloud on a schedule.
 *   • Submission happens exactly once (see SubmissionService) and survives being
 *     interrupted.
 */

type Phase =
  | { kind: "loading" }
  | { kind: "error"; error: unknown }
  | { kind: "notfound" }
  | { kind: "empty" }
  | { kind: "locked" }
  | { kind: "submitted"; attemptId?: string }
  | { kind: "exhausted"; attemptId?: string }
  | { kind: "recover"; session: ExamSessionState }
  | { kind: "intro" }
  | { kind: "running" }
  | { kind: "finalising" };

type SubmitState = { kind: "idle" } | { kind: "submitting" } | { kind: "failed"; message: string };

const isAnswered = (v: unknown) => v !== undefined && v !== null && v !== "";

/** Short display code for the roll number, derived from the account so it is stable. */
const rollNumberFor = (uid: string) => `STU-${uid.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase()}`;

export default function ExamSessionClient({ examId }: { examId: string }) {
  const router = useRouter();
  const { activeRole, user } = useAuth();
  const isStaff = activeRole !== "STUDENT";
  const examsHome = `${ROLE_PREFIX[activeRole]}/exams`;
  const uid = user?.id ?? "";
  const rollNumber = uid ? rollNumberFor(uid) : "";

  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [reloadKey, setReloadKey] = useState(0);
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Candidate details (prefilled from the account)
  const [candidateName, setCandidateName] = useState(user?.name ?? "");
  const [schoolName, setSchoolName] = useState(user?.schoolName ?? "");

  // Sitting state
  const [sessionId, setSessionId] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [activityStates, setActivityStates] = useState<Record<string, unknown>>({});
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set());
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set());
  const [timeSpentMap, setTimeSpentMap] = useState<Record<string, number>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [questionView, setQuestionView] = useState<"activity" | "standard">("activity");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [lockVersion, setLockVersion] = useState(0);
  /** Sittings this candidate has used on the paper, the limit, and the number of the next one. */
  const [sitting, setSitting] = useState<{ used: number; max: number | null; next: number }>({
    used: 0,
    max: null,
    next: 1,
  });
  const me = useMemo(
    () => ({ id: uid, email: user?.email, name: user?.name, grade: user?.grade }),
    [uid, user?.email, user?.name, user?.grade]
  );
  /** Staff preview any paper; a candidate needs it unlocked for their class, or assigned to them. */
  const isBlocked = useCallback(
    (paperId: string) => !isStaff && !ExamLockService.isExamAccessibleToStudent(paperId, me),
    [isStaff, me]
  );

  const questionScrollRef = useRef<HTMLDivElement>(null);
  const [deviceInfo] = useState(() => getClientDeviceInfo());
  const sync = useExamSyncStatus();

  const currentQuestion = questions[currentIndex];
  const running = phase.kind === "running";

  /* ── Latest-state mirror ──────────────────────────────────
     Timers, unload handlers and the submit path read from here, so they always see the
     newest answers — never the values captured when an effect last ran. (The previous
     auto-submit read answers from a stale closure and could drop recent work.) */
  const live = useRef({
    exam: null as Exam | null,
    questions: [] as Question[],
    sessionId: "",
    startedAt: "",
    currentIndex: 0,
    answers: {} as Record<string, unknown>,
    activityStates: {} as Record<string, unknown>,
    visitedIds: new Set<string>(),
    markedIds: new Set<string>(),
    timeSpentMap: {} as Record<string, number>,
    candidateName: "",
    schoolName: "",
    version: 0,
  });
  live.current = {
    ...live.current,
    exam,
    questions,
    sessionId,
    startedAt,
    currentIndex,
    answers,
    activityStates,
    visitedIds,
    markedIds,
    timeSpentMap,
    candidateName,
    schoolName,
  };

  const buildSession = useCallback((): ExamSessionState | null => {
    const s = live.current;
    if (!s.exam || !s.sessionId) return null;
    const q = s.questions[s.currentIndex];
    const now = new Date().toISOString();
    return {
      sessionId: s.sessionId,
      examId: s.exam.id,
      examTitle: s.exam.title,
      studentId: uid,
      studentName: s.candidateName,
      rollNumber,
      schoolName: s.schoolName,
      grade: user?.grade ?? s.exam.grade ?? 6,
      device: deviceInfo,
      startedAt: s.startedAt,
      durationMinutes: s.exam.durationMinutes || 60,
      lastSavedAt: now,
      currentQuestionIndex: s.currentIndex,
      currentQuestionId: q?.id ?? "",
      answers: Object.fromEntries(
        Object.entries(s.answers).map(([qId, ans]) => [
          qId,
          { questionId: qId, answer: ans, activityState: s.activityStates[qId], lastModifiedAt: now },
        ])
      ),
      activityStates: s.activityStates,
      completedQuestions: Object.keys(s.answers),
      visitedQuestions: Array.from(s.visitedIds),
      markedForReview: Array.from(s.markedIds),
      timeSpentMap: s.timeSpentMap,
      timeRemainingSeconds: ExamPersistenceService.calculateTrueRemainingTime({
        startedAt: s.startedAt,
        durationMinutes: s.exam.durationMinutes || 60,
      }),
      totalTimeSeconds: (s.exam.durationMinutes || 60) * 60,
      status: "in_progress",
      version: s.version,
    };
  }, [uid, rollNumber, user?.grade, deviceInfo]);

  const saveNow = useCallback(
    (opts: { remoteNow?: boolean } = {}) => {
      const session = buildSession();
      if (!session) return;
      live.current.version += 1;
      void ExamPersistenceService.saveProgress(session, opts);
    },
    [buildSession]
  );

  /* ── Submission ──────────────────────────────────────────── */

  const submittingRef = useRef(false);

  const finalise = useCallback(
    async (session: ExamSessionState, paper: Exam, paperQuestions: Question[], reason: "normal" | "auto_timeout") => {
      const answerValues = Object.fromEntries(
        Object.entries(session.answers || {}).map(([qId, a]) => [qId, a?.answer])
      );
      const student: StudentMetadata = {
        name: session.studentName || user?.name || "Candidate",
        studentId: uid,
        rollNumber: session.rollNumber || rollNumber,
        schoolName: session.schoolName || user?.schoolName || "",
        grade: session.grade ?? paper.grade,
      };
      const outcome = await submitExam({
        session,
        exam: paper,
        questions: paperQuestions,
        answers: answerValues,
        timeSpentMap: session.timeSpentMap || {},
        student,
        device: session.device || deviceInfo,
        submissionType: reason,
      });
      // replace, not push: Back from the score paper must not reopen a submitted paper.
      router.replace(resultRoute(outcome.attemptId));
    },
    [router, uid, rollNumber, user?.name, user?.schoolName, deviceInfo]
  );

  const handleFinalSubmit = useCallback(
    async (reason: "normal" | "auto_timeout" = "normal") => {
      const paper = live.current.exam;
      if (submittingRef.current || !paper) return;
      submittingRef.current = true;
      setSubmitState({ kind: "submitting" });
      try {
        const session = buildSession();
        if (!session) throw new Error("Session not initialised");
        // Freeze the answers on this device before anything touches the network.
        await ExamPersistenceService.saveLocal(session);
        await finalise(session, paper, live.current.questions, reason);
      } catch (err) {
        logError("ATTEMPT_SUBMIT_FAILED", { examId: paper.id, sessionId: live.current.sessionId, reason }, err);
        submittingRef.current = false;
        setSubmitState({
          kind: "failed",
          message:
            "Your answers are saved on this device, but the paper could not be submitted just now. Please try again.",
        });
      }
    },
    [buildSession, finalise]
  );

  /* ── Load ────────────────────────────────────────────────── */

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setPhase({ kind: "loading" });
      if (!examId) {
        setPhase({ kind: "notfound" });
        return;
      }
      try {
        const [paper] = await Promise.all([examRepository.getExam(examId), ExamLockService.whenReady()]);
        if (cancelled) return;
        if (!paper) {
          setPhase({ kind: "notfound" });
          return;
        }
        const paperQuestions = await questionRepository.getQuestionsByIds(paper.questionIds || []);
        if (cancelled) return;
        if (paperQuestions.length < (paper.questionIds || []).length) {
          logWarn("EXAM_LOAD_FAILED", {
            examId,
            operation: "questions-missing",
            expected: paper.questionIds.length,
            found: paperQuestions.length,
          });
        }
        setExam(paper);
        setQuestions(paperQuestions);
        if (paperQuestions.length === 0) {
          setPhase({ kind: "empty" });
          return;
        }

        // Sittings already filed for this paper. Each sitting has its own session
        // (..._att1, ..._att2, ...), so a new one never collides with a submitted one.
        let filed: { id: string }[] = [];
        if (uid) {
          try {
            const mine = await attemptRepository.listAttempts({ ownerUid: uid });
            filed = mine.filter((a) => a.examId === paper.id);
          } catch (e) {
            logWarn("EXAM_LOAD_FAILED", { examId, operation: "countAttempts" }, e);
          }
        }
        if (cancelled) return;

        let attemptNumber = filed.length + 1;
        let lastAttemptId: string | undefined = filed[0]?.id;
        let existing = uid ? await ExamPersistenceService.findSession(examId, uid, attemptNumber) : null;
        // A sitting submitted on this device but not yet counted (offline upload, stale
        // read) still uses up its number.
        while (
          existing &&
          (existing.status === "submitted" || existing.status === "completed") &&
          attemptNumber < filed.length + 12
        ) {
          lastAttemptId = existing.attemptId || lastAttemptId;
          attemptNumber += 1;
          existing = await ExamPersistenceService.findSession(examId, uid, attemptNumber);
        }
        if (cancelled) return;

        const used = attemptNumber - 1;
        const max = ExamLockService.getMaxAttempts(paper.id);
        setSitting({ used, max, next: attemptNumber });

        if (existing && (existing.status === "submitted" || existing.status === "completed")) {
          // Never re-open a submitted sitting.
          setPhase({ kind: "exhausted", attemptId: existing.attemptId });
          return;
        }

        const isRetakeRequested =
          typeof window !== "undefined" &&
          (new URLSearchParams(window.location.search).get("retake") === "1" ||
            new URLSearchParams(window.location.search).get("mode") === "retake");

        if (existing?.status === "submitting") {
          // Interrupted mid-submit: finish uploading the same attempt.
          setPhase({ kind: "finalising" });
          submittingRef.current = true;
          await finalise(existing, paper, paperQuestions, existing.submissionType === "auto_timeout" ? "auto_timeout" : "normal");
          return;
        }
        if (existing && existing.status === "in_progress") {
          if (ExamPersistenceService.calculateTrueRemainingTime(existing) <= 0) {
            // Time ran out while away: the saved answers are submitted as they stand.
            setPhase({ kind: "finalising" });
            submittingRef.current = true;
            await finalise(existing, paper, paperQuestions, "auto_timeout");
            return;
          }
          setPhase({ kind: "recover", session: existing });
          return;
        }

        if (isBlocked(paper.id)) {
          setPhase({ kind: "locked" });
          return;
        }
        if (used > 0 && !isStaff && max !== null && used >= max) {
          setPhase({ kind: "exhausted", attemptId: lastAttemptId });
          return;
        }
        if (used > 0 && !isRetakeRequested) {
          setPhase({ kind: "submitted", attemptId: lastAttemptId });
          return;
        }
        setPhase({ kind: "intro" });
      } catch (err) {
        if (cancelled) return;
        logError("EXAM_LOAD_FAILED", { examId }, err);
        submittingRef.current = false;
        setPhase({ kind: "error", error: err });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // `finalise` is stable for a given account; re-running the load on its identity
    // would restart a sitting mid-way.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, uid, reloadKey]);

  // A teacher unlocking the paper reaches a waiting candidate without a refresh.
  useEffect(() => ExamLockService.subscribe(() => setLockVersion((v) => v + 1)), []);
  useEffect(() => {
    if (!exam) return;
    // Re-run the load rather than jumping to the intro, so the attempt limit applies too.
    if (phase.kind === "locked" && !isBlocked(exam.id)) setReloadKey((k) => k + 1);
    if (phase.kind === "intro" && isBlocked(exam.id)) setPhase({ kind: "locked" });
    // A teacher changing the attempt limit reaches a candidate already on this page.
    if (
      (phase.kind === "intro" || phase.kind === "submitted" || phase.kind === "exhausted") &&
      ExamLockService.getMaxAttempts(exam.id) !== sitting.max
    ) {
      setReloadKey((k) => k + 1);
    }
  }, [lockVersion, phase.kind, exam, isBlocked, sitting.max]);

  /* ── Start / resume ──────────────────────────────────────── */

  const enterRunning = useCallback((session: ExamSessionState, paperQuestions: Question[]) => {
    const restoredAnswers: Record<string, unknown> = {};
    Object.entries(session.answers || {}).forEach(([qId, a]) => {
      if (isAnswered(a?.answer)) restoredAnswers[qId] = a.answer;
    });
    const maxIdx = Math.max(0, paperQuestions.length - 1);
    // Resume by question id first (robust to a reordered paper), then by index.
    const byId = paperQuestions.findIndex((q) => q.id === session.currentQuestionId);
    const idx = byId >= 0 ? byId : Math.min(Math.max(0, session.currentQuestionIndex || 0), maxIdx);

    setSessionId(session.sessionId);
    setStartedAt(session.startedAt);
    setCandidateName(session.studentName || user?.name || "");
    setSchoolName(session.schoolName || "");
    setAnswers(restoredAnswers);
    setActivityStates(session.activityStates || {});
    setCurrentIndex(idx);
    setVisitedIds(new Set([...(session.visitedQuestions || []), paperQuestions[idx]?.id].filter(Boolean) as string[]));
    setMarkedIds(new Set(session.markedForReview || []));
    setTimeSpentMap(session.timeSpentMap || {});
    setTimeRemainingSeconds(ExamPersistenceService.calculateTrueRemainingTime(session));
    live.current.version = session.version || 0;
    setPhase({ kind: "running" });
  }, [user?.name]);

  const handleResumeSession = () => {
    if (phase.kind !== "recover") return;
    enterRunning(phase.session, questions);
  };

  /** Staff only: discard a preview sitting and start again. Candidates cannot reset the clock. */
  const handleRestartPreview = async () => {
    if (phase.kind !== "recover" || !isStaff) return;
    await ExamPersistenceService.clearSession(phase.session.sessionId);
    setPhase({ kind: "intro" });
  };

  const handleStartExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam || starting || !uid) return;
    if (!candidateName.trim()) {
      setStartError("Please enter your full name as it should appear on your score paper.");
      return;
    }
    setStarting(true);
    setStartError(null);
    try {
      const session = await ExamPersistenceService.createSession({
        examId: exam.id,
        examTitle: exam.title,
        studentId: uid,
        studentName: candidateName.trim(),
        rollNumber,
        schoolName: schoolName.trim(),
        grade: user?.grade ?? exam.grade ?? 6,
        durationMinutes: exam.durationMinutes || 60,
        firstQuestionId: questions[0]?.id || "",
        device: deviceInfo,
        attemptNumber: sitting.next,
      });
      enterRunning(session, questions);
    } catch (err) {
      logError("EXAM_LOAD_FAILED", { examId: exam.id, operation: "createSession" }, err);
      setStartError("The examination could not be started on this device. Please try again.");
    } finally {
      setStarting(false);
    }
  };

  /* ── Autosave ────────────────────────────────────────────── */

  // Any answer, navigation or flag change is written to this device within ~0.5s.
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => saveNow(), 500);
    return () => clearTimeout(t);
  }, [running, answers, activityStates, currentIndex, visitedIds, markedIds, saveNow]);

  // Time-on-question changes every second; it is saved with the next change or every 15s.
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => saveNow(), 15_000);
    return () => clearInterval(t);
  }, [running, saveNow]);

  // Leaving, hiding or losing the tab: save now and push to the cloud if possible.
  useEffect(() => {
    if (!running) return;
    const flush = () => saveNow({ remoteNow: true });
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    const onOnline = () => {
      if (live.current.sessionId) void ExamPersistenceService.flushRemote(live.current.sessionId);
    };
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("online", onOnline);
    };
  }, [running, saveNow]);

  /* ── Clock ───────────────────────────────────────────────── */

  useEffect(() => {
    if (!running || !startedAt || !exam) return;
    let lastTick = Date.now();
    const tick = () => {
      const remaining = ExamPersistenceService.calculateTrueRemainingTime({
        startedAt,
        durationMinutes: exam.durationMinutes || 60,
      });
      setTimeRemainingSeconds(remaining);

      // Credit real elapsed time to the open question (capped, so a sleeping laptop
      // does not attribute an hour to one question).
      const now = Date.now();
      const elapsed = Math.min(5, Math.max(0, Math.round((now - lastTick) / 1000)));
      lastTick = now;
      const q = live.current.questions[live.current.currentIndex];
      if (q && elapsed > 0 && document.visibilityState === "visible") {
        setTimeSpentMap((prev) => ({ ...prev, [q.id]: (prev[q.id] || 0) + elapsed }));
      }

      if (remaining <= 0) void handleFinalSubmit("auto_timeout");
    };
    tick();
    const t = setInterval(tick, 1000);
    // Waking from sleep / returning to the tab re-reads the clock immediately.
    const onVisible = () => document.visibilityState === "visible" && tick();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [running, startedAt, exam, handleFinalSubmit]);

  /* ── Navigation within the paper ─────────────────────────── */

  const goTo = useCallback(
    (idx: number) => {
      const bounded = Math.min(Math.max(0, idx), Math.max(0, live.current.questions.length - 1));
      setCurrentIndex(bounded);
      const q = live.current.questions[bounded];
      if (q) setVisitedIds((prev) => (prev.has(q.id) ? prev : new Set(prev).add(q.id)));
    },
    []
  );

  useEffect(() => {
    questionScrollRef.current?.scrollTo({ top: 0 });
    setQuestionView("activity");
  }, [currentIndex]);

  const setMarked = (qId: string, marked: boolean) =>
    setMarkedIds((prev) => {
      if (prev.has(qId) === marked) return prev;
      const next = new Set(prev);
      if (marked) next.add(qId);
      else next.delete(qId);
      return next;
    });

  const handleSaveAndNext = () => {
    if (!currentQuestion) return;
    setMarked(currentQuestion.id, false);
    goTo(currentIndex + 1);
  };

  const handleSaveAndMarkForReview = () => {
    if (!currentQuestion) return;
    setMarked(currentQuestion.id, true);
    goTo(currentIndex + 1);
  };

  const handleMarkForReviewAndNext = handleSaveAndMarkForReview;

  const handleClearResponse = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    setAnswers((prev) => {
      if (!(qId in prev)) return prev;
      const next = { ...prev };
      delete next[qId];
      return next;
    });
    setActivityStates((prev) => {
      if (!(qId in prev)) return prev;
      const next = { ...prev };
      delete next[qId];
      return next;
    });
    setMarked(qId, false);
  };

  /**
   * Records an answer for one specific question. Bound per question (below), so an
   * activity that reports after the candidate has moved on — an animation finishing, a
   * die settling — still writes to its own question, never to the one now on screen.
   */
  const recordAnswer = useCallback((qId: string, val: unknown, actState?: unknown) => {
    if (submittingRef.current) return;
    const reset = val === undefined && actState === undefined;
    setAnswers((prev) => {
      if (!isAnswered(val)) {
        if (!(qId in prev)) return prev;
        const next = { ...prev };
        delete next[qId];
        return next;
      }
      return { ...prev, [qId]: val };
    });
    setActivityStates((prev) => {
      if (reset) {
        if (!(qId in prev)) return prev;
        const next = { ...prev };
        delete next[qId];
        return next;
      }
      return actState === undefined ? prev : { ...prev, [qId]: actState };
    });
  }, []);

  const currentQuestionId = currentQuestion?.id;
  const handleAnswerChange = useMemo(
    () => (val: unknown, actState?: unknown) => {
      if (currentQuestionId) recordAnswer(currentQuestionId, val, actState);
    },
    [currentQuestionId, recordAnswer]
  );

  /* ── Sections ────────────────────────────────────────────── */

  const sections = useMemo(() => {
    if (!exam || questions.length === 0) {
      return [{ id: "sec_default", title: "General Questions", startIdx: 0, endIdx: Math.max(0, questions.length - 1), count: questions.length }];
    }

    if (exam.sections && exam.sections.length > 0) {
      const mapped: { id: string; title: string; startIdx: number; endIdx: number; count: number }[] = [];
      let runningIdx = 0;
      for (let sIdx = 0; sIdx < exam.sections.length; sIdx++) {
        const sec = exam.sections[sIdx];
        const secQIds = new Set(sec.questionIds || []);
        const matchedIndices: number[] = [];
        questions.forEach((q, qIdx) => {
          if (secQIds.has(q.id) || secQIds.has(q.questionId) || q.section === sec.title) matchedIndices.push(qIdx);
        });
        if (matchedIndices.length > 0) {
          mapped.push({
            id: sec.id || `sec_${sIdx}`,
            title: sec.title,
            startIdx: Math.min(...matchedIndices),
            endIdx: Math.max(...matchedIndices),
            count: matchedIndices.length,
          });
        } else if (sec.questionIds && sec.questionIds.length > 0) {
          const count = sec.questionIds.length;
          mapped.push({ id: sec.id || `sec_${sIdx}`, title: sec.title, startIdx: runningIdx, endIdx: runningIdx + count - 1, count });
          runningIdx += count;
        }
      }
      if (mapped.length > 0) return mapped;
    }

    const derived: { id: string; title: string; startIdx: number; endIdx: number; count: number }[] = [];
    let curTitle = "";
    let curStart = 0;
    questions.forEach((q, idx) => {
      const secTitle = q.section || "Questions";
      if (secTitle !== curTitle) {
        if (curTitle) {
          derived.push({ id: `sec_${derived.length}`, title: curTitle, startIdx: curStart, endIdx: idx - 1, count: idx - curStart });
        }
        curTitle = secTitle;
        curStart = idx;
      }
    });
    if (curTitle) {
      derived.push({ id: `sec_${derived.length}`, title: curTitle, startIdx: curStart, endIdx: questions.length - 1, count: questions.length - curStart });
    }
    return derived.length > 0
      ? derived
      : [{ id: "sec_all", title: "All Questions", startIdx: 0, endIdx: questions.length - 1, count: questions.length }];
  }, [exam, questions]);

  const currentSection = useMemo(
    () =>
      sections.find((sec) => currentIndex >= sec.startIdx && currentIndex <= sec.endIdx) ||
      sections[0] || {
        id: "sec_default",
        title: exam?.subjectName ? `${exam.subjectName} Examination` : "Examination Section",
        startIdx: 0,
        endIdx: Math.max(0, questions.length - 1),
        count: questions.length,
      },
    [currentIndex, sections, exam, questions.length]
  );

  const indexById = useMemo(() => new Map(questions.map((q, i) => [q.id, i])), [questions]);
  const toIndices = (ids: Set<string>) => {
    const out = new Set<number>();
    ids.forEach((id) => {
      const i = indexById.get(id);
      if (i !== undefined) out.add(i);
    });
    return out;
  };
  const answeredIndices = useMemo(
    () => new Set(questions.map((q, idx) => (isAnswered(answers[q.id]) ? idx : -1)).filter((idx) => idx !== -1)),
    [questions, answers]
  );
  const visitedIndices = useMemo(() => toIndices(visitedIds), [visitedIds, indexById]); // eslint-disable-line react-hooks/exhaustive-deps
  const markedForReviewIndices = useMemo(() => toIndices(markedIds), [markedIds, indexById]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Render: states before the paper ─────────────────────── */

  const retry = () => {
    submittingRef.current = false;
    setReloadKey((n) => n + 1);
  };
  const backToExams = { label: "Back to my examinations", href: examsHome };

  if (phase.kind === "loading") return <AppLoading label="Loading the examination paper" />;
  if (phase.kind === "finalising") return <AppLoading label="Submitting your paper — please keep this page open" />;

  if (phase.kind === "error") {
    return (
      <StatusPanel
        title="Unable to load this examination"
        message={`${userMessageFor(phase.error, "the examination")} Any answers you have already given are saved.`}
        actions={[backToExams, { label: "Retry", onClick: retry, primary: true }]}
      />
    );
  }

  if (phase.kind === "notfound" || !exam) {
    return (
      <StatusPanel
        tone="notfound"
        title="Examination not found"
        message="No examination matches this link. It may have been withdrawn, or the link is incomplete."
        actions={[backToExams]}
      />
    );
  }

  if (phase.kind === "empty") {
    return (
      <StatusPanel
        title="This paper has no questions yet"
        message="The examination exists but none of its questions could be loaded. Please let your teacher know."
        actions={[backToExams, { label: "Retry", onClick: retry, primary: true }]}
      />
    );
  }

  if (phase.kind === "submitted" || phase.kind === "exhausted") {
    const left = sitting.max === null ? null : Math.max(0, sitting.max - sitting.used);
    const canRetake = phase.kind === "submitted" && (isStaff || left === null || left > 0);
    const usage =
      sitting.max === null
        ? `You have used ${sitting.used} attempt${sitting.used === 1 ? "" : "s"}; your teacher allows unlimited attempts.`
        : `You have used ${sitting.used} of ${sitting.max} attempt${sitting.max === 1 ? "" : "s"}.`;
    return (
      <StatusPanel
        tone="info"
        title={canRetake ? "Examination Paper Completed" : "All attempts used"}
        message={
          canRetake
            ? `Your score report has been generated and saved. ${usage}`
            : `${usage} Your teacher can allow more attempts if needed.`
        }
        actions={[
          ...(phase.attemptId ? [{ label: "View Score Report", href: resultRoute(phase.attemptId), primary: true }] : []),
          ...(canRetake
            ? [
                {
                  label: left === null || isStaff ? "Take Examination Again" : `Take Examination Again (${left} left)`,
                  primary: !phase.attemptId,
                  onClick: () => setPhase({ kind: "intro" }),
                },
              ]
            : []),
          backToExams,
        ]}
      />
    );
  }

  if (phase.kind === "locked") {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-lg text-center space-y-5 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-2xs">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">This examination is not open yet</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong className="text-slate-800">{exam.title}</strong> is currently locked by your teacher. This page
              will open the paper automatically as soon as it is unlocked.
            </p>
          </div>
          <Link
            href={examsHome}
            className="inline-flex py-3 px-5 bg-[#2468B2] hover:bg-[#1C5190] text-white font-bold rounded-xl text-xs items-center justify-center gap-2 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to my examinations</span>
          </Link>
        </div>
      </div>
    );
  }

  if (phase.kind === "recover") {
    const saved = phase.session;
    let formattedSavedTime = "Recently";
    const d = new Date(saved.lastSavedAt);
    if (!isNaN(d.getTime())) formattedSavedTime = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const trueRemaining = ExamPersistenceService.calculateTrueRemainingTime(saved);
    const mins = Math.floor(trueRemaining / 60);
    const secs = trueRemaining % 60;
    const formattedRemaining = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    const totalQCount = questions.length;
    const resumeIdx = questions.findIndex((q) => q.id === saved.currentQuestionId);
    const resumeQuestionNumber = Math.min((resumeIdx >= 0 ? resumeIdx : saved.currentQuestionIndex ?? 0) + 1, totalQCount);
    const answeredCount = Object.values(saved.answers || {}).filter((a) => isAnswered(a?.answer)).length;
    const progressPercent = Math.min(100, Math.max(4, Math.round((resumeQuestionNumber / Math.max(1, totalQCount)) * 100)));

    const isEnglish =
      (exam.subjectId || "").includes("eng") ||
      (exam.subjectName || "").toLowerCase().includes("english") ||
      (exam.code || "").toLowerCase().includes("ieo");
    const themeColor = isEnglish ? "#9333EA" : "#2468B2";
    const themeBg = isEnglish ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-[#2468B2] border-blue-200";
    const themeButton = isEnglish
      ? "bg-[#9333EA] hover:bg-[#7E22CE] text-white shadow-md shadow-purple-200"
      : "bg-[#2468B2] hover:bg-[#1C5190] text-white shadow-md shadow-blue-200";

    return (
      <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4 font-sans select-none">
        <div className="bg-white rounded-3xl border-2 border-slate-300 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-start gap-4 border-b border-slate-200 pb-5">
            <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center shrink-0 shadow-xs ${themeBg}`}>
              {isEnglish ? <BookOpen className="w-7 h-7" /> : <History className="w-7 h-7" />}
            </div>
            <div className="min-w-0 flex-1">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${themeBg}`}>
                {isEnglish ? "English Olympiad (IEO)" : "Mathematics Olympiad (IMO)"} · Grade {exam.grade || 6}
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1 leading-snug">Continue your examination</h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Your answers are saved. You will continue exactly where you left off, and the clock has kept running.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs text-slate-800">
            <div className="flex justify-between items-center gap-3 py-1 border-b border-slate-200/80">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Examination Paper</span>
              <span className="font-extrabold text-slate-900 text-right truncate max-w-[240px]">{exam.title}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Candidate</span>
              <span className="font-extrabold text-slate-900">{saved.studentName || user?.name}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Last Saved At</span>
              <span className="font-mono font-bold text-slate-700">{formattedSavedTime}</span>
            </div>
            <div className="py-1 border-b border-slate-200/80 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Current Position</span>
                <span className="font-bold text-slate-900">
                  Question <strong className="font-black">{resumeQuestionNumber}</strong> of {totalQCount}
                  <span className="text-slate-500 font-normal ml-1.5 font-mono">({answeredCount} answered)</span>
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%`, backgroundColor: themeColor }} />
              </div>
            </div>
            <div className="flex justify-between items-center pt-0.5">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Time Remaining</span>
              <span className="font-mono font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-sm">
                {formattedRemaining}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={handleResumeSession}
              className={`w-full h-11 px-6 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider ${themeButton}`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Resume This Examination</span>
            </button>

            {isStaff && (
              <button
                type="button"
                onClick={handleRestartPreview}
                className="w-full h-11 px-4 bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Discard this preview and start again (staff only)</span>
              </button>
            )}

            <Link
              href={examsHome}
              className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to my examinations</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (phase.kind === "intro") {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex flex-col justify-between select-none font-sans">
        <header className="bg-[#2468B2] text-white py-3.5 px-4 sm:px-6 border-b-2 border-[#1C5190] shadow">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 shrink-0 rounded-lg bg-white text-[#2468B2] flex items-center justify-center font-black text-lg">&Omega;</span>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-amber-300 font-bold">Examination Portal</div>
                <div className="text-base font-extrabold text-white truncate">{exam.title}</div>
              </div>
            </div>
            <Link
              href={examsHome}
              className="shrink-0 text-xs font-bold text-white/80 hover:text-white flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-6 my-6">
          <div className="bg-white rounded-2xl border-2 border-slate-300 p-5 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2468B2]">Official Level-1 Examination Paper</span>
              <h1 className="text-2xl font-black text-slate-900 mt-2">{exam.title}</h1>
              {exam.subtitle && <p className="text-sm text-slate-600 mt-1 font-medium">{exam.subtitle}</p>}
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <div>
                <span className="text-xs text-slate-500 font-bold block">Duration</span>
                <strong className="text-slate-900 text-base sm:text-lg font-mono font-black">{exam.durationMinutes} Mins</strong>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold block">Questions</span>
                <strong className="text-slate-900 text-base sm:text-lg font-mono font-black">{questions.length} Items</strong>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold block">Max Marks</span>
                <strong className="text-[#2468B2] text-base sm:text-lg font-mono font-black">+{exam.totalMarks}</strong>
              </div>
            </div>

            <form onSubmit={handleStartExam} className="space-y-4">
              <div>
                <label htmlFor="c-name" className="text-xs font-bold text-slate-800 mb-1 block uppercase">
                  Candidate Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  id="c-name"
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full h-11 px-3 text-sm bg-white border-2 border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-none focus:border-[#2468B2]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="c-id" className="text-xs font-bold text-slate-800 mb-1 block uppercase">
                    Roll Number
                  </label>
                  <input
                    id="c-id"
                    type="text"
                    disabled
                    value={rollNumber}
                    className="w-full h-11 px-3 text-sm bg-slate-100 border border-slate-300 rounded-lg font-mono font-bold text-[#2468B2]"
                  />
                </div>
                <div>
                  <label htmlFor="s-name" className="text-xs font-bold text-slate-800 mb-1 block uppercase">
                    School Name (Optional)
                  </label>
                  <input
                    id="s-name"
                    type="text"
                    placeholder="e.g. Kendriya Vidyalaya No. 1"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full h-11 px-3 text-sm bg-white border-2 border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-[#2468B2]"
                  />
                </div>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-xs text-slate-800 space-y-2">
                <div className="font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-amber-700" /> Examination Instructions
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>The timer starts when you press Start and keeps running even if you close this page.</li>
                  <li>Use <strong>Save &amp; Next</strong> to confirm answers, or <strong>Save &amp; Mark for Review</strong> to flag a question while keeping its answer.</li>
                  <li>Every answer is saved automatically. If your connection drops or the page closes, open the paper again to continue where you left off.</li>
                  <li>The paper is submitted automatically when time runs out. You can submit only once.</li>
                </ul>
              </div>

              {startError && (
                <p role="alert" className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2.5">
                  {startError}
                </p>
              )}

              <button
                type="submit"
                disabled={starting}
                className="w-full h-12 bg-[#55B987] hover:bg-[#3E9E6F] active:bg-[#33875C] disabled:opacity-60 text-white rounded-lg text-base font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                <span>{starting ? "Starting…" : "Enter & Start Examination"}</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  /* ── Render: the paper ───────────────────────────────────── */

  const submitting = submitState.kind === "submitting";

  return (
    <div className="h-dvh w-full bg-[#F4F7FB] flex flex-col overflow-hidden select-none font-sans">
      <ExamHeader
        olympiadTitle={exam.title}
        examCode={exam.code}
        candidateName={candidateName}
        candidateId={rollNumber}
        timeRemainingSeconds={timeRemainingSeconds}
        sync={sync}
      />

      <main className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-[1750px] mx-auto px-3 sm:px-5 py-3 sm:py-4 lg:h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start lg:items-stretch lg:h-full">
            <div className="lg:col-span-8 xl:col-span-9 bg-white border-2 border-slate-300 rounded-xl shadow-md flex flex-col overflow-hidden lg:min-h-0">
              <div className="shrink-0 bg-slate-100 border-b-2 border-slate-300 px-4 py-2 flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0 mr-2">Sections:</span>
                {sections.map((sec) => {
                  const isActive = currentSection.id === sec.id;
                  const answeredInSection = questions
                    .slice(sec.startIdx, sec.endIdx + 1)
                    .filter((q) => isAnswered(answers[q.id])).length;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => goTo(sec.startIdx)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                        isActive ? "bg-[#2468B2] text-white border-[#1C5190] shadow-subtle" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      <span>{sec.title}</span>
                      <span className={`text-[10px] px-1.5 rounded font-mono ${isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`}>
                        {answeredInSection}/{sec.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="shrink-0 px-3 sm:px-5 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaletteOpen(true)}
                    className="lg:hidden h-9 px-2.5 rounded-lg bg-[#2468B2] text-white text-[11px] font-bold flex items-center gap-1"
                    title="Open the question palette"
                  >
                    ☰ Questions {answeredIndices.size}/{questions.length}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuideOpen(true)}
                    className="lg:hidden h-9 w-9 rounded-lg border border-slate-300 bg-white text-[#2468B2] font-black"
                    aria-label="How the controls work"
                  >
                    ?
                  </button>
                  <span className="text-sm font-black text-[#2468B2]">Question No. {currentIndex + 1}</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600 font-semibold">{currentSection.title}</span>
                </div>

                <div className="flex items-center gap-2.5 font-mono">
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Right: +{currentQuestion?.marks || 1}.00
                  </span>
                  <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Negative: -{currentQuestion?.negativeMarks || 0}.00
                  </span>
                  {currentQuestion && (hasBespokeActivity(currentQuestion.id) || hasBespokeActivity(currentQuestion.questionId)) && (
                    <div className="flex items-center gap-0.5 bg-[#EAF2FC] p-0.5 rounded-lg border border-[#E1E7EF] font-sans ml-1">
                      <button
                        type="button"
                        onClick={() => setQuestionView("activity")}
                        className={`px-2 py-0.5 text-[11px] font-bold rounded transition-all cursor-pointer ${
                          questionView === "activity" ? "bg-[#2468B2] text-white shadow-subtle" : "text-[#1C5190] hover:bg-[#E1E7EF]"
                        }`}
                      >
                        Interactive
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuestionView("standard")}
                        className={`px-2 py-0.5 text-[11px] font-bold rounded transition-all cursor-pointer ${
                          questionView === "standard" ? "bg-slate-700 text-white shadow-subtle" : "text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Standard
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div ref={questionScrollRef} className="p-4 sm:p-5 flex-1 space-y-4 lg:min-h-0 lg:overflow-y-auto">
                {currentQuestion ? (
                  // Keyed per question: every question mounts its own renderer, so no
                  // component state can carry over from the previous question.
                  <QuestionRenderer
                    key={currentQuestion.id}
                    question={currentQuestion}
                    value={answers[currentQuestion.id]}
                    activityState={activityStates[currentQuestion.id]}
                    onChange={handleAnswerChange}
                    readOnly={submitting}
                    showMetadata={false}
                    activeView={questionView}
                    onToggleView={setQuestionView}
                  />
                ) : (
                  <div className="p-8 text-center text-slate-400">Question not loaded.</div>
                )}
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-4 xl:col-span-3 lg:min-h-0">
              <QuestionPalette
                onOpenGuide={() => setGuideOpen(true)}
                questions={questions}
                currentIndex={currentIndex}
                visitedIndices={visitedIndices}
                answeredIndices={answeredIndices}
                markedForReviewIndices={markedForReviewIndices}
                activeSectionId={currentSection.id}
                onSelectIndex={goTo}
                onSubmitExam={() => setShowConfirmModal(true)}
                candidateName={candidateName}
                candidateId={rollNumber}
              />
            </div>
          </div>
        </div>
      </main>

      <ExamNavigation
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        onSaveAndNext={handleSaveAndNext}
        onSaveAndMarkForReview={handleSaveAndMarkForReview}
        onMarkForReviewAndNext={handleMarkForReviewAndNext}
        onClearResponse={handleClearResponse}
        onPrevious={() => goTo(currentIndex - 1)}
        onNext={() => goTo(currentIndex + 1)}
        onSubmitExam={() => setShowConfirmModal(true)}
      />

      {paletteOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setPaletteOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-[min(380px,94vw)] p-2" onClick={(e) => e.stopPropagation()}>
            <QuestionPalette
              questions={questions}
              currentIndex={currentIndex}
              visitedIndices={visitedIndices}
              answeredIndices={answeredIndices}
              markedForReviewIndices={markedForReviewIndices}
              activeSectionId={currentSection.id}
              onSelectIndex={(idx) => {
                goTo(idx);
                setPaletteOpen(false);
              }}
              onSubmitExam={() => {
                setPaletteOpen(false);
                setShowConfirmModal(true);
              }}
              onOpenGuide={() => setGuideOpen(true)}
              onClose={() => setPaletteOpen(false)}
              candidateName={candidateName}
              candidateId={rollNumber}
            />
          </div>
        </div>
      )}

      <ExamButtonGuide open={guideOpen} onClose={() => setGuideOpen(false)} />

      {(showConfirmModal || submitState.kind !== "idle") && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-xl w-full p-5 sm:p-6 space-y-5 max-h-[92dvh] overflow-y-auto">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-black text-slate-900">
                {submitting ? "Submitting your paper…" : "Summary of Examination Responses"}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {submitting
                  ? "Please keep this page open. Your answers are saved."
                  : "Review your section-wise tally before submitting. You can submit only once."}
              </p>
            </div>

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
                    const ansCount = secQuestions.filter((q) => isAnswered(answers[q.id])).length;
                    const markedCount = secQuestions.filter((q) => markedIds.has(q.id)).length;
                    return (
                      <tr key={sec.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-semibold text-slate-900">{sec.title}</td>
                        <td className="p-2.5 text-center font-mono">{sec.count}</td>
                        <td className="p-2.5 text-center font-mono text-emerald-700">{ansCount}</td>
                        <td className="p-2.5 text-center font-mono text-rose-700">{sec.count - ansCount}</td>
                        <td className="p-2.5 text-center font-mono text-purple-700">{markedCount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-bold">
              <span>Overall Answered:</span>
              <span className="font-mono text-base text-emerald-700">
                {answeredIndices.size} / {questions.length} Questions
              </span>
            </div>

            {submitState.kind === "failed" && (
              <p role="alert" className="text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded-lg p-3">
                {submitState.message}
              </p>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-1">
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  setShowConfirmModal(false);
                  setSubmitState({ kind: "idle" });
                }}
                className="h-10 px-4 bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-50 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
              >
                No, Return to Paper
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleFinalSubmit("normal")}
                className="h-10 px-6 bg-[#55B987] hover:bg-[#3E9E6F] disabled:opacity-60 text-white rounded-lg text-xs font-black shadow transition-all cursor-pointer uppercase tracking-wide"
              >
                {submitting ? "Submitting…" : submitState.kind === "failed" ? "Try Submitting Again" : "Yes, Final Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
