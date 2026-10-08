import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function apiKey() {
  const fromEnv = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (fromEnv) return fromEnv;
  try {
    const file = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    const line = file.split(/\r?\n/).find((l) => l.startsWith("NEXT_PUBLIC_FIREBASE_API_KEY="));
    if (line) return line.slice("NEXT_PUBLIC_FIREBASE_API_KEY=".length).trim();
  } catch {}
  return "AIzaSyBRpGwa_39FWQL3fMK1uOJGS_EcK0aRC9Q";
}

const key = apiKey();

function toFirestoreValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") {
    if (Number.isInteger(val)) return { integerValue: String(val) };
    return { doubleValue: val };
  }
  if (typeof val === "string") return { stringValue: val };
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.map((item) => toFirestoreValue(item)),
      },
    };
  }
  if (typeof val === "object") {
    const fields: Record<string, any> = {};
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
  const accounts = [
    { email: "tech@skillizee.io", pass: "787700" },
    { email: "pa1@skillizee.io", pass: "787700" },
  ];

  for (const acc of accounts) {
    try {
      const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: acc.email,
          password: acc.pass,
          returnSecureToken: true,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log(`Signed in successfully as ${acc.email}`);
        return data.idToken;
      }
    } catch {}
  }
  throw new Error("Could not sign in as staff administrator.");
}

async function run() {
  const idToken = await signInStaff();

  // 1. Fetch current exams from Firestore
  const listExamsUrl = `https://firestore.googleapis.com/v1/projects/olympiad-dashboard/databases/olympiad/documents/exams?pageSize=300`;
  const examsRes = await fetch(listExamsUrl, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  const examsData = await examsRes.json();
  const examDocs = examsData.documents || [];
  console.log(`Found ${examDocs.length} exams in Firestore.`);

  // 2. Fetch current exam_locks
  const listLocksUrl = `https://firestore.googleapis.com/v1/projects/olympiad-dashboard/databases/olympiad/documents/exam_locks?pageSize=300`;
  const locksRes = await fetch(listLocksUrl, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  const locksData = await locksRes.json();
  const lockDocs = locksData.documents || [];
  console.log(`Found ${lockDocs.length} existing exam_locks in Firestore.`);

  // Demo student identifiers across all formats
  const demoStudentIds = [
    "usr_demostudent1_olympiad_org",
    "usr_demostudent2_olympiad_org",
    "usr_demostudent3_olympiad_org",
    "demostudent1@olympiad.org",
    "demostudent2@olympiad.org",
    "demostudent3@olympiad.org",
    "DemoStudent1",
    "DemoStudent2",
    "DemoStudent3",
  ];

  const primaryDiceExamIds = new Set([
    "exam_imo_2022_g6_setb",
    "exam_imo_class6_setb_2022",
    "IMO-2022-23-G6-SETB",
  ]);

  // All known exams in seed data
  const allSeedExamIds = [
    "ieo-2024-25-class-6-set-a",
    "ieo-class6-master-interactive",
    "imo-class6-master-interactive",
    "imo-class6-setA-2026",
    "imo-2023-24-class-6-set-c",
    "exam_imo_2018_g6_seta",
    "exam_imo_2018_g6_seta_classic",
    "exam_imo_2022_g6_setb",
    "exam_imo_2024_g6_setb",
    "exam_imo_g6_setb2",
    "exam_imo_g6_paper3",
    "exam_imo_class6_setb_2022",
    "IMO-2022-23-G6-SETB",
  ];

  // Align primary dice exam to demo students and unlock it
  for (const primaryId of primaryDiceExamIds) {
    const patchUrl = `https://firestore.googleapis.com/v1/projects/olympiad-dashboard/databases/olympiad/documents/exam_locks/${primaryId}`;
    const payload = {
      examId: primaryId,
      isLocked: false,
      visibleClasses: [6],
      assignedStudentIds: demoStudentIds,
      updatedAt: new Date().toISOString(),
    };
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(payload)) {
      fields[k] = toFirestoreValue(v);
    }
    const res = await fetch(patchUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ fields }),
    });
    if (res.ok) {
      console.log(`Aligned & UNLOCKED primary dice exam: ${primaryId}`);
    } else {
      console.warn(`Failed to update ${primaryId}:`, await res.text());
    }
  }

  // Lock all other exams
  const examsToLock = new Set([...examDocs.map((d: any) => d.name.split("/").pop()), ...allSeedExamIds]);
  for (const examId of examsToLock) {
    if (!primaryDiceExamIds.has(examId)) {
      const patchUrl = `https://firestore.googleapis.com/v1/projects/olympiad-dashboard/databases/olympiad/documents/exam_locks/${examId}`;
      const payload = {
        examId,
        isLocked: true,
        visibleClasses: [6],
        assignedStudentIds: [],
        updatedAt: new Date().toISOString(),
      };
      const fields: Record<string, any> = {};
      for (const [k, v] of Object.entries(payload)) {
        fields[k] = toFirestoreValue(v);
      }
      const res = await fetch(patchUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ fields }),
      });
      if (res.ok) {
        console.log(`Ensured LOCKED for exam: ${examId}`);
      }
    }
  }

  console.log("Exam alignment completed successfully!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
