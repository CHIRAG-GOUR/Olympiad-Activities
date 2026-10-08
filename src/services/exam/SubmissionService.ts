"use client";

import { attemptRepository, reportRepository } from "@/repositories";
import { evaluateAndGenerateFullResult } from "@/engine/scoring-engine";
import { idbClient } from "@/services/persistence/indexeddb";
import { ExamPersistenceService, type ExamSessionState } from "@/services/persistence/ExamPersistenceService";
import { logError, logWarn } from "@/lib/logger";
import { sittingNumberFromSessionId } from "@/lib/exam/sitting";
import type { Exam } from "@/types/exam";
import type { Question } from "@/types/question";
import type { ExamAttempt } from "@/types/attempt";
import type { ExamReport } from "@/types/report";
import type { DeviceInfo, StudentMetadata } from "@/types/session";

/**
 * Submitting a paper — exactly once, and never lost.
 *
 *   1. The session is marked `submitting` with its deterministic attempt id (locally).
 *   2. The attempt and report are computed once and stored on this device.
 *   3. Both are uploaded. Attempt ids are stable per sitting and the rules make a filed
 *      attempt read-only, so a repeated upload is a no-op, not a duplicate.
 *   4. Only once both are confirmed is the session marked `submitted`.
 *
 * If step 3 fails (offline, timeout) the submission stays queued on this device and is
 * retried when the connection returns or the app next opens — the candidate already has
 * their score paper from the local copy.
 */

export interface SubmitInput {
  session: ExamSessionState;
  exam: Exam;
  questions: Question[];
  answers: Record<string, unknown>;
  timeSpentMap: Record<string, number>;
  student: StudentMetadata;
  device: DeviceInfo;
  submissionType: "normal" | "auto_timeout" | "force_submit";
}

export interface SubmitOutcome {
  attemptId: string;
  /** False when the attempt is safe on this device but still waiting to upload. */
  uploaded: boolean;
}

let inFlight = new Map<string, Promise<SubmitOutcome>>();

async function upload(attempt: ExamAttempt, report: ExamReport): Promise<void> {
  await attemptRepository.saveAttempt(attempt);
  await reportRepository.saveReport(report);
}

export function submitExam(input: SubmitInput): Promise<SubmitOutcome> {
  const key = input.session.sessionId;
  // A double-click, an Enter key repeat and the timer reaching zero at the same moment all
  // collapse into the one submission already under way.
  const existing = inFlight.get(key);
  if (existing) return existing;

  const run = (async (): Promise<SubmitOutcome> => {
    const attemptId = input.session.attemptId || ExamPersistenceService.attemptIdFor(input.session);
    const submittedAt = input.session.submittedAt || new Date().toISOString();
    const session = await ExamPersistenceService.markSubmitting(input.session, attemptId, input.submissionType);

    // Reuse what an interrupted earlier try already computed, so the answers that were
    // frozen at the first submit are the ones that count.
    let attempt = await idbClient.get<ExamAttempt>("attempts", attemptId);
    let report = await idbClient.get<ExamReport>("reports", `rep_${attemptId}`);
    if (!attempt || !report) {
      // The sitting number is part of the session id, so it is exact even on a device that
      // has never seen this candidate's earlier sittings.
      const attemptNumber = sittingNumberFromSessionId(input.session.sessionId);

      const result = evaluateAndGenerateFullResult({
        exam: input.exam,
        questions: input.questions,
        answers: input.answers,
        timeSpentMap: input.timeSpentMap,
        student: input.student,
        device: input.device,
        startedAt: session.startedAt,
        submittedAt,
        submissionType: session.submissionType || input.submissionType,
        attemptId,
        attemptNumber,
      });
      attempt = {
        ...result.attempt,
        attemptNumber,
        ...(session.integrity ? { integrity: session.integrity } : {}),
      };
      report = result.report;
      await idbClient.put("attempts", attempt);
      await idbClient.put("reports", report);
    }

    try {
      await upload(attempt, report);
      await ExamPersistenceService.markSubmitted(session.sessionId);
      return { attemptId, uploaded: true };
    } catch (e) {
      logWarn("ATTEMPT_SUBMIT_QUEUED", { examId: input.exam.id, attemptId, sessionId: session.sessionId }, e);
      return { attemptId, uploaded: false };
    }
  })();

  inFlight.set(key, run);
  run.finally(() => inFlight.delete(key));
  return run;
}

/** Whether this attempt is stored on this device but not yet confirmed by the server. */
export async function isSubmissionPending(attemptId: string): Promise<boolean> {
  const pending = await ExamPersistenceService.pendingSubmissions();
  return pending.some((s) => s.attemptId === attemptId);
}

let retrying: Promise<number> | null = null;

/**
 * Uploads every queued submission made by this account on this device. Safe to call often
 * (app start, connection regained); concurrent calls share one run. Returns how many are
 * still waiting.
 */
export function retryPendingSubmissions(uid: string): Promise<number> {
  if (retrying) return retrying;
  retrying = (async () => {
    const pending = (await ExamPersistenceService.pendingSubmissions()).filter(
      (s) => s.studentId === uid || (s as ExamSessionState & { ownerUid?: string }).ownerUid === uid
    );
    let remaining = 0;
    for (const s of pending) {
      const attemptId = s.attemptId!;
      const attempt = await idbClient.get<ExamAttempt>("attempts", attemptId);
      const report = await idbClient.get<ExamReport>("reports", `rep_${attemptId}`);
      if (!attempt || !report) {
        // The computed result is missing on this device; this cannot be rebuilt without
        // the paper, so keep the session queued and record it for support.
        logError("ATTEMPT_SUBMIT_FAILED", { examId: s.examId, attemptId, sessionId: s.sessionId, operation: "retry-missing-local" });
        remaining++;
        continue;
      }
      try {
        await upload(attempt, report);
        await ExamPersistenceService.markSubmitted(s.sessionId);
      } catch (e) {
        logWarn("ATTEMPT_SUBMIT_QUEUED", { examId: s.examId, attemptId, sessionId: s.sessionId, operation: "retry" }, e);
        remaining++;
      }
    }
    return remaining;
  })().finally(() => {
    retrying = null;
  });
  return retrying;
}

/** Test seam: forget in-flight submissions. */
export function __resetSubmissionStateForTests() {
  inFlight = new Map();
}
