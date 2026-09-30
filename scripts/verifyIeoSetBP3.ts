import { IEO_G6_SETB_P3_QUESTIONS as Q, IEO_G6_SETB_P3_KEY as K } from "../src/data/ieo_g6_setb_p3";
import { SPECS } from "../src/components/activities/ieo_g6_setb_p3-play/specs";
import { joinBlocks } from "../src/components/activities/ieo_g6_setb_p3-play/lab";
const norm = (s: string) => s.toLowerCase().replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();
let bad = 0;
function perms(b: string[], max: number): string[][] { const out: string[][] = [[]]; const rec = (cur: string[], used: Set<number>) => { if (cur.length) out.push([...cur]); if (cur.length >= max) return; b.forEach((x, i) => { if (!used.has(i)) { used.add(i); cur.push(x); rec(cur, used); cur.pop(); used.delete(i); } }); }; rec([], new Set()); return out; }
Q.forEach((q, i) => {
  const n = i + 1, s = SPECS[n], m = s.mech, opts = q.multipleChoiceConfig!.options;
  if (q.multipleChoiceConfig!.correctOptionId !== K[i]) { bad++; console.log("key", n); }
  if (m.kind === "assemble" || (m.kind === "build" && Array.isArray(m.blocks))) {
    const bl = m.blocks as string[];
    const made = new Set(perms(bl, 4).map((p) => norm(m.kind === "build" ? p.join("").replace(/\+/g, "") : joinBlocks(p))));
    opts.forEach((o) => { if (!made.has(norm(o.text))) { bad++; console.log("unbuildable", n, o.id, o.text); } });
  }
  if (m.kind === "scale") opts.forEach((o) => { if (!m.stops.find((x) => x.option === o.id)) { bad++; console.log("no stop", n, o.id); } });
  if (!s.World) { bad++; console.log("no world", n); }
});
console.log("checked", Q.length, "problems", bad);
