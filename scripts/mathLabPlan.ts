/**
 * Builds a solve plan for every maths-lab question of a paper: the actions a student would
 * take to produce the official answer. Used by the browser walkthrough; it also fails when an
 * official answer cannot be produced by the question's tool.
 *   npx tsx --tsconfig tsconfig.json scripts/mathLabPlan.ts <exam-id> <out.json>
 */
import fs from "fs";
import { SEED_EXAMS, SEED_QUESTIONS } from "../src/lib/seedData";
import { numbersIn } from "../src/components/activities/mathlab/MathLab";
import { show } from "../src/components/activities/mathlab/rational";

const [examId, out] = process.argv.slice(2);
const exam = SEED_EXAMS.find((e) => e.id === examId)!;
const compact = (s: string) => s.replace(/₹\s*/g, "").toLowerCase().replace(/\s+/g, "").replace(/[−–]/g, "-");
const evalExpr = (s: string) => Function(`return (${s.replace(/[−–]/g, "-").replace(/×/g, "*").replace(/÷/g, "/")})`)() as number;
const romanNum = (s: string) => {
  const v: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let t = 0;
  for (let i = 0; i < s.length; i++) t += v[s[i]] < (v[s[i + 1]] ?? 0) ? -v[s[i]] : v[s[i]];
  return t;
};
let bad = 0;
const plans = exam.questionIds.map((id, i) => {
  const q = SEED_QUESTIONS.find((x) => x.id === id)!;
  const lab = q.customConfig?.lab as any;
  const key = q.multipleChoiceConfig!.correctOptionId;
  const opts = q.multipleChoiceConfig!.options;
  const text = opts.find((o) => o.id === key)!.text;
  const steps: string[][] = [];
  const keyIn = (v: string) => v.split("").forEach((c) => steps.push(["label", `key ${c}`]));
  const num = (t: string) => {
    const n = numbersIn(t);
    return n.length ? show(n[0]).replace(/,/g, "") : "";
  };
  switch (lab?.mode) {
    case "count": for (let k = 0; k < Number(num(text)); k++) steps.push(["text", "+ add a counter (keyboard)"]); break;
    case "dial": {
      let v = text.includes(":") ? text.replace(/\s/g, "") : /^\d{5,}$/.test(text.replace(/\s/g, "")) ? text.replace(/\s/g, "") : num(text);
      if (/none of these/i.test(text)) v = String(lab.noneValue ?? "");
      if (!v) { bad++; console.log("no dial value", i + 1); }
      keyIn(v);
      break;
    }
    case "figure": steps.push(["label", `figure card ${key}`], ["label", "answer slot"]); break;
    case "tile": steps.push(["label", `card ${text}`]); break;
    case "truth": {
      const v = Object.entries(lab.map as Record<string, string>).find(([, o]) => o === key)![0];
      v.split("").forEach((t, k) => steps.push(["label", `statement ${k + 1} ${t === "T" ? "true" : "false"}`]));
      break;
    }
    case "order": text.split(/,\s*/).forEach((t) => steps.push(["label", `item ${t}`])); break;
    case "match": {
      const v = Object.entries(lab.map as Record<string, string>).find(([, o]) => o === key)![0];
      v.split("").forEach((t, k) => steps.push(["label", `row ${k + 1}`], ["label", `column two ${t}`]));
      break;
    }
    case "multi": numbersIn(text).forEach((n, k) => { if (k) steps.push(["label", "next field"]); show(n).replace(/,/g, "").split("").forEach((c) => steps.push(["label", `key ${c}`])); }); break;
    case "compare": {
      const side = (s: string) => s.split("+").map((x) => romanNum(x.trim())).reduce((a, b) => a + b, 0);
      String(side(lab.left)).split("").forEach((c) => steps.push(["label", `key ${c}`]));
      steps.push(["label", "next field"]);
      String(side(lab.right)).split("").forEach((c) => steps.push(["label", `key ${c}`]));
      break;
    }
    case "max": opts.forEach((o, k) => { if (k) steps.push(["label", "next field"]); String(evalExpr(o.text)).split("").forEach((c) => steps.push(["label", `key ${c}`])); }); break;
    case "build": {
      const toks: string[] = lab.tokens;
      const find = (cur: string[]): string[] | null => {
        if (cur.length && compact(cur.join(" ")) === compact(text)) return cur;
        if (cur.length > 7 || !compact(text).startsWith(compact(cur.join(" ")))) return null;
        for (const t of toks) { const r = find([...cur, t]); if (r) return r; }
        return null;
      };
      const seq = /none of these/i.test(text) ? (lab.noneBuild as string[]) : find([]);
      if (!seq) { bad++; console.log("unbuildable", i + 1); break; }
      seq.forEach((t) => steps.push(["label", `piece ${t}`]));
      break;
    }
    default: bad++; console.log("no lab", i + 1);
  }
  return { id, n: i + 1, key, steps };
});
fs.writeFileSync(out, JSON.stringify(plans));
console.log("plans", plans.length, "problems", bad);
if (bad) process.exit(1);
