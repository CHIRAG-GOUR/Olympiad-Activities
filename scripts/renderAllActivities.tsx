/**
 * Renders every activity of every paper against its real question data.
 *
 *   npm run verify:render
 *
 * An activity that throws during render takes the whole exam page down with it — the
 * candidate cannot even navigate away. This catches that on the command line rather than
 * in their browser.
 *
 * Each activity is rendered in four states, because all four occur in production:
 *
 *   fresh              a question opened for the first time
 *   stale state        a session saved by an earlier generation of the paper
 *   stale answer       an answer restored with no matching microworld state
 *   via Firestore      the question as it comes back from Firestore
 *
 * That last one matters most. Firestore cannot hold an array inside an array, so the
 * seeder wraps every inner array in a single-key map; questions carrying coordinates,
 * grids or polygons come back reshaped unless they are decoded on read. Rendering
 * happens through react-dom/server, so effects never run and what is exercised is the
 * render path itself — exactly where a bad config shape bites.
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { IMO6A_QUESTIONS } from "../src/data/imo6a";
import { IMO6A_CLASSIC_QUESTIONS } from "../src/data/imo6aClassic";
import { IMO6B2_QUESTIONS } from "../src/data/imo6b2";
import { IMO_CLASS6_SETB_QUESTIONS } from "../src/data/sofImoClass6SetB";
import { getQuestionActivity } from "../src/components/activities/ActivityRegistry";
import { reviveNestedArrays } from "../src/repositories/firebase/decodeFirestore";
import type { Question } from "../src/types/question";

type Mod = Record<string, unknown>;
type Comp = React.ComponentType<Record<string, unknown>>;

/* ── Firestore round trip ──────────────────────────────────── */

/** Mirrors the seeder: an array inside an array must be wrapped in a map. */
function encodeForFirestore(value: unknown, insideArray = false): unknown {
  if (Array.isArray(value)) {
    const encoded = value.map((v) => encodeForFirestore(v, true));
    return insideArray ? { items: encoded } : encoded;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = encodeForFirestore(v, false);
    return out;
  }
  return value;
}

/** The question exactly as the app receives it back from Firestore. */
function throughFirestore(q: Question): Question {
  return reviveNestedArrays(encodeForFirestore(q)) as Question;
}

/* ── which component serves which question ─────────────────── */

const leadingNumber = (name: string, prefix: string) => {
  const m = name.match(new RegExp(`^${prefix}(\\d{2})`));
  return m ? Number(m[1]) : null;
};

interface Paper {
  label: string;
  questions: Question[];
  /** Modules whose Q##/B## exports serve this paper, in question order. */
  modules?: (() => Promise<Mod>)[];
  prefix?: string;
  /** Papers whose activities are registered statically resolve through the registry. */
  viaRegistry?: boolean;
}

const PAPERS: Paper[] = [
  {
    label: "Set A · mini-games",
    questions: IMO6A_QUESTIONS,
    prefix: "Q",
    modules: [
      () => import("../src/components/activities/imo6a-play/p01_05"),
      () => import("../src/components/activities/imo6a-play/p06_10"),
      () => import("../src/components/activities/imo6a-play/p11_15"),
      () => import("../src/components/activities/imo6a-play/p16_20"),
      () => import("../src/components/activities/imo6a-play/p21_25"),
      () => import("../src/components/activities/imo6a-play/p26_30"),
      () => import("../src/components/activities/imo6a-play/p31_35"),
      () => import("../src/components/activities/imo6a-play/p36_40"),
      () => import("../src/components/activities/imo6a-play/p41_45"),
      () => import("../src/components/activities/imo6a-play/p46_50"),
    ],
  },
  {
    label: "Set A · classic",
    questions: IMO6A_CLASSIC_QUESTIONS,
    prefix: "Q",
    modules: [
      () => import("../src/components/activities/imo6a/q01_05"),
      () => import("../src/components/activities/imo6a/q06_10"),
      () => import("../src/components/activities/imo6a/q11_15"),
      () => import("../src/components/activities/imo6a/q16_20"),
      () => import("../src/components/activities/imo6a/q21_25"),
      () => import("../src/components/activities/imo6a/q26_30"),
      () => import("../src/components/activities/imo6a/q31_35"),
      () => import("../src/components/activities/imo6a/q36_40"),
      () => import("../src/components/activities/imo6a/q41_45"),
      () => import("../src/components/activities/imo6a/q46_50"),
    ],
  },
  {
    label: "Set B #2",
    questions: IMO6B2_QUESTIONS,
    prefix: "B",
    modules: [
      () => import("../src/components/activities/imo6b2-play/b01_24"),
      () => import("../src/components/activities/imo6b2-play/b29_50"),
      () => import("../src/components/activities/imo6b2-play/b_every"),
      () => import("../src/components/activities/imo6b2-play/b_logic"),
      () => import("../src/components/activities/imo6b2-play/b_math"),
    ],
  },
  { label: "Set B", questions: IMO_CLASS6_SETB_QUESTIONS, viaRegistry: true },
];

async function componentsFor(paper: Paper): Promise<Map<number, { name: string; comp: Comp }>> {
  const out = new Map<number, { name: string; comp: Comp }>();

  if (paper.viaRegistry) {
    paper.questions.forEach((q, i) => {
      const comp = getQuestionActivity(q.id) ?? getQuestionActivity(q.questionId);
      if (comp) {
        out.set(i + 1, {
          name: comp.displayName || comp.name || "registered",
          comp: comp as unknown as Comp,
        });
      }
    });
    return out;
  }

  for (const load of paper.modules ?? []) {
    const mod = await load();
    for (const [name, exported] of Object.entries(mod)) {
      const n = leadingNumber(name, paper.prefix ?? "Q");
      if (n !== null && typeof exported === "function") out.set(n, { name, comp: exported as Comp });
    }
  }
  return out;
}

const failures: { paper: string; qid: string; name: string; state: string; error: string }[] = [];
let rendered = 0;

async function run() {
  console.log("\nRendering every activity of every paper\n");

  for (const paper of PAPERS) {
    let comps: Map<number, { name: string; comp: Comp }>;
    try {
      comps = await componentsFor(paper);
    } catch (err) {
      console.log(`  ${paper.label}: MODULES FAILED TO LOAD — ${(err as Error).message}`);
      failures.push({ paper: paper.label, qid: "-", name: "(modules)", state: "-", error: String(err) });
      continue;
    }

    let paperFailures = 0;
    for (let i = 0; i < paper.questions.length; i++) {
      const question = paper.questions[i];
      const entry = comps.get(i + 1);
      if (!entry) continue;

      const cases: { label: string; question: Question; props: Record<string, unknown> }[] = [
        { label: "fresh", question, props: {} },
        { label: "stale state", question, props: { activityState: { legacy: true, picked: ["x"] } } },
        { label: "stale answer", question, props: { value: "B" } },
        { label: "via Firestore", question: throughFirestore(question), props: {} },
      ];

      for (const c of cases) {
        try {
          renderToStaticMarkup(
            React.createElement(entry.comp, {
              questionId: c.question.id,
              question: c.question,
              onChange: () => {},
              readOnly: false,
              ...c.props,
            })
          );
          rendered++;
        } catch (err) {
          paperFailures++;
          failures.push({
            paper: paper.label,
            qid: question.questionId,
            name: entry.name,
            state: c.label,
            error: (err as Error).message,
          });
        }
      }
    }
    console.log(
      `  ${paper.label.padEnd(20)} ${comps.size}/${paper.questions.length} questions covered` +
        (paperFailures ? `  —  ${paperFailures} failing render(s)` : "  —  all render")
    );
  }

  console.log(`\n  ${rendered} successful renders`);

  if (failures.length === 0) {
    console.log("\n✅ EVERY ACTIVITY RENDERS IN EVERY STATE\n");
    process.exit(0);
  }

  console.log(`\n❌ ${failures.length} FAILING RENDER(S)\n`);
  const seen = new Set<string>();
  for (const f of failures) {
    const key = `${f.paper}|${f.qid}|${f.state}`;
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(`  ${f.paper}  ${f.qid}  ${f.name}  [${f.state}]`);
    console.log(`      ${f.error}\n`);
  }
  process.exit(1);
}

run();
