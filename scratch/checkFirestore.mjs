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
  console.error("No API key found");
  process.exit(1);
}

async function listCollection(collection: string) {
  const url = `https://firestore.googleapis.com/v1/projects/olympiad-dashboard/databases/olympiad/documents/${collection}?pageSize=300`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Fetch ${collection} failed: ${res.status} ${res.statusText}`);
    const err = await res.text();
    console.error(err);
    return [];
  }
  const data = await res.json();
  return data.documents || [];
}

async function main() {
  console.log("Checking Firestore 'olympiad' database...");
  const exams = await listCollection("exams");
  console.log(`Found ${exams.length} exams in Firestore:`);
  exams.forEach((doc: any) => {
    const id = doc.name.split("/").pop();
    const title = doc.fields?.title?.stringValue;
    const qIds = doc.fields?.questionIds?.arrayValue?.values?.map((v: any) => v.stringValue) || [];
    console.log(`Exam: ${id} | Title: "${title}" | QCount: ${qIds.length} | First 3 Qs: ${qIds.slice(0, 3).join(", ")}`);
  });

  const questions = await listCollection("questions");
  console.log(`\nFound ${questions.length} questions in Firestore (first 300 page).`);
  const qIds = questions.map((d: any) => d.name.split("/").pop());
  console.log("Sample question IDs:", qIds.slice(0, 10));
}

main().catch(console.error);
