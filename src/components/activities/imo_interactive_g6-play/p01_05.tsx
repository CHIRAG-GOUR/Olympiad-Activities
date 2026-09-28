"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { World3D, Board, Shell, Bay, Gauge } from "./kit";

// ============================================================================
// Q01 · Robot Formation Control (P, Q, S, R) -> Second from left = Q (B)
// ============================================================================
export function PlayQ01({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { slots: (string | null)[] };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { slots: [null, null, null, null] },
    derive(w) {
      const s = w.slots;
      if (s.some((x) => !x)) return { note: "Place all 4 robots in line" };
      const pIdx = s.indexOf("P");
      const qIdx = s.indexOf("Q");
      const rIdx = s.indexOf("R");
      const sIdx = s.indexOf("S");
      const valid = pIdx < qIdx && rIdx > qIdx && sIdx > qIdx && sIdx < rIdx;
      if (!valid) return { note: "Constraints not yet satisfied" };
      const second = s[1];
      return {
        value: second ?? undefined,
        optionId: second === "Q" ? "B" : second === "P" ? "A" : second === "S" ? "C" : "D",
      };
    },
  });

  const robots = ["P", "Q", "R", "S"];

  const placeRobot = (r: string, slotIdx: number) => {
    const next = [...play.world.slots];
    const prevIdx = next.indexOf(r);
    if (prevIdx !== -1) next[prevIdx] = null;
    next[slotIdx] = r;
    play.set({ slots: next });
  };

  const removeRobot = (slotIdx: number) => {
    const next = [...play.world.slots];
    next[slotIdx] = null;
    play.set({ slots: next });
  };

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "P is to the left of Q.",
        "R is to the right of Q.",
        "S stands between Q and R.",
        "This means the formation from left to right is P → Q → S → R.",
      ]}
      title="Robot Formation Control Room"
      badge="Q01 · Logical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 7], fov: 42 }}>
          <mesh position={[0, -0.6, 0]} receiveShadow>
            <cylinderGeometry args={[4.5, 4.5, 0.4, 32]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.1} />
          </mesh>
          {[-2.4, -0.8, 0.8, 2.4].map((x, i) => {
            const r = play.world.slots[i];
            return (
              <group key={i} position={[x, 0, 0]}>
                <mesh position={[0, -0.38, 0]}>
                  <cylinderGeometry args={[0.65, 0.65, 0.08, 24]} />
                  <meshStandardMaterial
                    color={r ? "#818cf8" : "#cbd5e1"}
                    emissive={r ? "#4f46e5" : "#000000"}
                    emissiveIntensity={r ? 0.4 : 0}
                  />
                </mesh>
                {r && (
                  <group position={[0, 0.4, 0]}>
                    <mesh castShadow>
                      <boxGeometry args={[0.7, 0.8, 0.6]} />
                      <meshStandardMaterial
                        color={r === "Q" ? "#4f46e5" : "#0284c7"}
                        metalness={0.4}
                        roughness={0.2}
                      />
                    </mesh>
                    <mesh position={[0, 0.65, 0]} castShadow>
                      <sphereGeometry args={[0.3, 16, 16]} />
                      <meshStandardMaterial color="#e0e7ff" metalness={0.6} />
                    </mesh>
                    <mesh position={[0, 0.7, 0.25]}>
                      <boxGeometry args={[0.35, 0.12, 0.1]} />
                      <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
                    </mesh>
                  </group>
                )}
              </group>
            );
          })}
        </World3D>

        <Bay title="Formation Slots (Left to Right)">
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((slotIdx) => {
              const r = play.world.slots[slotIdx];
              return (
                <div
                  key={slotIdx}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                    r
                      ? "border-indigo-400 bg-indigo-50/80 shadow-xs"
                      : "border-dashed border-slate-300 bg-slate-50"
                  }`}
                >
                  <span className="text-[11px] font-extrabold uppercase text-slate-500">
                    Slot {slotIdx + 1} {slotIdx === 1 ? "(2nd from left)" : ""}
                  </span>
                  {r ? (
                    <div className="flex flex-col items-center gap-1.5 mt-2">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                        {r}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRobot(slotIdx)}
                        className="text-[10px] font-bold text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-bold my-4">Empty Slot</span>
                  )}
                </div>
              );
            })}
          </div>
        </Bay>

        <Bay title="Available Exploration Robots">
          <div className="flex flex-wrap items-center gap-3">
            {robots.map((r) => {
              return (
                <div key={r} className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-indigo-100 shadow-xs">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-900 font-black text-lg flex items-center justify-center">
                    {r}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-500">Assign to slot:</span>
                    <div className="flex items-center gap-1">
                      {[0, 1, 2, 3].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => placeRobot(r, s)}
                          className={`w-6 h-6 rounded text-xs font-bold transition-all ${
                            play.world.slots[s] === r
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 hover:bg-indigo-50 text-slate-700"
                          }`}
                        >
                          {s + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Bay>

        <Gauge
          label="Second Robot in Line"
          value={
            play.derived.value
              ? `Robot ${play.world.slots[1]} (Option ${play.derived.optionId})`
              : "Arrange all 4 robots according to clues"
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q02 · Cosmic Letter Sequence (A, C, F, J, O, ? -> +2,+3,+4,+5,+6 -> U) (B)
// ============================================================================
export function PlayQ02({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { chosenLetter: string | null };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { chosenLetter: null },
    derive(w) {
      if (!w.chosenLetter) return { note: "Select the missing beacon" };
      const optionId =
        w.chosenLetter === "T" ? "A" : w.chosenLetter === "U" ? "B" : w.chosenLetter === "V" ? "C" : "D";
      return {
        value: w.chosenLetter,
        optionId,
      };
    },
  });

  const sequence = [
    { letter: "A", pos: 1, jump: "+2" },
    { letter: "C", pos: 3, jump: "+3" },
    { letter: "F", pos: 6, jump: "+4" },
    { letter: "J", pos: 10, jump: "+5" },
    { letter: "O", pos: 15, jump: "+6" },
    { letter: play.world.chosenLetter ?? "?", pos: play.world.chosenLetter ? 21 : 0, jump: "" },
  ];

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Look at the alphabet positions: A=1, C=3, F=6, J=10, O=15.",
        "Pattern: 1 (+2) -> 3 (+3) -> 6 (+4) -> 10 (+5) -> 15 (+6) -> 21.",
        "The 21st letter of the alphabet is U.",
      ]}
      title="Cosmic Space Beacon Sequence"
      badge="Q02 · Logical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 5, 8], fov: 42 }}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
            <ringGeometry args={[2.8, 3.2, 64]} />
            <meshStandardMaterial color="#818cf8" emissive="#4f46e5" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.8, 24, 24]} />
            <meshStandardMaterial color="#4f46e5" roughness={0.2} metalness={0.8} />
          </mesh>
          {sequence.map((item, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * 3;
            const z = Math.sin(angle) * 3;
            const isTarget = i === 5;
            return (
              <group key={i} position={[x, 0.4, z]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.4, 20, 20]} />
                  <meshStandardMaterial
                    color={isTarget ? (play.world.chosenLetter === "U" ? "#10b981" : "#f59e0b") : "#6366f1"}
                    emissive={isTarget ? "#059669" : "#4338ca"}
                    emissiveIntensity={0.5}
                  />
                </mesh>
              </group>
            );
          })}
        </World3D>

        <Bay title="Cosmic Alphabet Jumps Tracker">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            {sequence.map((s, i) => (
              <React.Fragment key={i}>
                <div
                  className={`flex flex-col items-center p-2.5 rounded-xl border-2 min-w-[56px] ${
                    i === 5
                      ? "border-emerald-400 bg-emerald-50/80 shadow-md"
                      : "border-indigo-200 bg-indigo-50/50"
                  }`}
                >
                  <span className="text-xl font-black text-indigo-950">{s.letter}</span>
                  <span className="text-[10px] font-bold text-slate-500">
                    Pos {s.pos > 0 ? s.pos : "?"}
                  </span>
                </div>
                {s.jump && (
                  <div className="flex flex-col items-center text-xs font-black text-indigo-600">
                    <span>→</span>
                    <span className="bg-indigo-100 px-1.5 py-0.5 rounded text-[10px]">{s.jump}</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </Bay>

        <Bay title="Select 6th Missing Beacon (Jump +6 from O=15)">
          <div className="grid grid-cols-4 gap-3">
            {["T", "U", "V", "W"].map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => play.set({ chosenLetter: letter })}
                className={`py-3 rounded-xl border-2 font-black text-lg transition-all ${
                  play.world.chosenLetter === letter
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md scale-105"
                    : "border-indigo-100 bg-white text-indigo-950 hover:bg-indigo-50"
                }`}
              >
                {letter}
                <div className="text-[10px] font-normal opacity-80">
                  Pos {letter.charCodeAt(0) - 64}
                </div>
              </button>
            ))}
          </div>
        </Bay>

        <Gauge
          label="Computed Sequence Completion"
          value={
            play.world.chosenLetter
              ? `Beacon ${play.world.chosenLetter} (Position 15 + 6 = 21 -> Option ${play.derived.optionId})`
              : "Select the missing beacon to complete the orbit"
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q03 · Shape Sorting Laboratory (Straight vs Curved -> Circle is odd) (D)
// ============================================================================
export function PlayQ03({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { oddShape: string | null; scannerActive: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { oddShape: null, scannerActive: false },
    derive(w) {
      if (!w.oddShape) return { note: "Identify odd shape" };
      return {
        value: w.oddShape,
        optionId:
          w.oddShape === "Triangle"
            ? "A"
            : w.oddShape === "Square"
            ? "B"
            : w.oddShape === "Pentagon"
            ? "C"
            : "D",
      };
    },
  });

  const shapes = [
    { id: "Triangle", sides: 3, type: "Straight Sides", icon: "▲" },
    { id: "Square", sides: 4, type: "Straight Sides", icon: "■" },
    { id: "Pentagon", sides: 5, type: "Straight Sides", icon: "⬟" },
    { id: "Circle", sides: 0, type: "Curved (No straight sides)", icon: "●" },
  ];

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Triangle has 3 straight line segments.",
        "Square has 4 straight line segments.",
        "Pentagon has 5 straight line segments.",
        "Circle is curved with zero straight edges, making it the odd one out.",
      ]}
      title="3D Shape Sorting Laboratory"
      badge="Q03 · Logical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 7], fov: 42 }}>
          {shapes.map((s, i) => {
            const x = (i - 1.5) * 2.2;
            const isSelected = play.world.oddShape === s.id;
            return (
              <group key={s.id} position={[x, 0, 0]}>
                <mesh position={[0, -0.3, 0]}>
                  <cylinderGeometry args={[0.8, 0.8, 0.1, 24]} />
                  <meshStandardMaterial color={isSelected ? "#ec4899" : "#e2e8f0"} />
                </mesh>
                {s.id === "Triangle" && (
                  <mesh position={[0, 0.4, 0]} castShadow>
                    <cylinderGeometry args={[0.6, 0.6, 0.4, 3]} />
                    <meshStandardMaterial color="#6366f1" roughness={0.3} />
                  </mesh>
                )}
                {s.id === "Square" && (
                  <mesh position={[0, 0.4, 0]} castShadow>
                    <boxGeometry args={[0.8, 0.8, 0.8]} />
                    <meshStandardMaterial color="#0ea5e9" roughness={0.3} />
                  </mesh>
                )}
                {s.id === "Pentagon" && (
                  <mesh position={[0, 0.4, 0]} castShadow>
                    <cylinderGeometry args={[0.7, 0.7, 0.4, 5]} />
                    <meshStandardMaterial color="#10b981" roughness={0.3} />
                  </mesh>
                )}
                {s.id === "Circle" && (
                  <mesh position={[0, 0.4, 0]} castShadow>
                    <sphereGeometry args={[0.55, 24, 24]} />
                    <meshStandardMaterial color="#f43f5e" roughness={0.2} metalness={0.4} />
                  </mesh>
                )}
              </group>
            );
          })}
        </World3D>

        <Bay title="Inspect Geometric Properties">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {shapes.map((s) => (
              <div
                key={s.id}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                  play.world.oddShape === s.id
                    ? "border-rose-500 bg-rose-50 shadow-md scale-105"
                    : "border-indigo-100 bg-white"
                }`}
              >
                <span className="text-3xl">{s.icon}</span>
                <span className="font-extrabold text-indigo-950 text-sm">{s.id}</span>
                <span className="text-[11px] font-bold text-slate-500">{s.type}</span>
                <button
                  type="button"
                  onClick={() => play.set({ oddShape: s.id, scannerActive: true })}
                  className={`mt-2 w-full py-1 rounded-lg text-xs font-bold transition-all ${
                    play.world.oddShape === s.id
                      ? "bg-rose-600 text-white"
                      : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                  }`}
                >
                  Mark as Odd
                </button>
              </div>
            ))}
          </div>
        </Bay>

        <Gauge
          label="Odd Shape Scanner Output"
          value={
            play.world.oddShape
              ? `${play.world.oddShape} identified as different (Option ${play.derived.optionId})`
              : "Inspect shapes and identify the odd one out"
          }
          tone={play.derived.optionId === "D" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q04 · Rescue Drone Navigation (40N, 30E, 40S -> Displacement = East) (C)
// ============================================================================
export function PlayQ04({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type Leg = { dir: "N" | "E" | "S" | "W"; dist: number };
  type World = { legs: Leg[]; executed: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: {
      legs: [
        { dir: "N", dist: 40 },
        { dir: "E", dist: 30 },
        { dir: "S", dist: 40 },
      ],
      executed: false,
    },
    derive(w) {
      if (!w.executed) return { note: "Execute flight" };
      let x = 0;
      let y = 0;
      for (const l of w.legs) {
        if (l.dir === "N") y += l.dist;
        if (l.dir === "S") y -= l.dist;
        if (l.dir === "E") x += l.dist;
        if (l.dir === "W") x -= l.dist;
      }
      let finalDir = "Unknown";
      if (x > 0 && y === 0) finalDir = "East";
      else if (x < 0 && y === 0) finalDir = "West";
      else if (y > 0 && x === 0) finalDir = "North";
      else if (y < 0 && x === 0) finalDir = "South";

      const optionId =
        finalDir === "North" ? "A" : finalDir === "South" ? "B" : finalDir === "East" ? "C" : "D";
      return {
        value: finalDir,
        optionId,
      };
    },
  });

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "40 m North moves coordinate to (0, +40).",
        "30 m East moves coordinate to (+30, +40).",
        "40 m South cancels the North movement, ending at (+30, 0).",
        "From the origin (0,0), (+30,0) is directly East.",
      ]}
      title="3D Rescue Drone Flight Path"
      badge="Q04 · Logical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 8, 8], fov: 45 }}>
          <gridHelper args={[10, 10, "#818cf8", "#e2e8f0"]} position={[0, -0.01, 0]} />
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.05, 24]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
          <group position={[play.world.executed ? 2.4 : 0, 0.5, play.world.executed ? 0 : 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.6, 0.2, 0.6]} />
              <meshStandardMaterial color="#4f46e5" />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
            </mesh>
          </group>
        </World3D>

        <Bay title="Flight Path Segments">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-center">
              <span className="text-[11px] font-bold text-slate-500">Leg 1</span>
              <div className="font-extrabold text-indigo-950 text-base">40 m North ↑</div>
            </div>
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-center">
              <span className="text-[11px] font-bold text-slate-500">Leg 2</span>
              <div className="font-extrabold text-indigo-950 text-base">30 m East →</div>
            </div>
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-center">
              <span className="text-[11px] font-bold text-slate-500">Leg 3</span>
              <div className="font-extrabold text-indigo-950 text-base">40 m South ↓</div>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ ...play.world, executed: true })}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md transition-all"
            >
              🚁 Execute Flight & Calculate Displacement
            </button>
          </div>
        </Bay>

        <Gauge
          label="Direction from Launch Pad"
          value={
            play.derived.value
              ? `Final Position: 30 m East (Option ${play.derived.optionId})`
              : "Press execute to simulate drone flight"
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q05 · Olympiad Race (Asha > Diya > Bela > Chet) -> 2nd = Diya (D)
// ============================================================================
export function PlayQ05({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { ranking: string[] };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { ranking: ["Asha", "Bela", "Chet", "Diya"] },
    derive(w) {
      const r = w.ranking;
      const asha = r.indexOf("Asha");
      const bela = r.indexOf("Bela");
      const chet = r.indexOf("Chet");
      const diya = r.indexOf("Diya");
      const valid = asha < diya && diya < bela && bela < chet;
      if (!valid) return { note: "Arrange according to clues" };
      const second = r[1];
      const optionId =
        second === "Asha" ? "A" : second === "Bela" ? "B" : second === "Chet" ? "C" : "D";
      return {
        value: second,
        optionId,
      };
    },
  });

  const moveUp = (i: number) => {
    if (i <= 0) return;
    const next = [...play.world.ranking];
    const temp = next[i - 1];
    next[i - 1] = next[i];
    next[i] = temp;
    play.set({ ranking: next });
  };

  const moveDown = (i: number) => {
    if (i >= play.world.ranking.length - 1) return;
    const next = [...play.world.ranking];
    const temp = next[i + 1];
    next[i + 1] = next[i];
    next[i] = temp;
    play.set({ ranking: next });
  };

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Asha finishes before Bela.",
        "Bela finishes before Chet.",
        "Diya finishes after Asha but before Bela.",
        "Full finish order: 1st Asha → 2nd Diya → 3rd Bela → 4th Chet.",
      ]}
      title="3D Stadium Race Finishing Order"
      badge="Q05 · Logical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 5, 8], fov: 42 }}>
          {[-3, -1, 1, 3].map((x, i) => (
            <group key={i} position={[x, 0, 0]}>
              <mesh position={[0, -0.2, 0]}>
                <boxGeometry args={[1.6, 0.1, 8]} />
                <meshStandardMaterial color="#ea580c" roughness={0.6} />
              </mesh>
              <group position={[0, 0.4, (i - 1.5) * 1.5]}>
                <mesh castShadow>
                  <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
                  <meshStandardMaterial color={i === 1 ? "#4f46e5" : "#0284c7"} />
                </mesh>
              </group>
            </group>
          ))}
        </World3D>

        <Bay title="Order Runners by Finishing Clues">
          <div className="space-y-2">
            {play.world.ranking.map((runner, i) => (
              <div
                key={runner}
                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                  i === 1
                    ? "border-indigo-500 bg-indigo-50/80 shadow-xs"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-900 font-black text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-extrabold text-indigo-950">{runner}</div>
                    <div className="text-[11px] font-bold text-slate-500">
                      {i === 0
                        ? "1st Place (Winner)"
                        : i === 1
                        ? "2nd Place"
                        : i === 2
                        ? "3rd Place"
                        : "4th Place"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-100 text-indigo-700 font-bold disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(i)}
                    disabled={i === play.world.ranking.length - 1}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-100 text-indigo-700 font-bold disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Bay>

        <Gauge
          label="Second Place Finisher"
          value={
            play.derived.value
              ? `${play.world.ranking[1]} (Option ${play.derived.optionId})`
              : "Arrange runners to satisfy all 3 finish constraints"
          }
          tone={play.derived.optionId === "D" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}
