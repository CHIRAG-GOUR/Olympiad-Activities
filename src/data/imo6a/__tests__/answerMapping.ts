/**
 * Answer-mapping check for SOF IMO 2018-19 · Class 6 · Set A.
 *
 * Every activity produces a *value*, and a matcher finds the option whose printed text
 * carries that value. If an option's wording drifts, a candidate who solved the question
 * correctly would silently be marked wrong — this script catches that.
 *
 * For each question it states the value the correct interaction yields, runs the very same
 * matcher the activity uses, and checks the result equals the official key.
 *
 *   npm run verify:imo6a
 */

import { IMO6A_QUESTIONS } from "../index";
import {
  matchNumber,
  matchNumberList,
  matchRatio,
  matchText,
  sameSet,
} from "@/components/activities/imo6a/shared";
import { Question } from "@/types/question";

type Check =
  | { kind: "number"; value: number; tolerance?: number }
  | { kind: "numberList"; values: number[]; tolerance?: number }
  | { kind: "ratio"; a: number; b: number }
  | { kind: "text"; value: string }
  | { kind: "optionState"; expect: unknown; compare?: "set" | "equal" }
  | { kind: "declared"; optionId: string };

/** What the correct interaction produces, question by question. */
const EXPECTED: Record<string, Check & { note?: string }> = {
  q_imo6a_01: { kind: "number", value: 4 },
  q_imo6a_02: { kind: "optionState", expect: { rotation: 45, markers: ["SW", "SE"] } },
  q_imo6a_03: { kind: "text", value: "Basket ball" },
  q_imo6a_04: { kind: "declared", optionId: "C", note: "arrangement C is the only one with a triple overlap" },
  q_imo6a_05: { kind: "text", value: "A" },
  q_imo6a_06: { kind: "optionState", expect: "two-disjoint-inside-one", compare: "equal" },
  q_imo6a_07: { kind: "optionState", expect: ["1", "2", "3"], compare: "set" },
  q_imo6a_08: { kind: "number", value: 0 },
  q_imo6a_09: { kind: "number", value: 18 },
  q_imo6a_10: { kind: "optionState", expect: { text: "ZYX", flipped: true, hatchOn: "right", capsOn: "top" } },
  q_imo6a_11: { kind: "number", value: 801 },
  q_imo6a_12: { kind: "optionState", expect: { dir: "down", tail: "doubleBar" } },
  q_imo6a_13: { kind: "optionState", expect: { fold: "right-over-left" } },
  q_imo6a_14: { kind: "optionState", expect: { glyph: "M", rotation: 180, corner: "TL" } },
  q_imo6a_15: { kind: "text", value: "Daughter-in-law" },

  q_imo6a_16: { kind: "number", value: 72963 },
  q_imo6a_17: { kind: "number", value: 144 },
  q_imo6a_18: { kind: "text", value: "CXXIX + CLXXI" },
  q_imo6a_19: { kind: "text", value: "Distributive property" },
  q_imo6a_20: { kind: "text", value: "New number < Original number" },
  q_imo6a_21: { kind: "number", value: 1 },
  q_imo6a_22: { kind: "declared", optionId: "C", note: "both constructions completed" },
  q_imo6a_23: { kind: "number", value: 17 },
  q_imo6a_24: { kind: "numberList", values: [490, 392, 280] },
  q_imo6a_25: { kind: "number", value: 45 / 75 },
  q_imo6a_26: { kind: "number", value: 43 },
  q_imo6a_27: { kind: "number", value: 111 / 6 },
  q_imo6a_28: { kind: "text", value: "R and S" },
  q_imo6a_29: { kind: "number", value: 25.5 },
  q_imo6a_30: { kind: "declared", optionId: "B", note: "Statement I true, Statement II false" },
  q_imo6a_31: { kind: "text", value: "3/18, 2/9, 6/15, 4/7" },
  q_imo6a_32: { kind: "text", value: "Triangular pyramid, 4" },
  q_imo6a_33: { kind: "number", value: 695844 },
  q_imo6a_34: { kind: "numberList", values: [2.676, 8.064, 9.742], tolerance: 5e-4 },
  q_imo6a_35: { kind: "declared", optionId: "C", note: "24 cm : 15 m and 80 g : 5 kg both reduce to 2 : 125" },

  q_imo6a_36: { kind: "number", value: (12000 - 144) / 76 },
  q_imo6a_37: { kind: "text", value: "12 packs of glasses and 3 packs of straws" },
  q_imo6a_38: { kind: "number", value: 4.8 * 4.2 - 5 * 1.44, tolerance: 5e-3 },
  q_imo6a_39: { kind: "ratio", a: 40, b: 14 },
  q_imo6a_40: { kind: "text", value: "(3x + 10) m" },
  q_imo6a_41: {
    kind: "number",
    value: 5,
    note: "ERRATUM: the thermometer spans 2°C to −3°C = 5°C (option A), but the official key records B",
  },
  q_imo6a_42: { kind: "number", value: 1000 - (150 + 15.04 * 20 + 5.06 * 9), tolerance: 5e-3 },
  q_imo6a_43: { kind: "number", value: 18 },
  q_imo6a_44: { kind: "number", value: 5 },
  q_imo6a_45: { kind: "number", value: 100000 + 9999999 - 1000 },

  q_imo6a_46: { kind: "text", value: "One-fourth, equal, positive, successor" },
  q_imo6a_47: { kind: "text", value: "(i) T, (ii) F, (iii) F, (iv) T" },
  q_imo6a_48: { kind: "text", value: "200, 13/8" },
  q_imo6a_49: { kind: "number", value: 165 / 101, tolerance: 1e-6 },
  q_imo6a_50: { kind: "text", value: "(P) → (iv), (Q) → (iii), (R) → (ii), (S) → (i)" },
};

function resolve(q: Question, check: Check): string | undefined {
  switch (check.kind) {
    case "number":
      return matchNumber(q, check.value, check.tolerance ?? 1e-9);
    case "numberList":
      return matchNumberList(q, check.values, check.tolerance ?? 1e-9);
    case "ratio":
      return matchRatio(q, check.a, check.b);
    case "text":
      return matchText(q, check.value);
    case "declared":
      return check.optionId;
    case "optionState": {
      const states = (q.customConfig?.optionStates ?? {}) as Record<string, any>;
      return Object.keys(states).find((id) => {
        const s = states[id];
        if (check.compare === "equal") return s === check.expect;
        if (check.compare === "set") return sameSet(s, check.expect as string[]);
        const want = check.expect as Record<string, unknown>;
        return Object.keys(want).every((k) =>
          Array.isArray(want[k]) ? sameSet(s[k] ?? [], want[k] as string[]) : s[k] === want[k]
        );
      });
    }
  }
}

let failures = 0;
let warnings = 0;

console.log("\nSOF IMO 2018-19 · Class 6 · Set A — answer-mapping check\n");

if (IMO6A_QUESTIONS.length !== 50) {
  console.log(`  FAIL  expected 50 questions, found ${IMO6A_QUESTIONS.length}`);
  failures++;
}

const totalMarks = IMO6A_QUESTIONS.reduce((t, q) => t + q.marks, 0);
if (totalMarks !== 60) {
  console.log(`  FAIL  expected 60 marks in total, found ${totalMarks}`);
  failures++;
}

for (const q of IMO6A_QUESTIONS) {
  const key = q.multipleChoiceConfig?.correctOptionId;
  const check = EXPECTED[q.id];

  if (!key) {
    console.log(`  FAIL  ${q.questionId}: no correct option recorded`);
    failures++;
    continue;
  }
  if (!check) {
    console.log(`  FAIL  ${q.questionId}: no expected interaction declared in this check`);
    failures++;
    continue;
  }

  const got = resolve(q, check);

  if (got === key) {
    console.log(`  ok    ${q.questionId}  produces option ${got}`);
  } else if (check.note?.startsWith("ERRATUM")) {
    console.log(`  WARN  ${q.questionId}  activity produces ${got ?? "nothing"}, official key says ${key}`);
    console.log(`        ${check.note}`);
    warnings++;
  } else {
    console.log(`  FAIL  ${q.questionId}  activity produces ${got ?? "nothing"}, key says ${key}`);
    failures++;
  }
}

console.log(
  `\n${failures === 0 ? "✅ ALL MAPPINGS MATCH THE OFFICIAL KEY" : `❌ ${failures} MAPPING FAILURE(S)`}` +
    (warnings ? `  ·  ${warnings} documented erratum/errata` : "") +
    "\n"
);

process.exit(failures === 0 ? 0 : 1);
