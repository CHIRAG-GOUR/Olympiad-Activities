"use client";

import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { motion, useAnimationControls } from "framer-motion";
import { Trees, Box, TrainFront, Triangle, FlipHorizontal, Camera, ZoomIn } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchOptionState, matchText, sameSet } from "../imo6a/shared";
import { NumberScale, DraggableDot, DragSurface } from "../imo6a/parts";
import { usePlay, cfg } from "./engine";
import { PlayShell, Bay, Gauge, Btn } from "./PlayShell";
import { Stage3D, useTextTexture, approach } from "./three";

/* ══════════════════════════════════════════════════════════════════════
   Q6 — Living Venn Diagram: Animal Classification Garden (2D)
   Three fenced circles and six garden visitors. The student moves and resizes the fences,
   then walks every visitor into exactly the circles it belongs to. The diagram the
   finished garden forms is the answer.
   ══════════════════════════════════════════════════════════════════════ */

interface Disc {
  x: number;
  y: number;
  r: number;
}
interface Visitor {
  id: string;
  label: string;
  art: string;
  inside: string[];
}
interface GardenWorld {
  discs: Record<string, Disc>;
  selected: string;
  animals: Record<string, { x: number; y: number }>;
}
const FENCE: Record<string, { fill: string; stroke: string }> = {
  Animals: { fill: "#dcfce7", stroke: "#16a34a" },
  Cats: { fill: "#fef3c7", stroke: "#d97706" },
  Dogs: { fill: "#e0f2fe", stroke: "#0284c7" },
};
const inDisc = (d: Disc, x: number, y: number) => Math.hypot(x - d.x, y - d.y) <= d.r;
const subset = (a: Disc, b: Disc) => Math.hypot(a.x - b.x, a.y - b.y) + a.r <= b.r + 0.01;
const apart = (a: Disc, b: Disc) => Math.hypot(a.x - b.x, a.y - b.y) >= a.r + b.r - 0.01;

function classifyGarden(d: Record<string, Disc>): string | undefined {
  const { Cats: c, Dogs: g, Animals: a } = d;
  if (!c || !g || !a) return undefined;
  const ci = subset(c, a);
  const gi = subset(g, a);
  if (ci && gi && apart(c, g)) return "two-disjoint-inside-one";
  if (ci && gi && (subset(c, g) || subset(g, c))) return "concentric-three";
  if (ci !== gi) return "one-inside-one-outside";
  if (!apart(c, g)) return "overlapping-pair";
  return undefined;
}

export function Q06AnimalGarden({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const labels = cfg<string[]>(question, "labels", ["Cats", "Dogs", "Animals"]);
  const animals: Visitor[] = question?.customConfig?.play?.animals ?? [];

  const play = usePlay<GardenWorld>({
    question,
    initial: () => ({
      discs: {
        Animals: { x: 50, y: 52, r: 22 },
        Cats: { x: 20, y: 24, r: 12 },
        Dogs: { x: 80, y: 24, r: 12 },
      },
      selected: "Animals",
      animals: Object.fromEntries(
        animals.map((a, i) => [a.id, { x: 8 + i * 16.5, y: 92 }])
      ),
    }),
    derive: (w) => {
      const wrong = animals.filter((a) => {
        const p = w.animals[a.id];
        if (!p) return true;
        return labels.some((l) => inDisc(w.discs[l], p.x, p.y) !== a.inside.includes(l));
      });
      if (wrong.length) return { note: `${wrong.length} visitor(s) are not yet inside exactly the circles they belong to.` };
      const kind = classifyGarden(w.discs);
      if (!kind) return { note: "Every visitor is home, but the fences do not form a clean diagram yet." };
      const words: Record<string, string> = {
        "two-disjoint-inside-one": "Cats and Dogs apart, both inside Animals",
        "concentric-three": "Circles nested one inside another",
        "one-inside-one-outside": "One circle inside Animals, one outside",
        "overlapping-pair": "Cats and Dogs overlap",
      };
      return { value: words[kind], optionId: matchOptionState(question, kind, (o, b) => o === b) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const home = animals.filter((a) => {
    const p = w.animals[a.id];
    return p && labels.every((l) => inDisc(w.discs[l], p.x, p.y) === a.inside.includes(l));
  }).length;
  const order = [...labels].sort((a, b) => w.discs[b].r - w.discs[a].r);

  return (
    <PlayShell
      title="Animal Classification Garden"
      mission="Drag the fence handles to move the three circles, and resize them with the slider. Then walk every visitor into exactly the circles it belongs to: a kitten is a cat and an animal, but not a dog."
      icon={Trees}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit this garden"
      live={<Gauge label="Visitors home" value={`${home} / ${animals.length}`} tone={home === animals.length ? "emerald" : "violet"} />}
    >
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-3">
        <Bay label="Garden">
          <DragSurface viewBox="0 0 100 100" className="bg-[#f7fee7] rounded-xl">
            {order.map((id) => {
              const d = w.discs[id];
              const t = FENCE[id];
              return (
                <g key={id}>
                  <circle cx={d.x} cy={d.y} r={d.r} fill={t.fill} fillOpacity={0.55} stroke={t.stroke} strokeWidth={w.selected === id ? 1.4 : 0.9} strokeDasharray="2 1" />
                  <text x={d.x} y={d.y - d.r + 4.5} textAnchor="middle" fontSize={3.6} fontWeight={900} fill={t.stroke} pointerEvents="none">
                    {id}
                  </text>
                </g>
              );
            })}
            {order.map((id) => (
              <DraggableDot
                key={`h-${id}`}
                x={w.discs[id].x}
                y={w.discs[id].y - w.discs[id].r}
                r={1.8}
                tone={id === "Animals" ? "emerald" : id === "Cats" ? "rose" : "sky"}
                readOnly={play.readOnly}
                onMove={(x, y) =>
                  play.set((p) => ({ ...p, selected: id, discs: { ...p.discs, [id]: { ...p.discs[id], x, y: y + p.discs[id].r } } }))
                }
              />
            ))}
            {animals.map((a) => {
              const pos = w.animals[a.id] ?? { x: 50, y: 92 };
              return (
                <g key={a.id}>
                  <DraggableDot
                    x={pos.x}
                    y={pos.y}
                    r={3.4}
                    tone="sky"
                    readOnly={play.readOnly}
                    onMove={(x, y) => play.set((p) => ({ ...p, animals: { ...p.animals, [a.id]: { x, y } } }))}
                  />
                  <text x={pos.x} y={pos.y + 1.8} textAnchor="middle" fontSize={5} pointerEvents="none">
                    {a.art}
                  </text>
                </g>
              );
            })}
          </DragSurface>
        </Bay>
        <div className="space-y-3">
          <Bay label="Resize a fence" tone="violet">
            <div className="flex gap-1.5 mb-2">
              {labels.map((l) => (
                <Btn key={l} active={w.selected === l} disabled={play.readOnly} onClick={() => play.patch({ selected: l })}>
                  {l}
                </Btn>
              ))}
            </div>
            <NumberScale
              min={5}
              max={45}
              value={w.discs[w.selected]?.r ?? null}
              onChange={(r) => play.set((p) => ({ ...p, discs: { ...p.discs, [p.selected]: { ...p.discs[p.selected], r } } }))}
              readOnly={play.readOnly}
              label={`${w.selected} fence radius`}
              ticks={false}
            />
          </Bay>
          <Bay label="Visitors">
            <ul className="grid grid-cols-2 gap-1">
              {animals.map((a) => {
                const p = w.animals[a.id];
                const ok = p && labels.every((l) => inDisc(w.discs[l], p.x, p.y) === a.inside.includes(l));
                return (
                  <li key={a.id} className={`text-[11px] font-bold rounded-lg px-2 py-1 border ${ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-slate-200 text-slate-600"}`}>
                    {a.art} {a.label}
                  </li>
                );
              })}
            </ul>
          </Bay>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q7 — Cube Folding Workshop (3D)
   The exact printed net lies flat on the bench. Tap a panel to fold it on its hinge,
   rotate the finished cube with a drag, and photograph the corner you are looking at.
   The camera records which three faces are actually visible.
   ══════════════════════════════════════════════════════════════════════ */

interface NetFace {
  face: string;
  col: number;
  row: number;
}
interface NetNode {
  face: string;
  dir: "up" | "down" | "left" | "right" | null;
  children: NetNode[];
}

function buildNetTree(net: NetFace[], root: string): NetNode | null {
  const byPos = new Map(net.map((f) => [`${f.col},${f.row}`, f]));
  const start = net.find((f) => f.face === root) ?? net[0];
  if (!start) return null;
  const seen = new Set([start.face]);
  const grow = (f: NetFace, dir: NetNode["dir"]): NetNode => {
    const node: NetNode = { face: f.face, dir, children: [] };
    const steps: [number, number, NetNode["dir"]][] = [
      [0, -1, "up"],
      [0, 1, "down"],
      [-1, 0, "left"],
      [1, 0, "right"],
    ];
    for (const [dc, dr, d] of steps) {
      const n = byPos.get(`${f.col + dc},${f.row + dr}`);
      if (n && !seen.has(n.face)) {
        seen.add(n.face);
        node.children.push(grow(n, d));
      }
    }
    return node;
  };
  return grow(start, null);
}

const PANEL_COLORS = ["#c4b5fd", "#a5b4fc", "#f9a8d4", "#fcd34d", "#86efac", "#7dd3fc"];

function Panel({
  face,
  color,
  onToggle,
  register,
}: {
  face: string;
  color: string;
  onToggle?: () => void;
  register: (face: string, m: THREE.Mesh | null) => void;
}) {
  const tex = useTextTexture(face, { bg: color, fg: "#1e1b4b", border: "#ffffff", scale: 0.6 });
  const mats = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({ color: "#f8fafc" });
    const inside = new THREE.MeshStandardMaterial({ color: "#e2e8f0" });
    const front = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 });
    return [edge, edge, edge, edge, front, inside];
  }, [tex]);
  return (
    <mesh
      ref={(m) => register(face, m)}
      material={mats}
      castShadow
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.();
      }}
    >
      <boxGeometry args={[0.98, 0.98, 0.03]} />
    </mesh>
  );
}

function Hinge({
  node,
  folds,
  onToggle,
  register,
  colorOf,
}: {
  node: NetNode;
  folds: Record<string, boolean>;
  onToggle: (face: string) => void;
  register: (face: string, m: THREE.Mesh | null) => void;
  colorOf: (face: string) => string;
}) {
  const pivot = useRef<THREE.Group>(null);
  const target = folds[node.face] ? Math.PI / 2 : 0;
  useFrame((_, dt) => {
    const g = pivot.current;
    if (!g || !node.dir) return;
    const axis = node.dir === "up" || node.dir === "down" ? "x" : "y";
    const sign = node.dir === "up" || node.dir === "left" ? -1 : 1;
    g.rotation[axis] = approach(g.rotation[axis], sign * target, 7, dt);
  });
  const off: Record<string, [number, number, number]> = {
    up: [0, 0.5, 0],
    down: [0, -0.5, 0],
    left: [-0.5, 0, 0],
    right: [0.5, 0, 0],
  };
  const inner = (
    <>
      <Panel face={node.face} color={colorOf(node.face)} onToggle={node.dir ? () => onToggle(node.face) : undefined} register={register} />
      {node.children.map((c) => (
        <group key={c.face} position={off[c.dir!]}>
          <Hinge node={c} folds={folds} onToggle={onToggle} register={register} colorOf={colorOf} />
        </group>
      ))}
    </>
  );
  if (!node.dir) return inner;
  return (
    <group ref={pivot}>
      <group position={off[node.dir]}>{inner}</group>
    </group>
  );
}

function CubeBench({
  tree,
  folds,
  onToggle,
  onVisible,
  allFolded,
  colorOf,
}: {
  tree: NetNode;
  folds: Record<string, boolean>;
  onToggle: (f: string) => void;
  onVisible: (faces: string[]) => void;
  allFolded: boolean;
  colorOf: (face: string) => string;
}) {
  const meshes = useRef(new Map<string, THREE.Mesh>());
  const register = (face: string, m: THREE.Mesh | null) => {
    if (m) meshes.current.set(face, m);
    else meshes.current.delete(face);
  };
  const last = useRef("");
  const rig = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const toCam = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    // The bench slides the net so the folded cube ends up centred on the turntable.
    if (rig.current) {
      const ty = allFolded ? 0 : 0.5;
      const tz = allFolded ? 0.5 : 0;
      rig.current.position.y = approach(rig.current.position.y, ty, 4, dt);
      rig.current.position.z = approach(rig.current.position.z, tz, 4, dt);
    }
    if (!allFolded) {
      if (last.current !== "") {
        last.current = "";
        onVisible([]);
      }
      return;
    }
    // The folded cube is centred on the origin, so the view direction is simply the
    // camera's position. A face is in view when its printed side turns towards it.
    toCam.copy(camera.position).normalize();
    const seen: string[] = [];
    meshes.current.forEach((m, face) => {
      m.getWorldDirection(dir);
      if (dir.dot(toCam) > 0.2) seen.push(face);
    });
    const key = seen.sort().join(",");
    if (key !== last.current) {
      last.current = key;
      onVisible(seen);
    }
  });

  return (
    <group ref={rig}>
      <Hinge node={tree} folds={folds} onToggle={onToggle} register={register} colorOf={colorOf} />
    </group>
  );
}

interface CubeWorld {
  folds: Record<string, boolean>;
  photo: string[] | null;
}

export function Q07CubeFolding({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const net = cfg<NetFace[]>(question, "net", []);
  const optionStates = cfg<Record<string, string[]>>(question, "optionStates", {});
  const base = net[Math.min(2, net.length - 1)]?.face ?? "1";
  const tree = useMemo(() => buildNetTree(net, base), [net, base]);
  const foldable = net.map((f) => f.face).filter((f) => f !== base);
  const colorOf = (face: string) => PANEL_COLORS[net.findIndex((f) => f.face === face) % PANEL_COLORS.length];
  const [visible, setVisible] = useState<string[]>([]);

  const play = usePlay<CubeWorld>({
    question,
    initial: { folds: {}, photo: null },
    derive: (w) => {
      if (!foldable.every((f) => w.folds[f])) return { note: "Fold every panel up into the cube." };
      if (!w.photo) return { note: "Turn the cube to a corner and photograph it." };
      return {
        value: `Corner showing ${[...w.photo].sort().join(", ")}`,
        optionId: matchOptionState(question, w.photo, (o, b) => sameSet(o, b)),
      };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const allFolded = foldable.every((f) => w.folds[f]);

  return (
    <PlayShell
      title="Cube Folding Workshop"
      mission="Tap each panel of the printed net to fold it on its hinge. Once the cube is closed, drag to turn it until you look straight at one corner, then photograph what you see."
      icon={Box}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit this cube view"
      live={
        <>
          <Gauge label="Panels folded" value={`${foldable.filter((f) => w.folds[f]).length} / ${foldable.length}`} tone="violet" />
          <Gauge label="Faces in view" value={allFolded ? visible.sort().join(", ") || "—" : "fold first"} tone={visible.length === 3 ? "emerald" : "slate"} />
          {w.photo && <Gauge label="Photo" value={[...w.photo].sort().join(", ")} tone="sky" />}
        </>
      }
    >
      <Stage3D
        height={360}
        camera={{ position: [3.4, 2.2, 6.6], fov: 38 }}
        orbitTarget={[0, 0, 0]}
        minPolar={0.05}
        maxPolar={Math.PI - 0.05}
        readOnly={play.readOnly}
        overlay={
          <div className="inline-block text-[10px] font-bold text-indigo-700 bg-white/80 rounded px-2 py-1">
            {allFolded ? "Drag to turn the cube" : "Tap a panel to fold it"}
          </div>
        }
      >
        {tree && (
          <CubeBench
            tree={tree}
            folds={w.folds}
            allFolded={allFolded}
            colorOf={colorOf}
            onToggle={(f) => !play.readOnly && play.set((p) => ({ ...p, photo: null, folds: { ...p.folds, [f]: !p.folds[f] } }))}
            onVisible={setVisible}
          />
        )}
      </Stage3D>
      <div className="flex flex-wrap gap-2">
        <Btn disabled={play.readOnly} onClick={() => play.set({ folds: Object.fromEntries(foldable.map((f) => [f, true])), photo: null })}>
          Fold every panel
        </Btn>
        <Btn disabled={play.readOnly} onClick={() => play.set({ folds: {}, photo: null })}>
          Lay the net flat
        </Btn>
        <Btn tone="sky" active disabled={play.readOnly || !allFolded || visible.length !== 3} onClick={() => play.patch({ photo: [...visible] })}>
          <span className="inline-flex items-center gap-1">
            <Camera className="w-4 h-4" /> Photograph this corner
          </span>
        </Btn>
        {allFolded && visible.length !== 3 && <span className="text-[11px] font-semibold text-slate-500 self-center">Turn the cube until exactly three faces are in view.</span>}
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q8 — 6 Hunter (2D)
   The series arrives as a train, one digit per carriage. The student opens the couplings
   of every 6, inspects the carriages either side, and stamps it. The stamps are counted.
   ══════════════════════════════════════════════════════════════════════ */

interface HunterWorld {
  stamps: Record<number, "yes" | "no">;
  open: number | null;
}

function Carriage({ digit, i, active, stamp, onTap, readOnly }: { digit: number; i: number; active: boolean; stamp?: "yes" | "no"; onTap: () => boolean; readOnly?: boolean }) {
  const controls = useAnimationControls();
  return (
    <motion.button
      type="button"
      disabled={readOnly}
      animate={controls}
      onClick={() => {
        // A carriage that is not the digit being hunted shudders instead of opening.
        if (!onTap()) controls.start({ x: [0, -5, 5, -3, 3, 0], transition: { duration: 0.35 } });
      }}
      className={`relative shrink-0 w-12 h-16 rounded-lg border-2 font-mono text-2xl font-black grid place-items-center ${
        active ? "bg-violet-600 border-violet-700 text-white" : stamp === "yes" ? "bg-emerald-100 border-emerald-500 text-emerald-900" : stamp === "no" ? "bg-slate-200 border-slate-400 text-slate-500" : "bg-white border-slate-300 text-slate-900"
      }`}
      aria-label={`Carriage ${i + 1}: ${digit}`}
    >
      {digit}
      <span className="absolute -bottom-2 left-1.5 w-3 h-3 rounded-full bg-slate-700" />
      <span className="absolute -bottom-2 right-1.5 w-3 h-3 rounded-full bg-slate-700" />
      {stamp && <span className="absolute -top-2 -right-2 text-[10px] font-black bg-white border rounded px-1">{stamp === "yes" ? "✓" : "✗"}</span>}
    </motion.button>
  );
}

export function Q08SixHunter({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const series = cfg<number[]>(question, "series", []);
  const target = cfg<number>(question, "target", 6);
  const before = cfg<number>(question, "precededBy", 9);
  const after = cfg<number>(question, "notFollowedBy", 3);
  const sixes = series.map((d, i) => (d === target ? i : -1)).filter((i) => i >= 0);

  const play = usePlay<HunterWorld>({
    question,
    initial: { stamps: {}, open: null },
    derive: (w) => {
      const left = sixes.filter((i) => !w.stamps[i]).length;
      if (left) return { note: `${left} carriage(s) carrying ${target} still need a stamp.` };
      const n = sixes.filter((i) => w.stamps[i] === "yes").length;
      return { value: `QUALIFYING ${target}s: ${n}`, optionId: matchNumber(question, n) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const o = w.open;

  return (
    <PlayShell
      title="6 Hunter"
      mission={`Tap every carriage carrying a ${target} to open its couplings. Inspect the carriage in front and the one behind, then stamp it: does it qualify (a ${before} just before it and no ${after} just after it)?`}
      icon={TrainFront}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the count"
      live={
        <>
          <Gauge label={`${target}s inspected`} value={`${sixes.filter((i) => w.stamps[i]).length} / ${sixes.length}`} tone="violet" />
          <Gauge label="Qualifying stamps" value={sixes.filter((i) => w.stamps[i] === "yes").length} tone="emerald" />
        </>
      }
    >
      <div className="rounded-2xl bg-gradient-to-b from-sky-100 to-sky-50 border-2 border-sky-200 p-3 overflow-x-auto">
        <motion.div
          initial={{ x: 480 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 14 }}
          className="flex gap-1.5 items-end min-w-max pb-3 border-b-4 border-slate-700"
        >
          <div className="shrink-0 w-14 h-20 rounded-t-2xl rounded-bl-lg bg-violet-700 text-white text-[10px] font-black grid place-items-center">ENGINE</div>
          {series.map((d, i) => (
            <Carriage
              key={i}
              i={i}
              digit={d}
              active={o === i}
              stamp={w.stamps[i]}
              readOnly={play.readOnly}
              onTap={() => {
                if (d !== target) return false;
                play.patch({ open: i });
                return true;
              }}
            />
          ))}
        </motion.div>
      </div>
      {o !== null && (
        <Bay label={`Coupling inspector — carriage ${o + 1}`} tone="violet">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 font-mono text-3xl font-black">
              <span className="w-12 h-14 grid place-items-center rounded-lg border-2 border-amber-400 bg-amber-50">{o > 0 ? series[o - 1] : "·"}</span>
              <span className="text-slate-400 text-xl">⟷</span>
              <span className="w-12 h-14 grid place-items-center rounded-lg border-2 border-violet-600 bg-violet-600 text-white">{series[o]}</span>
              <span className="text-slate-400 text-xl">⟷</span>
              <span className="w-12 h-14 grid place-items-center rounded-lg border-2 border-amber-400 bg-amber-50">{o < series.length - 1 ? series[o + 1] : "·"}</span>
            </div>
            <div className="flex gap-2">
              <Btn tone="emerald" active={w.stamps[o] === "yes"} disabled={play.readOnly} onClick={() => play.patch({ stamps: { ...w.stamps, [o]: "yes" } })}>
                Stamp: qualifies
              </Btn>
              <Btn tone="slate" active={w.stamps[o] === "no"} disabled={play.readOnly} onClick={() => play.patch({ stamps: { ...w.stamps, [o]: "no" } })}>
                Stamp: does not qualify
              </Btn>
            </div>
          </div>
        </Bay>
      )}
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q9 — Triangle Detective (2D)
   The printed figure is rebuilt from its actual lines. The student taps three corner
   points to trace a triangle; the scanner accepts it only if all three sides are drawn
   lines of the figure, and remembers each distinct triangle once.
   ══════════════════════════════════════════════════════════════════════ */

type Pt = [number, number];
type Seg = [Pt, Pt];
const EPS = 1e-3;

function intersect(s: Seg, t: Seg): Pt | null {
  const [[x1, y1], [x2, y2]] = s;
  const [[x3, y3], [x4, y4]] = t;
  const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(d) < 1e-9) return null;
  const a = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
  const b = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / d;
  if (a < -EPS || a > 1 + EPS || b < -EPS || b > 1 + EPS) return null;
  return [x1 + a * (x2 - x1), y1 + a * (y2 - y1)];
}
const onSeg = (p: Pt, [[x1, y1], [x2, y2]]: Seg) => {
  const cross = (x2 - x1) * (p[1] - y1) - (y2 - y1) * (p[0] - x1);
  if (Math.abs(cross) > 1e-3) return false;
  return p[0] >= Math.min(x1, x2) - EPS && p[0] <= Math.max(x1, x2) + EPS && p[1] >= Math.min(y1, y2) - EPS && p[1] <= Math.max(y1, y2) + EPS;
};

function analyse(segs: Seg[]) {
  const pts: Pt[] = [];
  const addPt = (p: Pt) => {
    if (!pts.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 1e-3)) pts.push(p);
  };
  segs.forEach((s) => {
    addPt(s[0]);
    addPt(s[1]);
  });
  segs.forEach((s, i) => segs.slice(i + 1).forEach((t) => {
    const p = intersect(s, t);
    if (p) addPt(p);
  }));
  const joined = (a: Pt, b: Pt) => segs.some((s) => onSeg(a, s) && onSeg(b, s));
  return { pts, joined };
}

const round2 = (v: number) => Math.round(v * 100) / 100;

interface TriWorld {
  picks: number[];
  found: string[];
  zoom: boolean;
}

export function Q09TriangleDetective({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const segs: Seg[] = question?.customConfig?.play?.segments ?? [];
  const { pts, joined } = useMemo(() => analyse(segs), [segs]);
  const X = (x: number) => 10 + x * 20;
  const Y = (y: number) => 6 + y * 20;
  const [flash, setFlash] = useState<string | null>(null);

  const play = usePlay<TriWorld>({
    question,
    initial: { picks: [], found: [], zoom: false },
    derive: (w) => {
      if (!w.found.length) return { note: "Trace your first triangle by tapping three corner points." };
      const n = w.found.length;
      const opt = matchNumber(question, n) ?? matchText(question, "None of these");
      return { value: `${n} triangles found`, optionId: opt };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;

  const tap = (i: number) => {
    if (play.readOnly) return;
    const picks = w.picks.includes(i) ? w.picks.filter((p) => p !== i) : [...w.picks, i];
    if (picks.length < 3) return play.patch({ picks });
    const [a, b, c] = picks.map((k) => pts[k]);
    const area = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const key = [...picks].sort((m, n) => m - n).join("-");
    if (Math.abs(area) < 1e-6 || !joined(a, b) || !joined(b, c) || !joined(a, c)) {
      setFlash("Those three points are not joined by drawn lines — no triangle there.");
      return play.patch({ picks: [] });
    }
    if (w.found.includes(key)) {
      setFlash("Already in your case file.");
      return play.patch({ picks: [] });
    }
    setFlash(`Triangle #${w.found.length + 1} logged.`);
    play.patch({ picks: [], found: [...w.found, key] });
  };

  return (
    <PlayShell
      title="Triangle Detective"
      mission="Tap three corner points to trace a triangle. The scanner only accepts it if all three sides are real lines in the figure, and it never counts the same triangle twice. Log as many as you can find."
      icon={Triangle}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit my triangle count"
      live={
        <>
          <Gauge label="Triangles logged" value={w.found.length} tone="violet" />
          <Gauge label="Corners selected" value={`${w.picks.length} / 3`} />
          {flash && <Gauge label="Scanner" value={flash} tone="amber" />}
        </>
      }
    >
      <div className="grid md:grid-cols-[1.5fr_1fr] gap-3">
        <Bay
          label={
            <span className="flex items-center justify-between">
              Figure
              <button type="button" onClick={() => play.patch({ zoom: !w.zoom })} className="inline-flex items-center gap-1 text-violet-700" disabled={play.readOnly}>
                <ZoomIn className="w-3.5 h-3.5" /> {w.zoom ? "Normal view" : "Magnifier"}
              </button>
            </span>
          }
        >
          <div className={`overflow-auto rounded-xl bg-white border border-slate-200 ${w.zoom ? "max-h-[420px]" : ""}`}>
            <svg viewBox="0 0 100 80" className={w.zoom ? "w-[200%]" : "w-full"}>
              {w.found.map((k, n) => {
                const tri = k.split("-").map((i) => pts[Number(i)]);
                return <polygon key={k} points={tri.map((p) => `${X(p[0])},${Y(p[1])}`).join(" ")} fill={`hsl(${(n * 47) % 360} 80% 70%)`} fillOpacity={0.28} />;
              })}
              {segs.map((s, i) => (
                <line key={i} x1={X(s[0][0])} y1={Y(s[0][1])} x2={X(s[1][0])} y2={Y(s[1][1])} stroke="#1e1b4b" strokeWidth={0.7} />
              ))}
              {w.picks.length >= 2 &&
                w.picks.slice(1).map((k, i) => (
                  <line key={k} x1={X(pts[w.picks[i]][0])} y1={Y(pts[w.picks[i]][1])} x2={X(pts[k][0])} y2={Y(pts[k][1])} stroke="#7c3aed" strokeWidth={1.4} strokeDasharray="1.5 1" />
                ))}
              {pts.map((p, i) => (
                <g key={i} role="button" aria-label={`corner ${round2(p[0])},${round2(p[1])}`} onClick={() => tap(i)} style={{ cursor: "pointer" }}>
                  <circle cx={X(p[0])} cy={Y(p[1])} r={3.2} fill="transparent" />
                  <circle cx={X(p[0])} cy={Y(p[1])} r={w.picks.includes(i) ? 2 : 1.2} fill={w.picks.includes(i) ? "#7c3aed" : "#a78bfa"} stroke="#fff" strokeWidth={0.4} />
                </g>
              ))}
            </svg>
          </div>
        </Bay>
        <Bay label="Case file" tone="violet">
          {w.found.length === 0 ? (
            <p className="text-xs text-slate-500 font-semibold">No triangles logged yet.</p>
          ) : (
            <ol className="grid grid-cols-3 gap-1">
              {w.found.map((k, n) => (
                <li key={k} className="text-[10px] font-black rounded border px-1 py-0.5 text-center" style={{ background: `hsl(${(n * 47) % 360} 80% 92%)` }}>
                  #{n + 1}
                </li>
              ))}
            </ol>
          )}
          <Btn className="mt-2" disabled={play.readOnly || !w.found.length} onClick={() => play.patch({ found: w.found.slice(0, -1) })}>
            Undo last
          </Btn>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q10 — Mirror Room (2D)
   The figure stands in a mirror room. The student slides the mirror to an edge of the
   figure; the reflection is computed live. Capturing it records the reflection that
   mirror position really produces.
   ══════════════════════════════════════════════════════════════════════ */

type MirrorEdge = "left" | "right" | "top" | "bottom";
interface MirrorWorld {
  edge: MirrorEdge | null;
  captured: MirrorEdge | null;
}

function Strip({ text }: { text: string }) {
  const s = { stroke: "#1e1b4b", strokeWidth: 0.9, fill: "none" };
  return (
    <g>
      <defs>
        <pattern id="imo6a-hatch" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
          <line x1="0" y1="0" x2="0" y2="2" stroke="#475569" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x={0} y={0} width={80} height={32} {...s} fill="#fff" />
      {/* left cell: hatched top, split bottom */}
      <rect x={0} y={0} width={14} height={16} fill="url(#imo6a-hatch)" stroke="#1e1b4b" strokeWidth={0.9} />
      <rect x={0} y={16} width={14} height={16} {...s} />
      <line x1={0} y1={32} x2={14} y2={16} {...s} />
      {/* right cell: split top, hatched bottom */}
      <rect x={66} y={0} width={14} height={16} {...s} />
      <line x1={66} y1={16} x2={80} y2={0} {...s} />
      <rect x={66} y={16} width={14} height={16} fill="url(#imo6a-hatch)" stroke="#1e1b4b" strokeWidth={0.9} />
      {/* caps: a bowl hanging from the top edge, a dome rising from the bottom edge */}
      <path d="M 34 0 A 6 6 0 0 0 46 0 Z" fill="#1e1b4b" />
      <path d="M 34 32 A 6 6 0 0 1 46 32 Z" fill="#1e1b4b" />
      <text x={40} y={20} textAnchor="middle" fontSize={9} fontWeight={800} fill="#1e1b4b" letterSpacing={1}>
        {text}
      </text>
    </g>
  );
}

export function Q10MirrorRoom({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const source = cfg<{ text: string }>(question, "source", { text: "XYZ" });

  const reflectState = (edge: MirrorEdge) =>
    edge === "left" || edge === "right"
      ? { text: source.text.split("").reverse().join(""), flipped: true, hatchOn: "right", capsOn: "top" }
      : { text: source.text, flipped: false, hatchOn: "left", capsOn: "bottom" };

  const play = usePlay<MirrorWorld>({
    question,
    initial: { edge: null, captured: null },
    derive: (w) => {
      if (!w.captured) return { note: "Stand the mirror against the figure, then capture its reflection." };
      const st = reflectState(w.captured);
      return {
        value: `Reflection in a mirror on the ${w.captured} edge`,
        optionId: matchOptionState(question, st, (o, b) => o.text === b.text && o.flipped === b.flipped && o.hatchOn === b.hatchOn && o.capsOn === b.capsOn),
      };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const e = w.edge;
  // Figure occupies x 90..170, y 40..72 in a 260×112 room, leaving space on every side
  // for the reflection.
  const ox = 90;
  const oy = 40;
  const reflection =
    e === "right"
      ? `translate(${2 * (ox + 80)} 0) scale(-1 1)`
      : e === "left"
        ? `translate(${2 * ox} 0) scale(-1 1)`
        : e === "bottom"
          ? `translate(0 ${2 * (oy + 32)}) scale(1 -1)`
          : e === "top"
            ? `translate(0 ${2 * oy}) scale(1 -1)`
            : null;
  const mirrorLine: Record<MirrorEdge, [number, number, number, number]> = {
    right: [ox + 81, oy - 6, ox + 81, oy + 38],
    left: [ox - 1, oy - 6, ox - 1, oy + 38],
    top: [ox - 6, oy - 1, ox + 86, oy - 1],
    bottom: [ox - 6, oy + 33, ox + 86, oy + 33],
  };

  return (
    <PlayShell
      title="Mirror Room"
      mission="Slide the mirror to the edge of the figure where the printed question stands it. The room shows the true reflection that mirror casts. Capture it when you are sure the mirror is in the right place."
      icon={FlipHorizontal}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the captured reflection"
      live={
        <>
          <Gauge label="Mirror" value={e ? `${e} edge` : "not placed"} tone="violet" />
          <Gauge label="Captured" value={w.captured ? `${w.captured} edge` : "—"} tone="sky" />
        </>
      }
    >
      <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-100 to-indigo-50 p-2">
        <svg viewBox="0 0 260 112" className="w-full">
          <g transform={`translate(${ox} ${oy})`}>
            <Strip text={source.text} />
          </g>
          {reflection && (
            <motion.g key={e} initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transform={reflection}>
              <g transform={`translate(${ox} ${oy})`}>
                <Strip text={source.text} />
              </g>
            </motion.g>
          )}
          {e && (
            <line
              x1={mirrorLine[e][0]}
              y1={mirrorLine[e][1]}
              x2={mirrorLine[e][2]}
              y2={mirrorLine[e][3]}
              stroke="#64748b"
              strokeWidth={2.2}
              strokeDasharray="1 0.6"
            />
          )}
          {(["left", "right", "top", "bottom"] as MirrorEdge[]).map((edge) => {
            const [x1, y1, x2, y2] = mirrorLine[edge];
            return (
              <line
                key={edge}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="transparent"
                strokeWidth={9}
                style={{ cursor: "pointer" }}
                onClick={() => !play.readOnly && play.set((p) => ({ ...p, edge, captured: null }))}
              />
            );
          })}
        </svg>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[10px] font-bold text-slate-500">MIRROR POSITION:</span>
        {(["left", "right", "top", "bottom"] as MirrorEdge[]).map((edge) => (
          <Btn key={edge} active={e === edge} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, edge, captured: null }))}>
            {edge} edge
          </Btn>
        ))}
        <Btn tone="sky" active disabled={play.readOnly || !e} onClick={() => play.patch({ captured: e })}>
          <span className="inline-flex items-center gap-1">
            <Camera className="w-4 h-4" /> Capture reflection
          </span>
        </Btn>
      </div>
    </PlayShell>
  );
}
