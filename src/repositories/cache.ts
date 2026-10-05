/**
 * Short-lived read cache shared by the Firestore repositories.
 *
 * The console's screens each load the same collections on mount (exams, questions, users,
 * attempts), so moving dashboard → exams → dashboard used to re-read every collection each
 * time, and two components mounting together issued the same query twice. Reads are now
 * de-duplicated while in flight and reused for a short window. Any write through a
 * repository invalidates the affected keys, and signing out clears everything, so one
 * person's data can never be served to the next person on a shared machine.
 */

interface Entry {
  at: number;
  value: Promise<unknown>;
}

const entries = new Map<string, Entry>();

export const CACHE_TTL = {
  /** Papers and the question bank change rarely and are large. */
  content: 5 * 60_000,
  /** Results and people change as candidates submit. */
  records: 30_000,
} as const;

export function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const hit = entries.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.value as Promise<T>;
  const value = load().catch((err) => {
    // A failed read must not be remembered — the next call tries again.
    if (entries.get(key)?.value === value) entries.delete(key);
    throw err;
  });
  entries.set(key, { at: Date.now(), value });
  return value;
}

/** Drops every cached read whose key starts with one of the prefixes. */
export function invalidate(...prefixes: string[]): void {
  for (const key of Array.from(entries.keys())) {
    if (prefixes.some((p) => key.startsWith(p))) entries.delete(key);
  }
}

export function clearRepositoryCache(): void {
  entries.clear();
}
