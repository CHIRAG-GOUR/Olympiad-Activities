/**
 * Renders every registered activity against its real question data and reports the ones
 * that throw.
 *
 *   npm run verify:render
 *
 * A mini-game or activity that throws during render takes the whole exam page down with
 * it — the student cannot even navigate away. This catches that on the command line
 * instead of in a candidate's browser.
 *
 * Rendering happens through react-dom/server, so effects never run; this finds errors in
 * the render path itself, which is exactly where a bad `customConfig` shape bites.
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { IMO6A_QUESTIONS } from "../src/data/imo6a";
import { IMO6A_CLASSIC_QUESTIONS } from "../src/data/imo6aClassic";
import { IMO6B2_QUESTIONS } from "../src/data/imo6b2";
import { IMO_CLASS6_SETB_QUESTIONS } from "../src/data/sofImoClass6SetB";
import type { Question } from "../src/types/question";

type Mod = Record<string, unknown>;

/** Every module that exports activities, paired with the paper those activities serve. */
const GROUPS: { label: string; questions: Question[]; modules: (() => Promise<Mod>)[] }[] = [
  {
    label: "Set A · mini-games",
    questions: IMO6A_QUESTIONS,
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
];

const OTHER_PAPERS: { label: string; questions: Question[] }[] = [
  { label: "Set B", questions: IMO_CLASS6_SETB_QUESTIONS },
  { label: "Set B #2", questions: IMO6B2_QUESTIONS },
];

/** Leading question number of an activity export, e.g. Q07CubeNetActivity -> 7. */
function questionNumber(exportName: string): number | null {
  const m = exportName.match(/^Q(\d{2})/);
  return m ? Number(m[1]) : null;
}

const failures: { paper: string; name: string; qid: string; error: string }[] = [];
let rendered = 0;

async function run() {
  console.log("\nRendering every activity against its question data\n");

  for (const group of GROUPS) {
    for (const load of group.modules) {
      let mod: Mod;
      try {
        mod = await load();
      } catch (err) {
        console.log(`  MODULE FAILED TO LOAD  ${(err as Error).message}`);
        failures.push({ paper: group.label, name: "(module)", qid: "-", error: String(err) });
        continue;
      }

      for (const [name, exported] of Object.entries(mod)) {
        const n = questionNumber(name);
        if (n === null || typeof exported !== "function") continue;

        const question = group.questions[n - 1];
        if (!question) continue;

        // Exercise the pristine path and a restore from a foreign state shape, since a
        // stale session is exactly how a browser ends up feeding a world it cannot read.
        const cases: { label: string; props: Record<string, unknown> }[] = [
          { label: "fresh", props: {} },
          { label: "stale state", props: { activityState: { legacy: true, picked: ["x"] } } },
          { label: "stale answer", props: { value: "B" } },
        ];

        for (const c of cases) {
          try {
            const Component = exported as React.ComponentType<Record<string, unknown>>;
            renderToStaticMarkup(
              React.createElement(Component, {
                questionId: question.id,
                question,
                onChange: () => {},
                readOnly: false,
                ...c.props,
              })
            );
            rendered++;
          } catch (err) {
            failures.push({
              paper: group.label,
              name: `${name} [${c.label}]`,
              qid: question.questionId,
              error: (err as Error).message,
            });
          }
        }
      }
    }
  }

  console.log(`  rendered ${rendered} activity renders across ${GROUPS.length} papers`);
  for (const p of OTHER_PAPERS) {
    console.log(`  (${p.label}: ${p.questions.length} questions, activities not in this sweep)`);
  }

  if (failures.length === 0) {
    console.log("\n✅ EVERY ACTIVITY RENDERS\n");
    process.exit(0);
  }

  console.log(`\n❌ ${failures.length} FAILING RENDER(S)\n`);
  for (const f of failures) {
    console.log(`  ${f.paper}  ${f.qid}  ${f.name}`);
    console.log(`      ${f.error}\n`);
  }
  process.exit(1);
}

run();
