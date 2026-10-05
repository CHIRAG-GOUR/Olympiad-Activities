/**
 * Record-level routes.
 *
 * The app is a static export (`output: "export"`), so a dynamic segment such as
 * `/exam/[examId]` only exists for the ids listed in `generateStaticParams` at build time.
 * Any other id — an exam created in the console, every submitted attempt, every question —
 * has no HTML file: Firebase Hosting rewrites it to `/index.html`, the root page resolves
 * the session and sends the person to their dashboard. That was the "random dashboard
 * redirect" on View Result, after submitting, and on opening any non-seed record.
 *
 * Records are therefore addressed by query string on fixed pages, which exist for every id.
 * Build every such link through these helpers so the scheme lives in one place.
 */

const withId = (path: string, id: string) => `${path}?id=${encodeURIComponent(id)}`;

/** The examination paper a candidate sits. */
export const examRoute = (examId: string) => withId("/exam", examId);

/** A submitted attempt's score paper. */
export const resultRoute = (attemptId: string) => withId("/results", attemptId);

/** Staff view of one examination, inside the caller's role group (e.g. "/admin"). */
export const examDetailRoute = (roleBase: string, examId: string) =>
  withId(`${roleBase}/exams/detail`, examId);

/** Staff question studio for one question, inside the caller's role group. */
export const questionDetailRoute = (roleBase: string, questionId: string) =>
  withId(`${roleBase}/questions/detail`, questionId);

/**
 * Maps a URL from the old dynamic-segment scheme onto the query-string scheme, so that
 * bookmarks and links already shared keep working. Returns null when the path is not one
 * of the old record routes.
 */
export function legacyRecordRoute(pathname: string): string | null {
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean).map(decodeURIComponent);
  if (parts.length === 2 && parts[0] === "exam") return examRoute(parts[1]);
  if (parts.length === 2 && parts[0] === "results") return resultRoute(parts[1]);
  if (
    parts.length === 3 &&
    (parts[0] === "admin" || parts[0] === "teacher") &&
    parts[1] === "exams" &&
    parts[2] !== "new" &&
    parts[2] !== "detail"
  ) {
    return examDetailRoute(`/${parts[0]}`, parts[2]);
  }
  if (
    parts.length === 3 &&
    (parts[0] === "admin" || parts[0] === "teacher") &&
    parts[1] === "questions" &&
    parts[2] !== "new" &&
    parts[2] !== "detail"
  ) {
    return questionDetailRoute(`/${parts[0]}`, parts[2]);
  }
  return null;
}

/**
 * Validates a post-login `next` destination. Only same-origin absolute paths are accepted —
 * never `//host`, a scheme, or the login page itself — so it cannot become an open redirect.
 */
export function safeNextPath(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return null;
  if (raw === "/" || raw.startsWith("/login")) return null;
  return raw;
}
