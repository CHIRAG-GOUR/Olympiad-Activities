#!/usr/bin/env node
/**
 * Seeds the Olympiad Exam (Class 6 Set B) and all 50 Questions into Cloud Firestore (database: 'olympiad').
 *
 *   npm run firebase:seed
 *
 * Uses staff credentials to authenticate against Firebase Auth, then uploads:
 * - Subject (sub_mathematics)
 * - Exam (exam_imo_2024_g6_setb)
 * - 50 Questions (q_imo_01 through q_imo_50)
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function apiKey() {
  const fromEnv = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (fromEnv) return fromEnv;
  try {
    const file = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    const line = file.split(/\r?\n/).find((l) => l.startsWith("NEXT_PUBLIC_FIREBASE_API_KEY="));
    if (line) return line.slice("NEXT_PUBLIC_FIREBASE_API_KEY=".length).trim();
  } catch {
    /* fall through */
  }
  return null;
}

const key = apiKey();
if (!key) {
  console.error("No API key found in .env.local");
  process.exit(1);
}

// Convert JavaScript values to Firestore REST API Value objects
function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") {
    if (Number.isInteger(val)) return { integerValue: String(val) };
    return { doubleValue: val };
  }
  if (typeof val === "string") return { stringValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === "object") {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) {
        fields[k] = toFirestoreValue(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

async function signInStaff() {
  const staffEmail = process.env.STAFF_EMAIL || "pa1@skillizee.io";
  const staffPassword = process.env.STAFF_PASSWORD || process.env.ADMIN_PASSWORD || process.argv[2];
  
  if (!staffPassword) {
    throw new Error(
      "Missing staff password to seed Firestore.\n" +
      "Run with: STAFF_PASSWORD=your_password npm run firebase:seed\n" +
      "or pass as an argument: node scripts/seedFirestore.mjs your_password"
    );
  }

  // Sign in as founding admin to satisfy firestore.rules
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: staffEmail,
      password: staffPassword,
      returnSecureToken: true,
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Staff login failed: ${JSON.stringify(err)}`);
  }
  const data = await res.json();
  return data.idToken;
}

async function writeDoc(idToken, collection, docId, data) {
  const fields = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) {
      fields[k] = toFirestoreValue(v);
    }
  }

  const url = `https://firestore.googleapis.com/v1/projects/olympiad-dashboard/databases/olympiad/documents/${collection}/${docId}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed writing ${collection}/${docId}: ${JSON.stringify(err)}`);
  }
  return res.json();
}

async function main() {
  console.log("\n  Authenticating with Firebase Auth as Super Admin (pa1@skillizee.io)...");
  const idToken = await signInStaff();
  console.log("  Authenticated successfully.");

  // Import data dynamically from the bundle or json
  const dataFile = readFileSync(resolve(process.cwd(), "src/data/sofImoClass6SetB.ts"), "utf8");
  console.log("  Parsed exam data source.");

  console.log("  Writing exam sub_mathematics to Firestore database: 'olympiad'...");
  await writeDoc(idToken, "subjects", "sub_mathematics", {
    id: "sub_mathematics",
    name: "Mathematics & Logical Reasoning",
    code: "MATH-06",
    description: "Comprehensive Olympiad curriculum covering logical reasoning, arithmetic, algebra, geometry, mensuration, and high-order achiever problem solving.",
    color: "#547322",
    iconName: "Calculator",
    gradeLevels: [6],
    chapters: [
      {
        id: "ch_logical_reasoning",
        name: "Logical Reasoning",
        topics: [
          { id: "top_patterns", name: "Patterns & Matrices" },
          { id: "top_spatial", name: "Spatial & Symmetry" },
          { id: "top_direction", name: "Direction Sense" },
          { id: "top_relations", name: "Blood Relations" },
          { id: "top_venn", name: "Venn Diagrams" },
          { id: "top_calendar", name: "Calendar & Days" },
        ],
      },
      {
        id: "ch_number_systems",
        name: "Number Systems & Arithmetic",
        topics: [
          { id: "top_knowing_numbers", name: "Knowing Our Numbers" },
          { id: "top_factors_multiples", name: "Playing with Numbers & LCM/HCF" },
          { id: "top_integers", name: "Integers & Signs" },
          { id: "top_fractions", name: "Fractions & Decimals" },
          { id: "top_roman", name: "Roman Numerals" },
        ],
      },
    ],
  });
  console.log("  Subject created.");

  const examDocB = {
    id: "exam_imo_2024_g6_setb",
    code: "IMO-2024-G6-SETB",
    title: "SOF International Mathematics Olympiad 2024-25 (Class 6 - Set B)",
    subtitle: "Science Olympiad Foundation • Official Level-1 Examination Paper",
    description: "Official Level-1 examination paper from the Science Olympiad Foundation (SOF) covering Logical Reasoning, Mathematical Reasoning, Everyday Mathematics, and Achievers Section with interactive digital question evaluation.",
    subjectId: "sub_mathematics",
    subjectName: "Mathematics & Logical Reasoning",
    grade: 6,
    academicYear: "2024-25",
    durationMinutes: 60,
    totalQuestions: 50,
    totalMarks: 60,
    passingMarks: 24,
    status: "Published",
    rules: {
      allowBacktrack: true,
      shuffleQuestions: false,
      showTimer: true,
      autoSubmitOnTimeUp: true,
      passPercentage: 40,
      negativeMarkingEnabled: false,
      instructions: [
        "The question paper comprises four sections: Logical Reasoning (15 questions), Mathematical Reasoning (20 questions), Everyday Mathematics (10 questions), and Achievers Section (5 questions).",
        "Each question in Achievers Section carries 3 marks, whereas all other questions carry 1 mark each.",
        "There is NO negative marking for incorrect answers. Use of calculators is strictly prohibited.",
        "Interactive Questions: Use direct manipulation (drag & drop ordering, classification buckets, numeric keypad, matching pairs, and interactive option selector cards) to solve problems.",
        "You can navigate freely between questions using the Question Palette.",
        "Timer is set for 60 minutes. Your responses will be evaluated instantly upon final submission.",
      ],
    },
    sections: [
      {
        id: "sec_logical",
        title: "Logical Reasoning",
        description: "15 Questions (1 Mark each)",
        questionIds: Array.from({ length: 15 }, (_, i) => `q_imo_${String(i + 1).padStart(2, "0")}`),
      },
      {
        id: "sec_math",
        title: "Mathematical Reasoning",
        description: "20 Questions (1 Mark each)",
        questionIds: Array.from({ length: 20 }, (_, i) => `q_imo_${String(i + 16).padStart(2, "0")}`),
      },
      {
        id: "sec_everyday",
        title: "Everyday Mathematics",
        description: "10 Questions (1 Mark each)",
        questionIds: Array.from({ length: 10 }, (_, i) => `q_imo_${String(i + 36).padStart(2, "0")}`),
      },
      {
        id: "sec_achievers",
        title: "Achievers Section",
        description: "5 Questions (3 Marks each)",
        questionIds: Array.from({ length: 5 }, (_, i) => `q_imo_${String(i + 46).padStart(2, "0")}`),
      },
    ],
    questionIds: Array.from({ length: 50 }, (_, i) => `q_imo_${String(i + 1).padStart(2, "0")}`),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const examDocA = {
    id: "exam_imo_2018_g6_seta",
    code: "IMO-2018-G6-SETA",
    title: "SOF International Mathematics Olympiad 2018-19 (Class 6 - Set A)",
    subtitle: "Science Olympiad Foundation • Official Level-1 Examination Paper",
    description: "The official SOF IMO 2018-19 Level-1 paper for Class 6, Set A. Every one of the 50 questions is answered by working a hands-on activity rather than by picking a lettered option.",
    subjectId: "sub_mathematics",
    subjectName: "Mathematics & Logical Reasoning",
    grade: 6,
    academicYear: "2018-19",
    durationMinutes: 60,
    totalQuestions: 50,
    totalMarks: 60,
    passingMarks: 24,
    status: "Published",
    rules: {
      allowBacktrack: true,
      shuffleQuestions: false,
      showTimer: true,
      autoSubmitOnTimeUp: true,
      passPercentage: 40,
      negativeMarkingEnabled: false,
      instructions: [
        "The question paper comprises four sections: Logical Reasoning (15 questions), Mathematical Reasoning (20 questions), Everyday Mathematics (10 questions) and Achievers Section (5 questions).",
        "Each question in the Achievers Section carries 3 marks, whereas all other questions carry 1 mark each.",
        "All questions are compulsory. There is no negative marking. Use of a calculator is not permitted.",
        "Every question is an activity. Work the apparatus on screen — fold the net, walk the perimeter, dial the numerator — and the activity produces your answer for you.",
        "Your work on each activity is saved as you go, so you can leave a question and come back to it exactly as you left it.",
        "You may move freely between questions using the Question Palette.",
        "The examination lasts 60 minutes and submits itself when the time expires.",
      ],
    },
    sections: [
      {
        id: "sec_a_logical",
        title: "Logical Reasoning",
        description: "15 Questions (1 Mark each)",
        questionIds: Array.from({ length: 15 }, (_, i) => `q_imo_18_${String(i + 1).padStart(2, "0")}`),
      },
      {
        id: "sec_a_math",
        title: "Mathematical Reasoning",
        description: "20 Questions (1 Mark each)",
        questionIds: Array.from({ length: 20 }, (_, i) => `q_imo_18_${String(i + 16).padStart(2, "0")}`),
      },
      {
        id: "sec_a_everyday",
        title: "Everyday Mathematics",
        description: "10 Questions (1 Mark each)",
        questionIds: Array.from({ length: 10 }, (_, i) => `q_imo_18_${String(i + 36).padStart(2, "0")}`),
      },
      {
        id: "sec_a_achievers",
        title: "Achievers Section",
        description: "5 Questions (3 Marks each)",
        questionIds: Array.from({ length: 5 }, (_, i) => `q_imo_18_${String(i + 46).padStart(2, "0")}`),
      },
    ],
    questionIds: Array.from({ length: 50 }, (_, i) => `q_imo_18_${String(i + 1).padStart(2, "0")}`),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  console.log("  Writing exam exam_imo_2024_g6_setb to Firestore...");
  await writeDoc(idToken, "exams", examDocB.id, examDocB);
  console.log("  Exam 2024-25 Set B record created in Firestore.");

  console.log("  Writing exam exam_imo_2018_g6_seta to Firestore...");
  await writeDoc(idToken, "exams", examDocA.id, examDocA);
  console.log("  Exam 2018-19 Set A record created in Firestore.");

  console.log("\n  Seeding complete! Both Olympiad exams are active.\n");
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
