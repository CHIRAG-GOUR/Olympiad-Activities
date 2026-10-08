/**
 * Which sitting of a paper a candidate is on.
 *
 * Every sitting has its own session (`…_att1`, `…_att2`, …), so a retake never reuses or
 * overwrites an earlier sitting's saved answers, and progress for one paper never touches
 * another paper's. Filed attempts give the starting count; a sitting submitted on this
 * device but not yet uploaded still uses up its number.
 */

export interface SittingSessionLike {
  status: string;
  attemptId?: string;
}

export interface ResolvedSitting<S extends SittingSessionLike> {
  /** Sittings already used (submitted). */
  used: number;
  /** Number for the current or next sitting. */
  attemptNumber: number;
  /** The current sitting's session, if one exists (in progress or mid-submit). */
  current: S | null;
  /** Attempt id of the most recent submitted sitting, for "view score report". */
  lastAttemptId?: string;
}

/** Upper bound on how far past the filed count we probe for unsynced submitted sittings. */
const PROBE_LIMIT = 12;

const isDone = (s: SittingSessionLike | null) => Boolean(s && (s.status === "submitted" || s.status === "completed"));

export async function resolveSitting<S extends SittingSessionLike>(
  filedAttemptIds: string[],
  findSession: (attemptNumber: number) => Promise<S | null>
): Promise<ResolvedSitting<S>> {
  let attemptNumber = filedAttemptIds.length + 1;
  let lastAttemptId: string | undefined = filedAttemptIds[0];
  let current = await findSession(attemptNumber);
  while (isDone(current) && attemptNumber < filedAttemptIds.length + PROBE_LIMIT) {
    lastAttemptId = current!.attemptId || lastAttemptId;
    attemptNumber += 1;
    current = await findSession(attemptNumber);
  }
  if (isDone(current)) {
    // Never hand back a submitted sitting as the current one.
    lastAttemptId = current!.attemptId || lastAttemptId;
    return { used: attemptNumber, attemptNumber: attemptNumber + 1, current: null, lastAttemptId };
  }
  return { used: attemptNumber - 1, attemptNumber, current, lastAttemptId };
}

/** The sitting number encoded in a session id (`…_att3` → 3); 1 for legacy ids. */
export function sittingNumberFromSessionId(sessionId: string | undefined): number {
  const m = /_att(\d+)$/.exec(sessionId || "");
  return m ? Number(m[1]) : 1;
}
