import { test } from "node:test";
import assert from "node:assert/strict";
import { IGKO_G6_SCITECH_EXAM, IGKO_G6_SCITECH_KEY, IGKO_G6_SCITECH_QUESTIONS } from "@/data/igko_g6_scitech";
import { SEED_EXAMS, SEED_QUESTIONS } from "@/lib/seedData";
import { IGKO_G6_SCITECH_ACTIVITY_MAP } from "@/components/activities/igko_g6_scitech-play/registry";
import { resolveOption, evaluateNobel, type Evaluation } from "@/components/activities/igko_g6_scitech-play/logic";
import { seededShuffle } from "@/lib/exam/shuffle";

const question = (n: number) => IGKO_G6_SCITECH_QUESTIONS.find((q) => q.customConfig?.questionNumber === n)!;
const options = (n: number) => question(n).multipleChoiceConfig!.options;
const pick = (n: number, ev: Evaluation) => resolveOption(options(n), ev);

test("verified key from the source paper", () => {
  assert.equal(IGKO_G6_SCITECH_KEY, "BACBDCBDDCBABCC");
  for (const q of IGKO_G6_SCITECH_QUESTIONS) {
    assert.equal(q.multipleChoiceConfig!.correctOptionId, IGKO_G6_SCITECH_KEY[(q.customConfig!.questionNumber as number) - 1]);
  }
});

test("the paper is a real exam in the normal exam system", () => {
  assert.ok(SEED_EXAMS.some((e) => e.id === IGKO_G6_SCITECH_EXAM.id));
  for (const id of IGKO_G6_SCITECH_EXAM.questionIds) assert.ok(SEED_QUESTIONS.some((q) => q.id === id), `${id} missing from the question bank`);
  assert.equal(IGKO_G6_SCITECH_EXAM.grade, 6);
  assert.equal(IGKO_G6_SCITECH_EXAM.totalQuestions, IGKO_G6_SCITECH_EXAM.questionIds.length);
});

test("every question in the paper has its activity and never offers option buttons", () => {
  for (const q of IGKO_G6_SCITECH_QUESTIONS) {
    assert.ok(IGKO_G6_SCITECH_ACTIVITY_MAP[q.id], `${q.id} has no activity`);
    assert.ok(IGKO_G6_SCITECH_ACTIVITY_MAP[q.questionId], `${q.questionId} has no activity`);
    assert.equal(q.customConfig?.activityOnly, true);
  }
});

test("shuffling the printed options never changes which letter an answer maps to", () => {
  const ev = evaluateNobel({ delivery: { prize: "Peace", city: "oslo" } });
  for (const seed of ["s1", "s2", "s3", "s4"]) {
    assert.equal(resolveOption(seededShuffle(options(1), seed), ev), "B");
  }
});

/* ── The paper's wording and key, against the source documents ── */

import { existsSync, readFileSync } from "node:fs";
import { inflateRawSync } from "node:zlib";

const SOURCE_DIR = "IGKO";
const WORKSHEET = `${SOURCE_DIR}/WORKSHEET-20261008T095504Z-1-001/WORKSHEET/VI/6.1 S&T.docx`;
const ANSWER_KEY = `${SOURCE_DIR}/ANSWER KEY-20261008T095532Z-1-001/ANSWER KEY/VI/6.1 S&T AK.docx`;

/** word/document.xml from a .docx (a zip), without extra dependencies. */
function documentXml(path: string): string {
  const buf = readFileSync(path);
  let off = 0;
  while (off < buf.length - 30) {
    if (buf.readUInt32LE(off) !== 0x04034b50) break;
    const method = buf.readUInt16LE(off + 8);
    const size = buf.readUInt32LE(off + 18);
    const nameLen = buf.readUInt16LE(off + 26);
    const extraLen = buf.readUInt16LE(off + 28);
    const name = buf.subarray(off + 30, off + 30 + nameLen).toString("utf8");
    const start = off + 30 + nameLen + extraLen;
    if (name === "word/document.xml") {
      const data = buf.subarray(start, start + size);
      return (method === 8 ? inflateRawSync(data) : data).toString("utf8");
    }
    off = start + size;
  }
  throw new Error("document.xml not found");
}

const clean = (s: string) =>
  s.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&apos;/g, "'").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();

function paragraphs(xml: string) {
  return (xml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [])
    .map((p) => ({ text: clean((p.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || []).map((t) => t.replace(/<[^>]+>/g, "")).join("")), xml: p }))
    .filter((p) => p.text);
}

/** { n: { text, options: [a,b,c,d], highlighted } } from the paper. */
function sourceQuestions(xml: string) {
  const out: Record<number, { text: string; options: string[]; highlighted?: string }> = {};
  let n = 0;
  for (const p of paragraphs(xml)) {
    const q = /^Q(\d+)\.\s*(.*)$/.exec(p.text);
    if (q) {
      n = Number(q[1]);
      out[n] = { text: q[2].trim(), options: [] };
      continue;
    }
    const o = /^\(?([a-d])\)\s*(.*)$/.exec(p.text);
    if (o && n) {
      out[n].options.push(o[2].trim());
      if (/<w:highlight w:val="green"/.test(p.xml)) out[n].highlighted = o[1].toUpperCase();
    }
  }
  return out;
}

const haveSource = existsSync(WORKSHEET) && existsSync(ANSWER_KEY);

test("question wording and options are the source paper's, unchanged", { skip: !haveSource && "IGKO source documents not present" }, () => {
  const src = sourceQuestions(documentXml(WORKSHEET));
  for (const q of IGKO_G6_SCITECH_QUESTIONS) {
    const n = q.customConfig!.questionNumber as number;
    assert.equal(clean(q.questionText), src[n].text, `Q${n} wording differs from the paper`);
    assert.deepEqual(q.multipleChoiceConfig!.options.map((o) => clean(o.text)), src[n].options, `Q${n} options differ`);
  }
});

test("the key matches the answer-key file, except the documented Q4 correction", { skip: !haveSource && "IGKO source documents not present" }, () => {
  const ak = sourceQuestions(documentXml(ANSWER_KEY));
  for (let n = 1; n <= 15; n++) {
    const expected = n === 4 ? "A" : IGKO_G6_SCITECH_KEY[n - 1];
    assert.equal(ak[n].highlighted, expected, `answer-key file Q${n}`);
  }
  assert.equal(IGKO_G6_SCITECH_KEY[3], "B", "Q4 is keyed to Gravitational Force, not the file's Buoyant Force");
});
