import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { SEED_QUESTIONS, SEED_EXAMS, SEED_SUBJECTS } from "../src/lib/seedData";

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
  console.error("No API key found in .env.local or environment");
  process.exit(1);
}

// Convert JavaScript values to Firestore REST API Value objects
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
        values: val.map((item) => {
          if (Array.isArray(item)) {
            // Firestore forbids nested arrays directly inside arrayValue. Wrap in a map.
            return {
              mapValue: {
                fields: {
                  items: toFirestoreValue(item),
                },
              },
            };
          }
          return toFirestoreValue(item);
        }),
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
  const staffEmail = process.env.STAFF_EMAIL || "pa1@skillizee.io";
  // Never default the password. This repository is public, so a literal here is a
  // published Super Admin credential for a live project - which is exactly how the
  // previous default ("787700") became an exposure.
  const staffPassword = process.env.STAFF_PASSWORD || process.env.ADMIN_PASSWORD || process.argv[2];
  if (!staffPassword) {
    console.error(
      [
        "",
        "  No staff password supplied.",
        "  Pass it as an argument or set STAFF_PASSWORD:",
        "",
        "    npx tsx scripts/seedAllFirestore.ts '<password>'",
        "    STAFF_PASSWORD='<password>' npx tsx scripts/seedAllFirestore.ts",
        "",
      ].join("\n")
    );
    process.exit(1);
  }

  console.log(`  Authenticating as ${staffEmail}...`);
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

async function writeDoc(idToken: string, collection: string, docId: string, data: any) {
  const fields: Record<string, any> = {};
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

async function listDocs(idToken: string, collection: string) {
  const url = `https://firestore.googleapis.com/v1/projects/olympiad-dashboard/databases/olympiad/documents/${collection}?pageSize=300`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed listing ${collection}: ${JSON.stringify(err)}`);
  }
  const data = await res.json();
  return data.documents || [];
}

async function main() {
  console.log("================================================================================");
  console.log("  SEEDING BOTH QUESTION PAPERS & ALL 100 QUESTIONS TO CLOUD FIRESTORE");
  console.log("  Database: 'olympiad' (Isolated from default Minty Finance DB)");
  console.log("================================================================================\n");

  const idToken = await signInStaff();
  console.log("✓ Authenticated successfully.\n");

  // 1. Subjects
  console.log(`Writing ${SEED_SUBJECTS.length} subjects...`);
  for (const sub of SEED_SUBJECTS) {
    await writeDoc(idToken, "subjects", sub.id, sub);
    console.log(`  ✓ Subject: ${sub.id} (${sub.name})`);
  }

  // 2. Exams
  console.log(`\nWriting ${SEED_EXAMS.length} examination papers...`);
  for (const exam of SEED_EXAMS) {
    await writeDoc(idToken, "exams", exam.id, exam);
    console.log(`  ✓ Exam: ${exam.id} -> "${exam.title}" (${exam.totalQuestions} questions)`);
  }

  // 3. Questions (concurrently in chunks)
  console.log(`\nWriting ${SEED_QUESTIONS.length} questions...`);
  const chunkSize = 5;
  for (let i = 0; i < SEED_QUESTIONS.length; i += chunkSize) {
    const chunk = SEED_QUESTIONS.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async (q) => {
        await writeDoc(idToken, "questions", q.id, q);
      })
    );
    console.log(`  ✓ Uploaded ${Math.min(i + chunkSize, SEED_QUESTIONS.length)} / ${SEED_QUESTIONS.length} questions`);
  }
  console.log(`\n  ✓ All ${SEED_QUESTIONS.length} questions uploaded successfully.`);

  // 4. Verification
  console.log("\nVerifying Firestore content in 'olympiad' database...");
  const remoteExams = await listDocs(idToken, "exams");
  const remoteQuestions = await listDocs(idToken, "questions");

  console.log(`  ✓ Remote Exams in Firestore (${remoteExams.length}):`);
  remoteExams.forEach((e: any) => {
    const id = e.name.split("/").pop();
    const title = e.fields?.title?.stringValue;
    console.log(`    - [${id}] ${title}`);
  });

  console.log(`  ✓ Remote Questions in Firestore: ${remoteQuestions.length}`);
  console.log("\n================================================================================");
  console.log("  SEEDING COMPLETE! BOTH PAPERS ARE NOW FULLY ACTIVE & ACCESSIBLE.");
  console.log("================================================================================\n");
}

main().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
