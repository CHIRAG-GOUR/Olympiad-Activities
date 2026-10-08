/**
 * Reading a class roster (CSV or Excel rows) into student accounts to create.
 *
 * Accepts the headings people actually use ("Student Name", "E-mail", "Std", "Div"…) and
 * class written as 6, "Class 6", "6th" or "VI". Every problem is reported against its row
 * so a teacher can fix the file rather than guess.
 */

export interface RosterEntry {
  /** 1-based row number in the sheet, counting the heading row as 1. */
  row: number;
  name: string;
  email: string;
  grade: number;
  section: string;
  /** Password from the sheet, if one was given; otherwise one is generated. */
  password?: string;
  schoolName?: string;
}

export interface RosterProblem {
  row: number;
  message: string;
}

export interface ParsedRoster {
  entries: RosterEntry[];
  problems: RosterProblem[];
}

const HEADINGS: Record<keyof Omit<RosterEntry, "row">, string[]> = {
  name: ["name", "student name", "full name", "student", "candidate name"],
  email: ["email", "e-mail", "email address", "email id", "mail", "student email"],
  grade: ["class", "grade", "std", "standard", "class number"],
  section: ["section", "sec", "div", "division"],
  password: ["password", "pass", "temporary password"],
  schoolName: ["school", "school name"],
};

const normHeading = (h: string) => h.trim().toLowerCase().replace(/[_.]+/g, " ").replace(/\s+/g, " ");

const ROMAN: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12 };

/** 6, "6", "Class 6", "6th", "VI", "Class VI" → 6. Null when unreadable or outside 1–12. */
export function parseClass(value: unknown): number | null {
  const raw = String(value ?? "").trim().toUpperCase().replace(/^(CLASS|GRADE|STD\.?|STANDARD)\s*/, "");
  if (!raw) return null;
  const roman = ROMAN[raw];
  const n = roman ?? parseInt(raw, 10);
  return Number.isInteger(n) && n >= 1 && n <= 12 ? n : null;
}

/** "a", "Sec B", "6-C" → "A"/"B"/"C". Up to 3 letters/digits; empty allowed. */
export function parseSection(value: unknown): string | null {
  let raw = String(value ?? "").trim().toUpperCase();
  if (!raw) return "";
  raw = raw.replace(/^(SECTION|SEC\.?|DIV\.?|DIVISION)\s*/, "").replace(/^\d{1,2}\s*[-/ ]\s*/, "");
  return /^[A-Z0-9]{1,3}$/.test(raw) ? raw : null;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Rows as produced by a sheet reader: one object per data row, keyed by heading. */
export function parseRoster(rows: Record<string, unknown>[], defaults: { schoolName?: string } = {}): ParsedRoster {
  const entries: RosterEntry[] = [];
  const problems: RosterProblem[] = [];
  const seen = new Map<string, number>();

  rows.forEach((raw, i) => {
    const row = i + 2; // heading is row 1
    const byField: Partial<Record<keyof typeof HEADINGS, unknown>> = {};
    for (const [heading, value] of Object.entries(raw)) {
      const h = normHeading(heading);
      for (const [field, aliases] of Object.entries(HEADINGS) as [keyof typeof HEADINGS, string[]][]) {
        if (aliases.includes(h) && byField[field] === undefined) byField[field] = value;
      }
    }
    const name = String(byField.name ?? "").trim().replace(/\s+/g, " ");
    const email = String(byField.email ?? "").trim().toLowerCase();
    if (!name && !email && !String(byField.grade ?? "").trim()) return; // blank line

    const issues: string[] = [];
    if (!name) issues.push("name is missing");
    if (!email) issues.push("email is missing");
    else if (!EMAIL.test(email)) issues.push(`"${email}" is not a valid email`);
    const grade = parseClass(byField.grade);
    if (grade === null) issues.push(`class "${String(byField.grade ?? "").trim() || "(blank)"}" must be 1–12`);
    const section = parseSection(byField.section);
    if (section === null) issues.push(`section "${String(byField.section).trim()}" should be a letter like A`);
    const password = String(byField.password ?? "").trim();
    if (password && password.length < 6) issues.push("password must be at least 6 characters");
    if (email && seen.has(email)) issues.push(`same email as row ${seen.get(email)}`);

    if (issues.length) {
      problems.push({ row, message: issues.join("; ") });
      return;
    }
    seen.set(email, row);
    entries.push({
      row,
      name,
      email,
      grade: grade!,
      section: section!,
      ...(password ? { password } : {}),
      ...(String(byField.schoolName ?? "").trim() || defaults.schoolName
        ? { schoolName: String(byField.schoolName ?? "").trim() || defaults.schoolName }
        : {}),
    });
  });

  return { entries, problems };
}

/** Easy-to-type password with no look-alike characters (0/O, 1/l/I). */
const secureRandom = () => {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  return c?.getRandomValues ? c.getRandomValues(new Uint32Array(1))[0] / 4294967296 : Math.random();
};

export function generateStudentPassword(random: () => number = secureRandom): string {
  const letters = "abcdefghjkmnpqrstuvwxyz";
  const caps = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const digits = "23456789";
  const pick = (set: string) => set[Math.floor(random() * set.length)];
  return `${pick(caps)}${pick(letters)}${pick(letters)}${pick(letters)}-${pick(digits)}${pick(digits)}${pick(digits)}${pick(digits)}`;
}

/** Student ID shown to staff and on login cards: class, section, then a stable code. */
export function studentCode(s: { id: string; grade?: number | string; section?: string }): string {
  const cls = `${Number(s.grade) || 6}${s.section ? s.section.toUpperCase() : ""}`;
  return `C${cls}-${s.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase()}`;
}

/** A blank roster to fill in. */
export const ROSTER_TEMPLATE_ROWS = [
  { Name: "Aarav Sharma", Email: "aarav.sharma@example.com", Class: 6, Section: "A" },
  { Name: "Diya Patel", Email: "diya.patel@example.com", Class: 6, Section: "B" },
];
