/**
 * Structured operational logging.
 *
 * Every failure worth investigating is logged under a stable event code with the record ids
 * involved, so a support person can search the console (or a log drain later) for
 * `ATTEMPT_SUBMIT_FAILED examId=…` rather than reading stack traces. User-facing copy never
 * comes from here — see `userMessageFor` for that.
 *
 * Never put credentials, tokens or answer content in `context`.
 */

export type LogEvent =
  | "EXAM_LOAD_FAILED"
  | "ANSWER_SAVE_FAILED"
  | "SESSION_SYNC_FAILED"
  | "ATTEMPT_RESUME_FAILED"
  | "ATTEMPT_SUBMIT_FAILED"
  | "ATTEMPT_SUBMIT_QUEUED"
  | "RESULT_LOAD_FAILED"
  | "REPORT_GENERATION_FAILED"
  | "ACTIVITY_INIT_FAILED"
  | "FIRESTORE_QUERY_FAILED"
  | "FIRESTORE_WRITE_FAILED"
  | "AUTHORIZATION_FAILED"
  | "ROUTE_NOT_FOUND"
  | "UNHANDLED_UI_ERROR";

export interface LogContext {
  examId?: string;
  questionId?: string;
  attemptId?: string;
  sessionId?: string;
  operation?: string;
  [key: string]: unknown;
}

function describe(error: unknown): { code?: string; message?: string } {
  if (!error) return {};
  if (typeof error === "object") {
    const e = error as { code?: unknown; message?: unknown; name?: unknown };
    return {
      code: typeof e.code === "string" ? e.code : typeof e.name === "string" ? e.name : undefined,
      message: typeof e.message === "string" ? e.message : undefined,
    };
  }
  return { message: String(error) };
}

export function logError(event: LogEvent, context: LogContext = {}, error?: unknown): void {
  const entry = { event, at: new Date().toISOString(), ...context, ...describe(error) };
  // Kept as console.error so production builds (which strip log/info) still record it.
  console.error(`[${event}]`, entry, error ?? "");
}

export function logWarn(event: LogEvent, context: LogContext = {}, error?: unknown): void {
  const entry = { event, at: new Date().toISOString(), ...context, ...describe(error) };
  console.warn(`[${event}]`, entry);
}

/** Firestore/Auth error code, when the error carries one. */
export function errorCode(error: unknown): string {
  return (error && typeof error === "object" && typeof (error as { code?: unknown }).code === "string"
    ? (error as { code: string }).code
    : "") as string;
}

export function isPermissionDenied(error: unknown): boolean {
  const code = errorCode(error);
  return code === "permission-denied" || code === "firestore/permission-denied";
}

export function isOfflineError(error: unknown): boolean {
  const code = errorCode(error);
  return (
    code === "unavailable" ||
    code === "firestore/unavailable" ||
    code === "deadline-exceeded" ||
    code === "timeout" ||
    (typeof navigator !== "undefined" && navigator.onLine === false)
  );
}

/**
 * Plain-language explanation for a failure. Screens show this, never `error.message` —
 * a candidate should not be shown "FirebaseError: Missing or insufficient permissions".
 */
export function userMessageFor(error: unknown, subject = "this information"): string {
  if (isOfflineError(error)) {
    return `You appear to be offline, so ${subject} could not be loaded. Check your connection and try again.`;
  }
  if (isPermissionDenied(error)) {
    return `Your account does not have access to ${subject}. If you think this is wrong, ask your administrator.`;
  }
  return `Something went wrong while loading ${subject}. Please try again.`;
}

/** Rejects with a `timeout` error if `promise` has not settled within `ms`. */
export function withTimeout<T>(promise: Promise<T>, ms: number, operation = "operation"): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(Object.assign(new Error(`${operation} timed out after ${ms}ms`), { code: "timeout" }));
    }, ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}
