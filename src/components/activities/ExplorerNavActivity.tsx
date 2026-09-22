"use client";

import React from "react";
import { Compass } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps, optionLabel } from "./kit";

/**
 * Q4 — Explorer route builder.
 *
 * The student actually walks the route: for each leg they set a heading on the compass
 * pad and the explorer marches that distance across the map. The final displacement is
 * measured off the map and mapped to the compass option it points at.
 */

type Heading = "N" | "E" | "S" | "W";
interface NavState {
  legs: (Heading | null)[];
}

const LEGS = [70, 70, 30, 25];
const VEC: Record<Heading, [number, number]> = { N: [0, 1], E: [1, 0], S: [0, -1], W: [-1, 0] };

const COMPASS: { name: string; deg: number }[] = [
  { name: "North", deg: 0 },
  { name: "North-East", deg: 45 },
  { name: "East", deg: 90 },
  { name: "South-East", deg: 135 },
  { name: "South", deg: 180 },
  { name: "South-West", deg: 225 },
  { name: "West", deg: 270 },
  { name: "North-West", deg: 315 },
];

function bearingName(dx: number, dy: number) {
  if (dx === 0 && dy === 0) return { name: "Back at start", deg: null as number | null };
  const deg = (((Math.atan2(dx, dy) * 180) / Math.PI) + 360) % 360;
  let best = COMPASS[0];
  let bestDiff = 999;
  for (const c of COMPASS) {
    const d = Math.min(Math.abs(c.deg - deg), 360 - Math.abs(c.deg - deg));
    if (d < bestDiff) {
      bestDiff = d;
      best = c;
    }
  }
  return { name: best.name, deg };
}

export function ExplorerNavActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<NavState>) {
  const engine = useActivityEngine<NavState, string>({
    initialState: { legs: [null, null, null, null] },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      if (s.legs.some((l) => l === null)) return undefined;
      let x = 0;
      let y = 0;
      s.legs.forEach((h, i) => {
        const [vx, vy] = VEC[h as Heading];
        x += vx * LEGS[i];
        y += vy * LEGS[i];
      });
      const { name, deg } = bearingName(x, y);
      const opts = question?.multipleChoiceConfig?.options || [];
      // Exact compass-name match first, otherwise the closest compass option
      const exact = opts.find((o) => o.text.trim().toLowerCase().startsWith(name.toLowerCase()));
      if (exact) return exact.id;
      if (deg === null) return undefined;
      let best: string | undefined;
      let bestDiff = 999;
      for (const o of opts) {
        const c = COMPASS.find((cc) => o.text.trim().toLowerCase().startsWith(cc.name.toLowerCase()));
        if (!c) continue;
        const d = Math.min(Math.abs(c.deg - deg), 360 - Math.abs(c.deg - deg));
        if (d < bestDiff) {
          bestDiff = d;
          best = o.id;
        }
      }
      return best;
    },
  });

  // Walk the route that has been set so far
  const path: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  engine.state.legs.forEach((h, i) => {
    if (!h) return;
    const p = path[path.length - 1];
    const [vx, vy] = VEC[h];
    path.push({ x: p.x + vx * LEGS[i], y: p.y + vy * LEGS[i] });
  });
  const end = path[path.length - 1];
  const complete = engine.state.legs.every(Boolean);
  const bearing = bearingName(end.x, end.y);

  // Map projection
  const pad = 26;
  const W = 320;
  const H = 240;
  const xs = path.map((p) => p.x).concat(0);
  const ys = path.map((p) => p.y).concat(0);
  const spanX = Math.max(60, Math.max(...xs) - Math.min(...xs));
  const spanY = Math.max(60, Math.max(...ys) - Math.min(...ys));
  const scale = Math.min((W - pad * 2) / spanX, (H - pad * 2) / spanY);
  const ox = W / 2 - ((Math.max(...xs) + Math.min(...xs)) / 2) * scale;
  const oy = H / 2 + ((Math.max(...ys) + Math.min(...ys)) / 2) * scale;
  const px = (p: { x: number; y: number }) => ({ x: ox + p.x * scale, y: oy - p.y * scale });

  return (
    <ActivityShell
      icon={Compass}
      title="Explorer Route Plotter"
      howTo="Set the heading for each leg of the walk. The explorer marches that distance on the map, and the final displacement from the start decides your compass answer."
      answerText={complete ? bearing.name : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint={`Set the heading for leg ${engine.state.legs.findIndex((l) => !l) + 1} of 4.`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_230px]">
        <Stage label="Survey map">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            <defs>
              <pattern id="nav-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0 L0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={W} height={H} fill="url(#nav-grid)" />

            {path.length > 1 && (
              <polyline
                points={path.map((p) => { const q = px(p); return `${q.x},${q.y}`; }).join(" ")}
                fill="none"
                stroke="#0284c7"
                strokeWidth={3}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}
            {complete && (
              <line x1={px(path[0]).x} y1={px(path[0]).y} x2={px(end).x} y2={px(end).y} stroke="#059669" strokeWidth={2.5} strokeDasharray="6 4" />
            )}
            <circle cx={px(path[0]).x} cy={px(path[0]).y} r={6} fill="#0f172a" />
            <text x={px(path[0]).x + 9} y={px(path[0]).y - 7} fontSize={10} fontWeight="bold" fill="#0f172a">Start</text>
            <circle cx={px(end).x} cy={px(end).y} r={7} fill="#059669" stroke="#fff" strokeWidth={2} />
            <text x={px(end).x + 10} y={px(end).y + 4} fontSize={10} fontWeight="bold" fill="#065f46">Rajesh</text>

            <g transform="translate(288,30)">
              <circle r={17} fill="white" stroke="#cbd5e1" strokeWidth={1.5} />
              <text y={-5} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#0f172a">N</text>
              <path d="M0 6 L0 -2" stroke="#e11d48" strokeWidth={2} />
            </g>
          </svg>
        </Stage>

        <div className="space-y-2">
          {LEGS.map((dist, i) => {
            const enabled = i === 0 || !!engine.state.legs[i - 1];
            return (
              <div key={i} className={`rounded-xl border-2 p-2 ${enabled ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-60"}`}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Leg {i + 1} — walk {dist} m
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {(["N", "E", "S", "W"] as Heading[]).map((h) => (
                    <button
                      key={h}
                      type="button"
                      disabled={engine.readOnly || !enabled}
                      onClick={() =>
                        engine.update((s) => {
                          const legs = s.legs.slice();
                          legs[i] = h;
                          return { legs };
                        })
                      }
                      className={`h-10 rounded-lg border-2 text-xs font-black transition ${
                        engine.state.legs[i] === h
                          ? "bg-emerald-600 border-emerald-700 text-white"
                          : "bg-white border-slate-200 text-slate-600 hover:border-emerald-400"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          <ReadOut
            label="Displacement"
            value={`${Math.abs(end.x)} m ${end.x < 0 ? "W" : end.x > 0 ? "E" : ""} · ${Math.abs(end.y)} m ${end.y < 0 ? "S" : end.y > 0 ? "N" : ""}`}
            tone={complete ? "emerald" : "slate"}
          />
        </div>
      </div>
    </ActivityShell>
  );
}
